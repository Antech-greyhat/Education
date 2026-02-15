import os
from ..models import Admin
from ..extensions import db

def seed_admins():
    usernames = os.getenv("ADMIN_USERNAME", "")
    passwords = os.getenv("ADMIN_PASSWORD", "")

    if not usernames or not passwords:
        print("No admin credentials found in .env")
        return

    username_list = [u.strip() for u in usernames.split(",")]
    password_list = [p.strip() for p in passwords.split(",")]

    if len(username_list) != len(password_list):
        raise ValueError("ADMIN_USERNAME and ADMIN_PASSWORD counts do not match")

    for email, password in zip(username_list, password_list):
        existing = Admin.query.filter_by(email=email).first()

        if existing:
            print(f"Admin already exists, joined at : {existing.joined_at}")
            continue

        admin = Admin(
            email=email,
        )
        admin.set_admin_password(password);
        
        db.session.add(admin)

    db.session.commit()