from flask_restx import Namespace, Resource, fields
from flask import request
from ..models import User
from ..extensions import db
import secrets
import os

forgot_ns = Namespace('forgot', description='Endpoint for getting password reset credentials', path='/auth')

forgot_models = forgot_ns.model('Forgot_password',{
    'email': fields.String(required=True)
})

@forgot_ns.route('/Forgot_password')
class ForgotPassword(Resource):
    @forgot_ns.expect(forgot_models)
    def post(self):
        data = request.get_json()

        email = data.get('email')

        if not email:
            return{
                'msg': 'Email is required.'
            }, 400

        user = User.query.filter_by(email=email).first()

        if not user:
            return{
                'msg': 'Invalid email address!'
            }, 400
        frontend_url = os.getenv('FRONTEND_URL')

        reset_url= f'{frontend_url}/reset_password.html'.rstrip('/')

        return{
            'msg': 'Password reset email link have been sent to your email.'
        }
