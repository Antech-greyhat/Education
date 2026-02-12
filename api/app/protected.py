from flask_restx import Namespace, Resource
from flask_jwt_extended import current_user, jwt_required, get_jwt_identity

protected_ns = Namespace('protected', description='Jwt protected endpoint', path='/auth')

@protected_ns.route('/protected')
class Protected(Resource):
    @jwt_required()
    def get(self):
        current_user_id = get_jwt_identity()
        return{
            'msg':'You are authorized!',
            'user_id': current_user_id
        }
