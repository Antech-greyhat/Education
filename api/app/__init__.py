from flask import Flask, render_template
from flask_restx import Api
from sqlalchemy_utils import database_exists, create_database
from flask_cors import CORS
from dotenv import load_dotenv
from datetime import timedelta
import os

load_dotenv()

from .extensions import db, mail, jwt, migrate, limiter

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
from .auth.account_verify import verify_ns
from .auth.otp_resend import otp_renew_ns
from .auth.token_renew import refresh_ns
from .auth.admin_updates import admin_updates_ns
from .auth.tinnymce import tinnymce_ns

def create_app():
    app = Flask(__name__)
    
    # CORS, vite, acode & production
    CORS(
      app,
      origins=[frontend_url, 'http://localhost:8158', 'http://localhost:5173'],
      supports_credentials=True
    )
    
    @app.route('/')
    def home():
      return render_template('index.html')
    
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

    # Flask config
    app.config['SECRET_KEY'] = os.getenv('SECRET_KEY')
    app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URI')
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    
    app.config['SQLALCHEMY_ENGINE_OPTIONS'] = {
      'pool_pre_ping': True,
      'pool_recycle': 280,
      'pool_timeout': 20,
      'pool_size': 5,
      'max_overflow': 2
    }
    
    # jwt config
    app.config['PROPAGATE_EXCEPTIONS'] = True
    app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY')
    app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(minutes=30)
    app.config['JWT_REFRESH_TOKEN_EXPIRES'] = timedelta(days=2)
    
    # GROQ config
    app.config['GROQ_API_KEY'] = os.getenv('GROQ_API_KEY')
    
    # gmail server config
    app.config['MAIL_SERVER'] = os.getenv('MAIL_SERVER')
    app.config['MAIL_PORT'] = 587
    app.config['MAIL_USERNAME'] = os.getenv('MAIL_USERNAME')
    app.config['MAIL_DEFAULT_SENDER'] = os.getenv('MAIL_DEFAULT_SENDER')
    app.config['MAIL_PASSWORD'] = os.getenv('MAIL_PASSWORD')
    app.config['MAIL_USE_TLS'] = True
    app.config['MAIL_USE_SSL'] = False

    # Initialize extensions
    db.init_app(app)
    mail.init_app(app)
    jwt.init_app(app)
    migrate.init_app(app, db)
    limiter.init_app(app)
    
    from .models import Newsletter, Message, User, Admin

    # Add namespaces
    namespaces = [register_ns, admin_ns, login_ns, news_ns, contact_ns, protected_ns, admin_data, forgot_ns, reset_ns, health_ns, verify_ns, otp_renew_ns, refresh_ns, admin_updates_ns, tinnymce_ns]
    
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
        
