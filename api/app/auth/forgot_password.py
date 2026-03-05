from flask_restx import Namespace, Resource, fields
from datetime import datetime, timedelta
from ..models import User
from ..extensions import db, limiter
from ..send_email import send_password_reset_link
import secrets
import os

forgot_ns = Namespace('forgot', description='Endpoint for getting password reset credentials', path='/auth')

forgot_models = forgot_ns.model('forgot_password',{
    'email': fields.String(required=True)
})

@forgot_ns.route('/forgot_password')
class ForgotPassword(Resource):
  decorators = [limiter.limit('10 per hour')]
  @forgot_ns.expect(forgot_models, validate=True)
  def post(self):
      
    data = forgot_ns.payload

    email = data.get('email')
    
    if not email:
      return{
        'msg': 'Email is required!'
      }, 400
      
    user = User.query.filter_by(email=email).first()

    if user:
      if user.reset_token_sent_at:
        if (datetime.utcnow() - user.reset_token_sent_at).total_seconds() < 60:
          return{
            'msg': 'Password resend request too soon. Please wait before requesting again.'
          }, 429
          
      frontend_url = os.getenv('FRONTEND_URL')

      expirery_time = datetime.utcnow() + timedelta(minutes=10)
      reset_token = secrets.token_urlsafe(31)
      reset_token_id = secrets.token_urlsafe(10)

      user.set_reset_token(reset_token) # hash
      user.reset_token_id = reset_token_id
      user.reset_token_used = False
      user.reset_token_expiry_time = expirery_time
      user.reset_token_sent_at = datetime.utcnow()

      db.session.commit()
      
      reset_url = f'{frontend_url}/password_reset_link.html?reset_token={reset_token}&reset_token_id={reset_token_id}'.rstrip('/')
      
      # SEND RESET PASSWORD LINK
      
      send_password_reset_link(reset_url, email)

    return{
        'msg': 'If the email exists, a password reset link has been sent.'
    }, 200
