from threading import Thread
from flask_mail import Message
from flask import current_app, render_template
from .extensions import mail

def send_async_email(app, msg):
    """Send email inside application context"""
    with app.app_context():
        mail.send(msg)
        app.logger.info(f"Email sent to {msg.recipients}")

def send_newsletter(email):
    """Prepare and send newsletter asynchronously"""
    app = current_app._get_current_object()
    msg = Message(
        subject="🎉 Welcome to AntechLearn Newsletter!",
        sender=app.config.get("MAIL_DEFAULT_SENDER", "newsletter@antechlearn.com"),
        recipients=[email]
    )

    msg.html = render_template("mail.html", email=email)
    msg.body = f"Welcome {email}! If you can't view HTML emails, please check our platform."

    # Start thread
    Thread(target=send_async_email, args=(app, msg)).start()