from flask_restx import Namespace, Resource, fields
from flask import request
from ..models import Message
from ..extensions import db

contact_ns = Namespace('contact', description='Contact related endpoint', path='/auth')

# document models

contact_model = contact_ns.model(
    'Message',{
        'first_name': fields.String(required=True),
        'last_name': fields.String(required=True),
        'email': fields.String(required=True),
        'subject': fields.String(required=True),
        'message': fields.String(required=True)
    }
)

@contact_ns.route('/contact')
class Contact(Resource):
    @contact_ns.expect(contact_model)
    def post(self):

        data = request.get_json()
       
from flask import current_app

protected_ns = Namespace('protected', description='Protected jwt endpoint', path='/auth')

@protected_ns.route('/protected')
class Protect(Resource):
    def post(self):
        return{

        } 
        first_name=data.get('first_name')
        last_name = data.get('last_name')
        email = data.get('email')
        subject = data.get('subject')
        message = data.get('message')

        if not first_name or not last_name or not email or not subject or not message:
            return{
                'msg': 'All fields are required.'
            }, 400

        if not '@' in email or not '.' in email:
            return{
                'msg': 'Enter a valid email.'
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
        db.session.close()

        return{
            'msg': 'Your message have been submitted successfully.'
        }, 201
