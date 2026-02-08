from flask import Flask
from flask_restx import Api
from sqlalchemy_utils import database_exists, create_database
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from flask_mail import Mail
from dotenv import load_dotenv
import os

from .models import User, Newsletter, Message, db

# import Namespace objects
from .auth.register import register_ns  
from .auth.admin import admin_ns
from .auth.login import login_ns
from .auth.newsletter import news_ns

mail = Mail()

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
    app.config['JWT_ACCESS_TOKEN_EXPIRES'] = 18000  # 30 MIN
    app.config['JWT_REFRESH_TOKEN_EXPIRES'] = 86400  # 1d

    # Mail server config
    app.config['MAIL_SERVER'] = os.getenv('MAIL_SERVER')
    app.config['MAIL_PORT'] = os.getenv('MAIL_PORT')
    app.config['MAIL_USERNAME'] = os.getenv('MAIL_USERNAME')
    app.config['MAIL_PASSWORD'] = os.getenv('MAIL_PASSWORD')
    app.config['MAIL_USE_TLS'] = os.getenv('MAIL_USE_TLS')
    app.config['MAIL_USE_SSL'] = os.getenv('MAIL_USE_SSL')

    # Initialize extensions
    db.init_app(app)
    mail.init_app(app)
    JWTManager(app)

    # Create Flask-RESTX API
    api = Api(app, title="AntechLearn API", version="1.0")

    # Add namespaces
    namespaces = [register_ns, admin_ns, login_ns, news_ns]
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