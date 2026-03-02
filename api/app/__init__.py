from operator import imod
from flask import Flask, render_template
from flask_restx import Api
from sqlalchemy_utils import database_exists, create_database
from flask_cors import CORS
from dotenv import load_dotenv
from datetime import timedelta
import os

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
from .auth.reset_password import reset_ns
from .health import health_ns
from .views import view

load_dotenv()

def create_app():
    app = Flask(__name__)
    
    api = Api(
      app,
      title='Antech Api',
      version='1.0',
      description='Antech Api for managing authentication and authorization',
      doc='/docs'
      )

    frontend_url = os.getenv('FRONTEND_URL')

    if not frontend_url:
        raise RuntimeError ('FRONTEND_URL is missing in your environment variables!')
    
    # CORS
    CORS(
        app,
        origins=[frontend_url, 'http://127.0.0.1:35729'],
        supports_credentials=True
    )

    # Flask config
    app.config['SECRET_KEY'] = os.getenv('SECRET_KEY')
    app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URI')
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
    from .models import Newsletter, Message, User, PasswordResetAttempt, Admin

    # Add namespaces
    namespaces = [register_ns, admin_ns, login_ns, news_ns, contact_ns, protected_ns, admin_data, forgot_ns, reset_ns, health_ns, view]
    
    # namespace registration
    
    for ns in namespaces:
        api.add_namespace(ns)
        
    @app.route('/')
    def home():
      return render_template('index.html')
    
    init_db(app)

    return app

def init_db(app):
    """Create database + tables if they don't exist"""
    with app.app_context():
        if not database_exists(db.engine.url):
            create_database(db.engine.url)
            
        db.create_all()
        seed_admins()
        