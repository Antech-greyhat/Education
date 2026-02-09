from flask_restx import Namespace, Resource, fields
from flask import request
from threading import Thread

from ..models import Newsletter, db

from ..send_email import send_newsletter

news_ns = Namespace('news', description='Newsletter namespace', path='/news')

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
        "message": "This email is already subscribed two our newsletter",
        "error": "DUPLICATE_ENTRY"
      }, 409
    
    username = email.split('@')[0].split('.')[0].capitalize()
    name = email.split('@')[0].split('.')[0].capitalize()
    
    new_sub = Newsletter(
      email=email,
      username=username
      )
    db.session.add(new_sub)
    db.session.commit()
    
    send_newsletter(username, email)
    # Thread(target=send_newsletter, args=(email,)).start()
    
    return {
      'msg':'Successfully subscribed to our newsletter',
      'email': email
    }, 201