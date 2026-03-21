from flask_restx import Namespace, Resource
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity

refresh_ns = Namespace('refresh', description='Refresh token endpoint', path='/auth')

@refresh_ns.route('/refresh-token')
class RefreshTokenResource(Resource):
  @jwt_required(refresh=True)
  def post(self):
    user_identity = get_jwt_identity()
    new_token = create_access_token(identity=user_identity)

    return {
      "msg": "Token refreshed successfully",
      'access_token': new_token
    }, 200
