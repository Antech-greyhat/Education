from flask_restx import Namespace, Resource, fields

admin_updates_ns = Namespace('admin_updates', description='Admin updates operations', path='/admin')

admin_update_model = admin_updates_ns.model('AdminUpdate')
