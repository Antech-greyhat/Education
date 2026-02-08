from flask_restx import Namespace, Resource, fields

login_ns = Namespace('login', description='Lgin endpoint') 

@login_ns.route('/login')
class Login(Resource):
  def post(self):
    return{
      'msg':'Login Namespace tested.'
    }