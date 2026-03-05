from flask_restx import Namespace, Resource, fields
from flask_jwt_extended import create_access_token, create_refresh_token

from ..extensions import db 
from ..models import User

login_ns = Namespace('login', description='Login endpoint', path='/auth')

login_model = login_ns.model(
  'Login', {
    'email': fields.String(required=True),
    'password': fields.String(required=True)
  })
  
@login_ns.route('/login')
class Login(Resource):
  @login_ns.expect(login_model, validate=True)
  def post(self):
    
    data = login_ns.payload
    
    email = data.get('email')
    password = data.get('password')
    
    if not email or not password:
      return{
        'msg': 'All fields are required!'
      }, 400
    
    user = User.query.filter_by(email=email).first()
    
    if user and user.check_password(password): 
      
      if not user.is_verified:
        return{
          'msg': 'Your account have not been verified, check your email for verification code.',
          'otp_id': user.otp_id
        }, 401
        
      access_token = create_access_token(identity=str(user.id))
      refresh_token = create_refresh_token(identity=str(user.id))
      
      return{
        'msg': 'Logged in successfully.',
        'access_token': access_token,
        'refresh_token': refresh_token
      }, 200
      
    return{
      'msg': 'Invalid email or password.'
    }, 400