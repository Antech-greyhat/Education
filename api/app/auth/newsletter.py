from flask_restx import Namespace, Resource, fields
from email_validator import validate_email, EmailNotValidError

from ..models import Newsletter
from ..extensions import db, limiter

from ..send_email import send_newsletter

news_ns = Namespace('news', description='Newsletter namespace', path='/news')

newsletter_model = news_ns.model(
  'Newsletter', 
  {
    'email': fields.String(required=True)
  })

@news_ns.route('/newsletter')
class NewsletterResource(Resource):
  decorators = [limiter.limit('10 per minute')]
  @news_ns.expect(newsletter_model, validate=True)
  def post(self):
    
    data = news_ns.payload
    
    email = data.get('email')
    
    if not email:
      return{
        'msg': 'Email is required!'
      }, 400
    
    try:
      valid = validate_email(email, check_deliverability=False)
      email = valid.email
    except EmailNotValidError as e:
       return {
         'msg': 'Invalid email address!'
       }, 400
    
    subscriber = db.session.query(Newsletter).filter_by(email=email).first()
    
    if subscriber:
      return{
        "success": False,
        "message": "This email is already subscribed to our newsletter",
        "error": "DUPLICATE_ENTRY"
      }, 409
    
    username = email.split('@')[0].split('.')[0].capitalize()
    
    new_sub = Newsletter(
      email=email,
      username=username
      )
      
    db.session.add(new_sub)
    db.session.commit()
    
    send_newsletter(username, email)
    
    return {
      'msg':'Successfully subscribed to our newsletter',
      'email': email
    }, 201
