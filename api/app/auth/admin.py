from flask_restx import Namespace, Resource, fields
from flask import request
from flask_jwt_extended import create_access_token

from ..models import Admin
from ..extensions import db

admin_ns = Namespace('admin', description='Admin login endpoint', path='/auth') 

admin_models = admin_ns.model('Admin', {
  'email': fields.String(required=True),
  'password': fields.String(required=True)
})

@admin_ns.route('/admin')
class Adminauth(Resource):
  @admin_ns.expect(admin_models)
  def post(self):
    data = request.get_json()
    
    email = data.get('email')
    password = data.get('password')
    
    if not email or not password:
      return{
        'msg': 'All fields are required.'
      }, 400
      
    admin = Admin.query.filter_by(email=email).first()
    
    if admin and admin.check_admin_password(password):
      access_token = create_access_token(identity=admin.id)
      return{
        'msg': 'Approved',
        'access_token': access_token
      }, 200
      
    return {
      'msg':'Invalid credentials'
    }, 400