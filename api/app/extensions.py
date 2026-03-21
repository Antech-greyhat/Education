from flask_sqlalchemy import SQLAlchemy
from flask_mail import Mail
from flask_jwt_extended import JWTManager
from flask_migrate import Migrate
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from flask import jsonify
from dotenv import load_dotenv
import warnings
import os

load_dotenv()

STORAGE_URI = os.environ.get("REDIS_URL", "memory://")

if not os.environ.get("REDIS_URL"):
  warnings.warn("REDIS_URL not set - using in-memory rate limiter (not for production)", RuntimeWarning)

db = SQLAlchemy()
mail = Mail()
jwt = JWTManager()
migrate = Migrate()
limiter = Limiter(
  key_func=get_remote_address,
  storage_uri=STORAGE_URI
)

@jwt.expired_token_loader
def expired_token_callback(jwt_header, jwt_payload):
  return jsonify({
    'msg': 'Token has expired',
    'error': 'token_expired'
  }), 401

@jwt.invalid_token_loader
def invalid_token_callback(error):
  return jsonify({
    'msg': 'Invalid token',
    'error': 'invalid_token'
  }), 401

@jwt.unauthorized_loader
def missing_token_callback(error):
  return jsonify({
    'msg': 'No token provided',
    'error': 'authorization_required'
  }), 401
