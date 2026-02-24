from flask_restx import Namespace, Resource

health_ns = Namespace('health', description='Health check', path='/check')

@health_ns.route('/health')
class Health(Resource):
    def get(self):
        return {
                'msg': 'Anthech api is up and running',
            'version': '1.0.0'
        }, 200
