from flask import Flask, jsonify
from flask_restx import Api
from sqlalchemy_utils import database_exists, create_database
from flask_cors import CORS
from dotenv import load_dotenv
import os

# for debugging
from flask_jwt_extended.exceptions import JWTExtendedException

from .extensions import db, mail, jwt, migrate

# import Namespace objects
from .auth.register import register_ns  
from .auth.admin import admin_ns
from .auth.login import login_ns
from .auth.newsletter import news_ns
from .auth.contact import contact_ns
from .auth.seed import seed_admins
from .protected import protected_ns
from .auth.admin_data import admin_data
from .auth.forgot_password import forgot_ns


from datetime import timedelta


load_dotenv()

def create_app():
    app = Flask(__name__)

    # CORS
    CORS(app)

    # Flask config
    app.config['SECRET_KEY'] = os.getenv('SECRET_KEY')
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///./database.db'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    
    # jwt config
    app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY')
    app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(minutes=30)
    app.config['JWT_REFRESH_TOKEN_EXPIRES'] = timedelta(days=2)
    
    # gmail server config
    app.config['MAIL_SERVER'] = os.getenv('MAIL_SERVER')
    app.config['MAIL_PORT'] = 587
    app.config['MAIL_USERNAME'] = os.getenv('MAIL_USERNAME')
    app.config['MAIL_PASSWORD'] = os.getenv('MAIL_PASSWORD')
    app.config['MAIL_USE_TLS'] = True
    app.config['MAIL_USE_SSL'] = False

    # Initialize extensions
    db.init_app(app)
    mail.init_app(app)
    jwt.init_app(app)
    migrate.init_app(app, db)

    # Create Flask-RESTX API
    api = Api(app, title="AntechLearn API", version="1.0")

    # Add namespaces
    namespaces = [register_ns, admin_ns, login_ns, news_ns, contact_ns, protected_ns, admin_data, forgot_ns]
    
    # namespace registration
    
    for ns in namespaces:
        api.add_namespace(ns)

    init_db(app)

    return app

def init_db(app):
    """Create database + tables if they don't exist"""
    with app.app_context():
        if not database_exists(db.engine.url):
            create_database(db.engine.url)
            
        db.create_all()
        seed_admins()
        
