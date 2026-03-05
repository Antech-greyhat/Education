from datetime import datetime, timedelta
from flask_restx import Namespace, Resource, fields

from ..models import User
from ..extensions import db
from ..send_email import send_otp

import secrets, string

otp_renew_ns = Namespace('otp_renew', description='OTP renewal related operations', path='/auth')

otp_renew_ns_models = otp_renew_ns.model(
  'OTPResendRequest', 
  { 'otp_id': fields.String(required=True, description='The ID of the OTP to be renewed') 
    
  })

@otp_renew_ns.route('/otp-resend')
class OTPResendResource(Resource):
  @otp_renew_ns.expect(otp_renew_ns_models)
    
  def post(self):

    data = otp_renew_ns.payload

    otp_id = data.get('otp_id')

    if not otp_id:
      return{
        'msg': 'Missing otp resend credentials'
        }, 401

    user = User.query.filter_by(otp_id=otp_id).first()

    if user:
      if user.otp_sent_at:
        if (datetime.utcnow() - user.otp_sent_at).total_seconds() < 60:
          return {
            'msg': 'OTP resend request too soon. Please wait before requesting again.'
          }, 429

      otp = ''.join(secrets.choice(string.digits) for _ in range(6))
      expiry = datetime.utcnow() + timedelta(minutes=15)


      email = user.email
      name = user.full_name
      
      user.set_otp(otp)
      user.otp_expiry = expiry
      user.otp_sent_at = datetime.utcnow()

      db.session.commit()

      send_otp(otp, email, name)

    return {
      'msg': 'If the account exists, OTP have been sent successfully.'
    }, 200
