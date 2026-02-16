from flask_restx import Namespace, Resource
from flask_jwt_extended import current_user, jwt_required, get_jwt_identity
from flask import jsonify, request
import traceback

protected_ns = Namespace('protected', description='Jwt protected endpoint', path='/auth')

@protected_ns.route('/protected')
class Protected(Resource):
    @jwt_required()
    def get(self):
        print(f'Header: {request.headers}')
        try:
            current_user_id = get_jwt_identity()
            return{
                'msg': 'You are authorized',
                'admin_id': current_user_id
            },200

        
        except Exception as e:
            traceback.print_exc() # the error
            return{
                'msg': str(e)
            }, 422
