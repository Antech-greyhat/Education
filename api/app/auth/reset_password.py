from flask_restx import Namespace, Resource, fields
from flask import request
from ..extensions import db
from ..models import User
import re


reset_ns = Namespace('reset_pasword', description='Reset password endpoint', path='/auth')

reset_model = reset_ns.model('ResetPsaaword', {
    'reset_token_id': fields.String(required=True),
    'reset_token': fields.String(required=True),
    'password': fields.String(required=True)
})

class ResetPassword(Resource):
    @reset_ns.expect(reset_model)
    def post(self):
        data = request.get_json()

        reset_token_id = data.get('reset_token_id')
        reset_token = data.get('reset_token')
        password = data.get('password')

        if not password:
            return{
                'msg': 'Password is required.'
            }, 400

        if len(password) < 8:
            return{
                'msg': 'Password must be greater than 8 characters.'
            }
        
        if not re.search(r"[0-9]", password) and not re.search(r"[!@#$%^&*(),.?\":{}|<>]",
       password):
            return{
                'msg': 'Password should include at least one number or special character!'
            }

        if not reset_token_id or not reset_token:
            return{
                'msg': 'Missing reset password credentials'
            }, 400
        
        user = User.query.filter_by(reset_token_id=reset_token_id).first()

        if not user or not user.check_reset_token(reset_token):
            return{
                'msg': 'Invalid reset password credentials.'
            }, 401

        if not user.check_reset_token(reset_token):
            return{
                'msg': 'Invalid reset password credentials'
            }, 401

        if user.reset_token_used:
            return{
                'msg': 'Invalid token.'
            }, 401

        # check for expirery token time before reseting password
        
        user.reset_token_used = True
        user.reset_token=None
        user.reset_token_id=None
        user.reset_token_expiry=None
        user.set_password(password)
        return{
            'msg': 'Password have been reset successfully.'
        }, 201
