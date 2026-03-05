from flask_jwt_extended import get_jwt_identity, jwt_required
from flask_restx import Resource, Namespace, fields

from ..extensions import db, limiter
from ..models import Newsletter, Admin, Message, User

admin_data = Namespace('admin_data', description='Data fetch from database', path='/auth')


@admin_data.route('/data')
class AdminData(Resource):
    decorators = [limiter.limit('3 per minute')]
  
    @jwt_required()
    def get(self):
      
        admin_id = get_jwt_identity()

        admin_id = Admin.query.get(admin_id)

        if not admin_id:
            return{
                'msg': 'Admin not found'
            }, 404
        
        # All user data.
        users = [{
          'id': u.id,
          'full_name': u.full_name,
          'email': u.email,
          'created_at': u.created_at.isoformat()
        }
        for u in User.query.all()
        ]
        
        # All messages
        messages = [
            {
                'id': m.id,
                'first_name': m.first_name,
                'last_name': m.last_name,
                'email': m.email,
                'subject': m.subject,
                'message': m.message,
                'sent_at': m.sent_at.isoformat()
            }
            for m in Message.query.all()
        ]
        
        # Newsletter subscribers
        subscribers = [
            {
                'id': n.id,
                'email': n.email,
                'subscribed_at': n.subscribed_at.isoformat()
            }
            for n in Newsletter.query.all()
        ]
        
        # Admins 
        admins = [
            {
                'id': a.id,
                'email': a.email,
                'joined_at': a.joined_at.isoformat()
            }
            for a in Admin.query.all()
        ]

        return{
            'users': users,
            'messages': messages,
            'subscribers': subscribers,
            'admins': admins
        }, 200
