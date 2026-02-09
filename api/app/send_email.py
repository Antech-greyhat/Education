import time
from threading import Thread
from flask_mail import Message
from flask import current_app, render_template
from .extensions import mail

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

def send_newsletter(username, email):
  """Prepare and send newsletter asynchronously"""
  app = current_app._get_current_object()
  msg = Message(
    subject="🎉 Welcome to AntechLearn Newsletter!",
    sender=app.config.get("MAIL_DEFAULT_SENDER", "newsletter@antechlearn.com"),
    recipients=[email]
  )

  msg.html = render_template("mail.html", username=username)
  msg.body = f"Welcome {username}! If you can't view HTML emails, please check our platform."

  Thread(target=send_async_email, args=(app, msg)).start()