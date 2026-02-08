from flask_restx import Resource, Namespace

register_ns = Namespace('register_ns', description='Auth related routes') 

@register_ns.route('/register')
class Register(Resource):
  def get(self):
    return {
      'msg':'Namespace firt attempt.'
    }