from flask_restx import Namespace, Resource, fields
from datetime import datetime

from ..extensions import db
from ..models import User

import re

reset_ns = Namespace('reset_password', description='Reset password endpoint', path='/auth')

reset_model = reset_ns.model('ResetPsaaword', {
    'reset_token_id': fields.String(required=True),
    'reset_token': fields.String(required=True),
    'password': fields.String(required=True)
})

@reset_ns.route('/reset_password')
class ResetPassword(Resource):
    @reset_ns.expect(reset_model, validate=True)
    def post(self):

        data = reset_ns.payload

        reset_token_id = data.get('reset_token_id')
        reset_token = data.get('reset_token')
        password = data.get('password')

        if not password:
            return {'msg': 'Password is required.'}, 400

        if len(password) < 8:
            return {'msg': 'Password must be at least 8 characters.'}, 400

        if not re.search(r"[0-9]", password) and not re.search(r"[!@#$%^&*(),.?\":{}|<>]", password):
            return {
                'msg': 'Password should include at least one number or special character!'
            }, 400

        if not reset_token_id or not reset_token:
            return {'msg': 'Missing reset password credentials'}, 400

        user = User.query.filter_by(reset_token_id=reset_token_id).first()

        if not user or not user.check_reset_token(reset_token):
            return {'msg': 'Invalid reset password credentials.'}, 401

        if user.reset_token_used:
            return {'msg': 'Invalid token.'}, 401

        # Check expiry
        if user.reset_token_expiry_time and user.reset_token_expiry_time < datetime.utcnow():
            return {'msg': 'Reset token has expired, please request for a new one.'}, 401

        # Reset password
        user.set_password(password)
        user.reset_token_used = True
        user.reset_token = None
        user.reset_token_id = None
        user.reset_token_expiry_time = None

        db.session.commit()

        return {'msg': 'Password has been reset successfully.'}, 200