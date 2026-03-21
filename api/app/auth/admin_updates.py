from flask_restx import Namespace, Resource, fields
from flask_jwt_extended import jwt_required, get_jwt_identity

from ..extensions import db, limiter
from ..models import AdminUpdate, Admin, Newsletter

admin_updates_ns = Namespace('admin_updates', description='Admin updates operations', path='/admin')

# Models for request/response documentation
admin_update_model = admin_updates_ns.model('AdminUpdate', {
    'subject': fields.String(required=True, description='The subject of the update'),
    'body': fields.String(required=True, description='The body of the update')
})

admin_update_response_model = admin_updates_ns.model('AdminUpdateResponse', {
    'id': fields.Integer(description='Update ID'),
    'subject': fields.String(description='Update subject'),
    'body': fields.String(description='Update body'),
    'sent_at': fields.DateTime(description='When the update was created'),
    'is_sent': fields.Boolean(description='Whether the update has been sent'),
    'admin_id': fields.Integer(description='ID of the admin who created the update')
})

# Parser for query parameters
update_parser = admin_updates_ns.parser()
update_parser.add_argument('page', type=int, default=1, help='Page number')
update_parser.add_argument('per_page', type=int, default=20, help='Items per page')


@admin_updates_ns.route('/updates')
class AdminUpdatesList(Resource):
    decorators = [limiter.limit('10 per day')]
    
    @admin_updates_ns.doc(security='jwt')
    @jwt_required()
    @admin_updates_ns.expect(admin_update_model)
    @admin_updates_ns.response(201, 'Update created successfully')
    @admin_updates_ns.response(400, 'Validation error')
    @admin_updates_ns.response(401, 'Unauthorized')
    @admin_updates_ns.response(403, 'Forbidden - Admin access required')
    def post(self):
        """Create a new admin update"""
        admin_id = get_jwt_identity()
        
        # Verify that the user is an admin
        admin = Admin.query.get(admin_id)
        if not admin:
            return {'message': 'Admin access required'}, 403

        data = admin_updates_ns.payload
        
        subject = data.get('subject')
        body = data.get('body')

        if not subject or not body:
            return {'message': 'Subject and body are required'}, 400
        
        # Create new admin update
        new_update = AdminUpdate(
            subject=subject,
            body=body,
            admin_id=admin_id
        )
        
        db.session.add(new_update)
        db.session.commit()
        
        return {
            'message': 'Admin update created successfully',
            'update': {
                'id': new_update.id,
                'subject': new_update.subject,
                'body': new_update.body,
                'sent_at': new_update.sent_at.isoformat() if new_update.sent_at else None,
                'is_sent': new_update.is_sent
            }
        }, 201
    
    @admin_updates_ns.doc(security='jwt')
    @jwt_required()
    @admin_updates_ns.expect(update_parser)
    @admin_updates_ns.marshal_list_with(admin_update_response_model)
    @admin_updates_ns.response(200, 'Success')
    @admin_updates_ns.response(401, 'Unauthorized')
    @admin_updates_ns.response(403, 'Forbidden - Admin access required')
    def get(self):
        """Get all admin updates (paginated)"""
        admin_id = get_jwt_identity()
        
        # Verify admin access
        admin = Admin.query.get(admin_id)
        if not admin:
            return {'message': 'Admin access required'}, 403
        
        # Get pagination parameters
        args = update_parser.parse_args()
        page = args['page']
        per_page = args['per_page']
        
        # Query updates
        updates = AdminUpdate.query\
            .filter_by(admin_id=admin_id)\
            .order_by(AdminUpdate.sent_at.desc())\
            .paginate(page=page, per_page=per_page, error_out=False)
        
        return updates.items


@admin_updates_ns.route('/updates/<int:update_id>')
@admin_updates_ns.param('update_id', 'The update identifier')
class AdminUpdateResource(Resource):
    decorators = [limiter.limit('10 per day')]
    
    @admin_updates_ns.doc(security='jwt')
    @jwt_required()
    @admin_updates_ns.marshal_with(admin_update_response_model)
    @admin_updates_ns.response(200, 'Success')
    @admin_updates_ns.response(401, 'Unauthorized')
    @admin_updates_ns.response(403, 'Forbidden - Admin access required')
    @admin_updates_ns.response(404, 'Update not found')
    def get(self, update_id):
        """Get a specific admin update by ID"""
        admin_id = get_jwt_identity()
        
        # Verify admin access
        admin = Admin.query.get(admin_id)
        if not admin:
            return {'message': 'Admin access required'}, 403
        
        # Get the update
        update = AdminUpdate.query.filter_by(id=update_id, admin_id=admin_id).first()
        if not update:
            return {'message': 'Update not found'}, 404
        
        return update
    
    @admin_updates_ns.doc(security='jwt')
    @jwt_required()
    @admin_updates_ns.expect(admin_update_model)
    @admin_updates_ns.response(200, 'Update updated successfully')
    @admin_updates_ns.response(400, 'Validation error')
    @admin_updates_ns.response(401, 'Unauthorized')
    @admin_updates_ns.response(403, 'Forbidden - Admin access required')
    @admin_updates_ns.response(404, 'Update not found')
    def put(self, update_id):
        """Update an existing admin update"""
        admin_id = get_jwt_identity()
        
        # Verify admin access
        admin = Admin.query.get(admin_id)
        if not admin:
            return {'message': 'Admin access required'}, 403
        
        # Get the update
        update = AdminUpdate.query.filter_by(id=update_id, admin_id=admin_id).first()
        if not update:
            return {'message': 'Update not found'}, 404
        
        # Don't allow updates to already sent updates
        if update.is_sent:
            return {'message': 'Cannot update an update that has already been sent'}, 400
        
        data = admin_updates_ns.payload
        
        if 'subject' in data and data['subject']:
            update.subject = data['subject']
        
        if 'body' in data and data['body']:
            update.body = data['body']
        
        db.session.commit()
        
        return {'message': 'Update updated successfully'}, 200
    
    @admin_updates_ns.doc(security='jwt')
    @jwt_required()
    @admin_updates_ns.response(200, 'Update deleted successfully')
    @admin_updates_ns.response(401, 'Unauthorized')
    @admin_updates_ns.response(403, 'Forbidden - Admin access required')
    @admin_updates_ns.response(404, 'Update not found')
    def delete(self, update_id):
        """Delete an admin update"""
        admin_id = get_jwt_identity()
        
        # Verify admin access
        admin = Admin.query.get(admin_id)
        if not admin:
            return {'message': 'Admin access required'}, 403
        
        # Get the update
        update = AdminUpdate.query.filter_by(id=update_id, admin_id=admin_id).first()
        if not update:
            return {'message': 'Update not found'}, 404
        
        # Don't allow deletion of already sent updates
        if update.is_sent:
            return {'message': 'Cannot delete an update that has already been sent'}, 400
        
        db.session.delete(update)
        db.session.commit()
        
        return {'message': 'Update deleted successfully'}, 200


@admin_updates_ns.route('/updates/<int:update_id>/send')
@admin_updates_ns.param('update_id', 'The update identifier')
class AdminUpdateSend(Resource):
    decorators = [limiter.limit('5 per day')]
    
    @admin_updates_ns.doc(security='jwt')
    @jwt_required()
    @admin_updates_ns.response(200, 'Update sent successfully')
    @admin_updates_ns.response(400, 'Update already sent')
    @admin_updates_ns.response(401, 'Unauthorized')
    @admin_updates_ns.response(403, 'Forbidden - Admin access required')
    @admin_updates_ns.response(404, 'Update not found')
    def post(self, update_id):
        """Send an admin update to all newsletter subscribers"""
        admin_id = get_jwt_identity()
        
        # Verify admin access
        admin = Admin.query.get(admin_id)
        if not admin:
            return {'message': 'Admin access required'}, 403
        
        # Get the update
        update = AdminUpdate.query.filter_by(id=update_id, admin_id=admin_id).first()
        if not update:
            return {'message': 'Update not found'}, 404
        
        # Check if already sent
        if update.is_sent:
            return {'message': 'This update has already been sent'}, 400
        
        # Get all newsletter subscribers
        subscribers = Newsletter.query.all()
        
        if not subscribers:
            return {'message': 'No newsletter subscribers found'}, 400
        
        # Here you would implement the actual email sending logic
        # For example, using Flask-Mail or a third-party service
        
        # Mark the update as sent
        update.is_sent = True
        db.session.commit()
        
        # Return information about the send operation
        return {
            'message': 'Update sent successfully',
            'recipient_count': len(subscribers),
            'update_id': update.id,
            'subject': update.subject
        }, 200