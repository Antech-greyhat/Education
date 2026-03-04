from flask_jwt_extended import create_access_token, create_refresh_token
from flask_restx import Namespace, Resource, fields
from datetime import datetime

from ..models import User
from ..extensions import db

verify_ns = Namespace("account_verify", description="Account verification operations", path="/auth")

account_verify_models = verify_ns.model('AccountVerify', {
    'otp_id': fields.String(required=True),
    'otp': fields.String(required=True)
})

@verify_ns.route('/verify')
class VerifyAccount(Resource):
  @verify_ns.expect(account_verify_models)
  def post(self):

    data = verify_ns.payload

    otp_id = data.get('otp_id')
    otp = data.get('otp')

    if not otp_id or not otp:
      return {
        "msg": "Missing account verification credentials"
      }, 400

    user = User.query.filter_by(otp_id=otp_id).first()

    if user and user.check_otp(otp):
      if user.otp_expiry < datetime.utcnow():
        return {'msg': 'OTP has expired'}, 400

      user.is_verified = True
      user.otp_id = None
      user.otp = None
      user.otp_expiry = None
      db.session.commit()

      access_token = create_access_token(identity=str(user.id))
      refresh_token = create_refresh_token(identity=str(user.id))

      return {
        "msg": "Account verified successfully",
        'access_token': access_token,
        'refresh_token': refresh_token
      }, 200

    return {'msg': 'Invalid token'}, 400
