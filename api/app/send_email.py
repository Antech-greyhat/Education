import time
from threading import Thread
from flask_mail import Message
from flask import current_app, render_template
from .extensions import mail

# WELCOME MESSAGE.
def send_async_email(app, msg, retries=3, wait=15):
  with app.app_context():
    attempt = 1
    while attempt < retries:
      try:
        mail.send(msg)
        app.logger.info(f"Email sent to {msg.recipients} on attempt {attempt + 1}")
        return  # success
      except Exception as e:
        attempt += 1
        app.logger.warning(f"Attempt {attempt} failed: {e}")
        if attempt < retries:
          sleep_time = wait * attempt
          app.logger.info(f"Retrying in {sleep_time} seconds...")
          time.sleep(sleep_time)
        else:
          app.logger.error(f"Failed to send email to {msg.recipients} after {retries} attempts.")

# PASSWORD RESET 
def send_newsletter(username, email):
  """Prepare and send newsletter asynchronously"""
  app = current_app._get_current_object()
  msg = Message(
    subject="Welcome to AntechLearn Newsletter!",
    sender=app.config.get("MAIL_DEFAULT_SENDER", 'antechittech@gmail.com'),
    recipients=[email]
  )

  msg.html = render_template("mail.html", username=username)
  msg.body = f"Welcome {username}! If you can't view HTML emails, please check our platform."

  Thread(target=send_async_email, args=(app, msg)).start()
  
  
def send_password_reset_link(reset_link, email):
  app = current_app._get_current_object()
  msg = Message(
    subject="Password reset link",
    sender=app.config.get("MAIL_DEFAULT_SENDER", 'antechittech@gmail.com'),
    recipients=[email]
  )
  
  msg.html = render_template("reset_password_link.html", reset_link=reset_link)
  msg.body = f"""
  Hello, this is a password reset link requested for your account. To continue please copy the link bellow and open it in the browser.
  
  { reset_link }
  
  From AntechLearn. All rights reserved. 
  
  """

  Thread(target=send_async_email, args=(app
  , msg)).start()
  
  
def send_otp(otp, email, name):
  app = current_app._get_current_object()
  msg = Message(
    subject="Account Verification",
    sender=app.config.get("MAIL_DEFAULT_SENDER", 'antechittech@gmail.com'),
    recipients=[email]
  )
  
  msg.html = render_template("otp_email.html", otp=otp, name=name)
  msg.body = f"""
  Hello { name } , this is a verification requested for your account. To continue please copy the otp and paste it in the desired fields.
  
  { otp }
  
  From AntechLearn. All rights reserved. 
  
  """

  Thread(target=send_async_email, args=(app
  , msg)).start()


def news_update(username, email, subject, body):
  pass
