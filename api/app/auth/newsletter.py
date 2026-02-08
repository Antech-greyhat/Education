from flask_restx import Namespace, Resource, fields
from flask import request

from ..models import Newsletter, db

news_ns = Namespace('news', description='Newsletter namespace')

newsletter_model = news_ns.model(
  'Newsletter', 
  {
    'email': fields.String(required=True)
  })

@news_ns.route('/newsletter')
class NewsletterResource(Resource):
  @news_ns.expect(newsletter_model)
  def post(self):
    data = request.get_json()
    email = data.get('email')
    
    if not '@' in email or not '.' in email:
      return {
        "success": False,
        "message": "Please provide a valid email address",
        "error": "VALIDATION_ERROR"
      }, 400
    
    subscriber = db.session.query(Newsletter).filter_by(email=email).first()
    
    if subscriber:
      return{
        "success": False,
        "message": "This email is already subscribed to our newsletter",
        "error": "DUPLICATE_ENTRY"
      }, 409
      
    new_sub = Newsletter(email=email)
    db.session.add(new_sub)
    db.session.commit()
    
    return {
      'msg':'Successfully subscribed to our newsletter',
      'email': email
    }, 201