from flask import render_template
from flask_restx import Namespace, Resource

view = Namespace('view', description='Home directory', path='/home')

class Home(Resource):
    def get(self):
        return render_template('index.html')

view.add_resource(Home, '')

