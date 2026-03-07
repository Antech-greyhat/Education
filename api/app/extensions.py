from flask_sqlalchemy import SQLAlchemy
from flask_mail import Mail
from flask_jwt_extended import JWTManager
from flask_migrate import Migrate
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address 
from dotenv import load_dotenv
import os

load_dotenv()


STORAGE_URI=os.environ.get("REDIS_URL")

if not STORAGE_URI:
    raise RuntimeError("REDIS_URL environment variable is not set!")

db = SQLAlchemy()
mail = Mail()
jwt = JWTManager()
migrate = Migrate()
limiter = Limiter(
  key_func=get_remote_address,
  storage_uri=STORAGE_URI
  )
