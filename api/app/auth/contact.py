from flask_restx import Namespace, Resource, fields
from email_validator import validate_email, EmailNotValidError

from ..models import Message
from ..extensions import db

contact_ns = Namespace('contact', description='Contact related endpoint', path='/auth')

# document models

contact_model = contact_ns.model(
  'Message',{
    'firstName': fields.String(required=True),
    'lastName': fields.String(required=True),
    'email': fields.String(required=True),
    'subject': fields.String(required=True),
    'message': fields.String(required=True)
  }
)

@contact_ns.route('/contact')
class Protect(Resource):
  @contact_ns.expect(contact_model, validate=True)
  def post(self):
    
    data = contact_ns.payload
    
    first_name=data.get('firstName')
    last_name = data.get('lastName')
    email = data.get('email')
    subject = data.get('subject')
    message = data.get('message')
    
    # VALIDATION
    
    if not first_name or not last_name or not message or not email or not subject:
      return {
        'msg': 'All fields are required!'
      }, 400
    
    if len(first_name) < 2:
      return{
        'msg': 'Full name should be greater than 2 characters!'
      }, 400
      
    if len(subject) < 2:
      return{
        'msg': 'Subject should be greater than 2 characters!'
      }, 400
      
    if len(message) < 2:
      return{
        'msg': 'Message should be greater than 2 characters!'
      }, 400
      
    if len(last_name) < 2:
      return{
        'msg': 'Last name should be greater than 2 characters!'
      }, 400

    try:
      valid = validate_email(email, check_deliverability=False)
      email = valid.email
    except EmailNotValidError as e:
      return{
        'msg': 'Invalid email address!'
      }, 400

    new_message = Message(
      first_name=first_name,
      last_name=last_name,
      email=email,
      subject=subject,
      message=message
    )

    db.session.add(new_message)
    db.session.commit()

    return{
      'msg': 'Your message have been submitted successfully.'
    }, 201
