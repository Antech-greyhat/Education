from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional

class Subscriber(BaseModel):
    """Newsletter subscriber model"""
    id: Optional[str] = None
    email: EmailStr
    status: str = "active"  # active, inactive
    subscribed_date: datetime = datetime.now()
    
class ContactMessage(BaseModel):
    """Contact form message model"""
    id: Optional[str] = None
    first_name: str
    last_name: str
    email: EmailStr
    subject: str
    message: str
    status: str = "unread"  # unread, read
    created_at: datetime = datetime.now()

class Newsletter(BaseModel):
    """Newsletter model"""
    id: Optional[str] = None
    topic: str
    body: str
    recipients: str  # all, active, custom
    sent_date: datetime = datetime.now()
    sent_count: int = 0
