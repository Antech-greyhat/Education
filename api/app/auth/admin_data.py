from flask_jwt_extended import get_jwt_identity, jwt_required
from flask_restx import Resource, Namespace, fields
from sqlalchemy.sql.functions import user

from ..extensions import db
from ..models import Newsletter, Admin, Message, User

admin_data = Namespace('admin_data', description='Data fetch from database', path='/auth')


@admin_data.route('/data')
class AdminData(Resource):
    @jwt_required()
    def post(self):
        admin_id = get_jwt_identity()

        admin_id = Admin.query.get(admin_id)

        if not admin_id:
            return{
                'msg': 'Admin mot found'
            }, 404

        users = User.query.count()
        messages = Message.query.count()
        subscribers = Newsletter.query.count()
        admins = Message.query.count()
        

        return{
            'users': user,
            'messages': messages,
            'subscribers': subscribers,
            'admins': admins
        }, 200
