import os
import jwt
import datetime
from flask_restx import Namespace, Resource
from flask_jwt_extended import jwt_required, get_jwt_identity

tinnymce_ns = Namespace('tinnymce', description='TinyMCE AI token endpoint', path='/auth')

@tinnymce_ns.route('/tinnymce')
class Tinymce(Resource):
  @jwt_required()
  def post(self):
    admin_id = get_jwt_identity()

    if not admin_id:
      return {
        "msg": "You are not authorized!"
      }, 401

    private_key = os.getenv("TINYMCE_PRIVATE_KEY")

    if not private_key:
      return {"msg": "TinyMCE private key not configured."}, 500

    payload = {
      "sub": str(admin_id),
      "name": "Admin",
      "exp": datetime.datetime.utcnow() + datetime.timedelta(minutes=30)
    }

    tinnymce_token = jwt.encode(payload, private_key, algorithm="RS256")

    return {
      "msg": "TinyMCE token generated successfully!",
      "tinnymce_token": tinnymce_token
    }, 200
