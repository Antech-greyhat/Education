from flask_jwt_extended import jwt_required, get_jwt_identity
from flask_restx import Namespace, Resource, fields
from flask import request

from ..models import Admin, Newsletter, AdminUpdate
from ..extensions import db, limiter
from ..send_email import send_newsletter_update


admin_updates_ns = Namespace(
  'admin_updates',
  description='Admin updates related operations',
  path='/auth'
)

admin_update_model = admin_updates_ns.model('AdminUpdate', {
  'message': fields.String(required=True, description='Update message.')
})


@admin_updates_ns.route('/admin_updates')
class AdminUpdatesResource(Resource):
  @jwt_required()
  @admin_updates_ns.expect(admin_update_model, validate=True)
  def post(self):
    admin_id = get_jwt_identity()
    admin = Admin.query.get(admin_id)

    if not admin:
      return {'msg': 'Admin not found'}, 404

    data = request.json
    message = data.get('message')

    # Create the AdminUpdate record
    new_update = AdminUpdate(
      message=message,
      author=admin,
      is_sent=True
    )

    # Associate with all newsletter subscribers
    subscribers = Newsletter.query.all()
    if not subscribers:
      return {
        'msg': 'There are no subscribers yet'
      }, 401
      
    for subscriber in subscribers:
      new_update.recipients.append(subscriber)
      
      # Send the newsletter update
      send_newsletter_update(subscriber.email, message)

    db.session.add(new_update)
    db.session.commit()

    return {
      'msg': 'Admin update stored and sent to all subscribers'
    }, 200