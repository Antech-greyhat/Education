from flask_restx import Namespace, Resource, field

from flask_jwt_extended import create_access_token, create_refresh_token


from ..models import User
from ..extensions import db

verify_ns = Namespace('account-verify', description='Account verification operations', path='/account-verify')

verify_model = verify_ns.model('AccountVerify', {
  otp = field.String(required=True, description='One-time password for account verification'),
  user_id= field.String(required=True, description='ID of the user to verify')
  })

class VerifyAccount(Resource):
  @verify_ns.expect(verify_model)
  def post(self):

    data = verify_ns.payload

    otp = data.get('otp')
    user_id = data.get('user_id')

    user = User.query.filter_by(id=user_id).first()

    if user.otp_expiry < datetime.utcnow():
      return {'message': 'OTP has expired. Please request for a new one'}, 400

    if user and user.check_otp(otp):
      user.is_verified = True
      user.otp = None
      
      db.session.commit()

      return {
        'msg': 'Account verified successfully.'
        }, 200
    
    return {'msg': 'Invalid credentials'}, 400
      
