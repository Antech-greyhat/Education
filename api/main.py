from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Optional
from datetime import datetime
import uuid

from app.models import Subscriber, ContactMessage, Newsletter

app = FastAPI(title="AntechLearn Admin API", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify allowed origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory storage (replace with database in production)
subscribers_db = []
messages_db = []
newsletters_db = []

# Root endpoint
@app.get("/")
async def root():
    return {
        "message": "AntechLearn Admin API",
        "version": "1.0.0",
        "endpoints": [
            "/api/subscribers",
            "/api/messages",
            "/api/newsletter",
            "/api/admin/stats"
        ]
    }

# ============ Subscriber Endpoints ============

@app.get("/api/subscribers", response_model=List[Subscriber])
async def get_subscribers():
    """Get all newsletter subscribers"""
    return subscribers_db

@app.post("/api/subscribers", response_model=Subscriber)
async def create_subscriber(subscriber: Subscriber):
    """Add a new subscriber"""
    # Check if email already exists
    if any(sub.email == subscriber.email for sub in subscribers_db):
        raise HTTPException(status_code=400, detail="Email already subscribed")
    
    subscriber.id = str(uuid.uuid4())
    subscriber.subscribed_date = datetime.now()
    subscribers_db.append(subscriber)
    return subscriber

@app.delete("/api/subscribers/{subscriber_id}")
async def delete_subscriber(subscriber_id: str):
    """Delete a subscriber"""
    global subscribers_db
    initial_length = len(subscribers_db)
    subscribers_db = [sub for sub in subscribers_db if sub.id != subscriber_id]
    
    if len(subscribers_db) == initial_length:
        raise HTTPException(status_code=404, detail="Subscriber not found")
    
    return {"message": "Subscriber deleted successfully"}

@app.patch("/api/subscribers/{subscriber_id}")
async def update_subscriber(subscriber_id: str, status: str):
    """Update subscriber status"""
    for subscriber in subscribers_db:
        if subscriber.id == subscriber_id:
            subscriber.status = status
            return subscriber
    
    raise HTTPException(status_code=404, detail="Subscriber not found")

# ============ Contact Message Endpoints ============

@app.get("/api/messages", response_model=List[ContactMessage])
async def get_messages(status: Optional[str] = None):
    """Get all contact messages, optionally filtered by status"""
    if status:
        return [msg for msg in messages_db if msg.status == status]
    return messages_db

@app.post("/api/messages", response_model=ContactMessage)
async def create_message(message: ContactMessage):
    """Create a new contact message"""
    message.id = str(uuid.uuid4())
    message.created_at = datetime.now()
    messages_db.append(message)
    return message

@app.patch("/api/messages/{message_id}")
async def update_message(message_id: str, status: str):
    """Update message status (mark as read/unread)"""
    for message in messages_db:
        if message.id == message_id:
            message.status = status
            return message
    
    raise HTTPException(status_code=404, detail="Message not found")

@app.delete("/api/messages/{message_id}")
async def delete_message(message_id: str):
    """Delete a message"""
    global messages_db
    initial_length = len(messages_db)
    messages_db = [msg for msg in messages_db if msg.id != message_id]
    
    if len(messages_db) == initial_length:
        raise HTTPException(status_code=404, detail="Message not found")
    
    return {"message": "Message deleted successfully"}

# ============ Newsletter Endpoints ============

@app.post("/api/newsletter", response_model=Newsletter)
async def send_newsletter(newsletter: Newsletter):
    """Send newsletter to subscribers"""
    newsletter.id = str(uuid.uuid4())
    newsletter.sent_date = datetime.now()
    
    # Count recipients based on filter
    if newsletter.recipients == "all":
        newsletter.sent_count = len(subscribers_db)
    elif newsletter.recipients == "active":
        newsletter.sent_count = len([s for s in subscribers_db if s.status == "active"])
    
    newsletters_db.append(newsletter)
    
    # Here you would implement actual email sending logic
    # For now, we'll just store the newsletter
    
    return newsletter

@app.get("/api/newsletters", response_model=List[Newsletter])
async def get_newsletters():
    """Get all sent newsletters"""
    return newsletters_db

# ============ Admin Stats Endpoint ============

@app.get("/api/admin/stats")
async def get_admin_stats():
    """Get dashboard statistics"""
    total_subscribers = len(subscribers_db)
    active_subscribers = len([s for s in subscribers_db if s.status == "active"])
    total_messages = len(messages_db)
    unread_messages = len([m for m in messages_db if m.status == "unread"])
    total_sent = len(newsletters_db)
    
    return {
        "totalSubscribers": total_subscribers,
        "activeSubscribers": active_subscribers,
        "totalMessages": total_messages,
        "unreadMessages": unread_messages,
        "totalSent": total_sent
    }

# ============ Health Check ============

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "timestamp": datetime.now().isoformat()}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
