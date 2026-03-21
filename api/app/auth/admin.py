from flask_restx import Namespace, Resource, fields
from flask_jwt_extended import create_access_token, create_refresh_token

from ..models import Admin
from ..extensions import db, limiter

admin_ns = Namespace('admin', description='Admin login endpoint', path='/auth') 

admin_models = admin_ns.model('Admin', {
  'email': fields.String(required=True),
  'password': fields.String(required=True)
})

@admin_ns.route('/admin')
class AdminAuth(Resource):
  decorators = [limiter.limit('2 per minute')]
  @admin_ns.expect(admin_models, validate=True)
  def post(self):
    
    data = admin_ns.payload
    
    email = data.get('email')
    password = data.get('password')
    
    if not email or not password:
      return{
        'msg': 'Invalid credentials!'
      }, 400
      
    admin = Admin.query.filter_by(email=email).first()
    
    if admin and admin.check_admin_password(password):
      
      access_token = create_access_token(identity=str(admin.id))
      refresh_token = create_refresh_token(identity=str(admin.id))
      
      return{
        'msg': 'Approved',
        'access_token': access_token,
        'refresh_token': refresh_token
      }, 200
      
    return {
      'msg':'Invalid credentials'
    }, 400
