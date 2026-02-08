from flask_restx import Namespace, Resource, fields

admin_ns = Namespace('admin', description='Admin login endpoint') 

@admin_ns.route('/admin')
class Adminauth(Resource):
  def post(self):
    return {
      'msg':'Admin route tested and approved'
    }