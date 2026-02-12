from flask_restx import Resource, Namespace, fields
from flask import request

from ..models import User
from ..extensions import db

import re

register_ns = Namespace('register', description='Register route', path='/auth')

register_models = register_ns.model(
  'User',
  {
    'name': fields.String(required=True),
    'email': fields.String(required=True),
    'password': fields.String(required=True)
  }
  )

@register_ns.route('/register')
class Register(Resource):
  @register_ns.expect(register_models)
  def post(self): 
    
    data = request.get_json() or {}
    
    # Check naming convetion ie userName from js
    full_name = data.get('name')
    email = data.get('email')
    password = data.get('password')
    
    if not full_name or not email or not password:
      return{
        'msg': 'All fields are required!'
      }
      
    if len(full_name) < 2:
      return{
        'msg': 'full_name must be greater than 2 characters!'
      }, 400
      
    if len(email) < 2: 
      return {
        'msg': 'Email must be greater than 2 characters!'
      }, 400
    
    if not '@' in email or not '.' in email:
      return {
        'msg': 'Invalid email format'
      }, 400
      
    # Password validation
    if len(password) < 8: 
      return {
        "msg": "Password should be at least 8 characters long."
      }, 400
      
    if not re.search(r"[0-9]", password) and not re.search(r"[!@#$%^&*(),.?\":{}|<>]", password):
      return {
        "msg": "Password should include at least one number or special character!"
      }, 400
      
    if db.session.query(User).filter_by(email=email).first():
      return{
        'msg': 'Email already exists!'
      }, 409
      
    new_user = User(
      full_name=full_name,
      email=email
      )
    new_user.set_password(password)
    
    db.session.add(new_user)
    db.session.commit()
    db.session.close()
    
    return {
      'msg':'Account created successfully.'
    }, 201