from  werkzeug.security import generate_password_hash, check_password_hash
from dotenv import load_dotenv

import hashlib, hmac, os

from datetime import datetime

from .extensions import db

load_dotenv()

SECRET = os.environ.get('SECRET_KEY').encode()

# NEWSLETTER MODEL

class Newsletter(db.Model):
  id = db.Column(db.Integer, primary_key=True)
  email = db.Column(db.String(150), unique=True, nullable=False)
  username = db.Column(db.String(100), nullable=False, index=True)

  subscribed_at = db.Column(db.DateTime, default=datetime.utcnow)

# contact model

class Message(db.Model):
  id = db.Column(db.Integer, primary_key=True)
  first_name = db.Column(db.String(100), nullable=False, index=True)
  last_name = db.Column(db.String(100), nullable=False, index=True)
  email = db.Column(db.String(150), nullable=False, index=True)
  subject = db.Column(db.String(200), nullable=False)
  message = db.Column(db.String(2000), nullable=False)

  sent_at = db.Column(db.DateTime, default=datetime.utcnow)


# USER MODEL

class User(db.Model):
  id = db.Column(db.Integer, primary_key=True)
  full_name = db.Column(db.String(100), nullable=False, index=True)
  email = db.Column(db.String(200), nullable=False, unique=True, index=True)
  password = db.Column(db.String(250))

  created_at = db.Column(db.DateTime, default=datetime.utcnow)

  reset_token = db.Column(db.String(100), nullable=True)
  reset_token_id = db.Column(db.String(20), nullable=True)
  reset_token_used = db.Column(db.Boolean, default=False)
  reset_token_expiry_time = db.Column(db.DateTime, nullable=True)
  reset_token_sent_at = db.Column(db.DateTime, nullable=True)
  
  # Account verification
  
  otp = db.Column(db.String(200), nullable=True)
  otp_id = db.Column(db.String(20), nullable=True)
  otp_expiry = db.Column(db.DateTime, nullable=True)
  is_verified = db.Column(db.Boolean, default=False)
  otp_sent_at = db.Column(db.DateTime, nullable=True)
  
  # otp token 
  def set_otp(self, otp):
    self.otp = hashlib.sha256(otp.encode()).hexdigest()

  def check_otp(self, otp):
    return hashlib.sha256(otp.encode()).hexdigest() == self.otp

  # RESET TOKEN
  def set_reset_token(self, reset_token):
    self.reset_token = hmac.new(SECRET, reset_token.encode(), hashlib.sha256).hexdigest()

  def check_reset_token(self, reset_token):
    if not self.reset_token:
      return False
    
    expected = hmac.new(SECRET, reset_token.encode(), hashlib.sha256).hexdigest()
    
    return hmac.compare_digest(expected, self.reset_token)
    
  # PASSWORD HASHING
  def set_password(self, password):
    self.password =generate_password_hash(password)

  def check_password(self, password):
    return check_password_hash(self.password, password)

# ADMIN MODEL 

class Admin(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(150), nullable=False, unique=True, index=True)
    password = db.Column(db.String(400), nullable=False)
    joined_at = db.Column(db.DateTime, default=datetime.utcnow)

    def set_admin_password(self, password):
        self.password = generate_password_hash(password)

    def check_admin_password(self, password):
        return check_password_hash(self.password, password)
