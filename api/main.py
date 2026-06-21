import datetime
from typing import Optional, List
from fastapi import FastAPI, Depends, HTTPException, status, Header
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
import jwt

from .database import engine, get_db, Base
from .models import User, Event, Registration, Message
from .schemas import (
    UserCreate, UserLogin, UserResponse, ProfileResponse, Token,
    EventCreate, EventUpdate, EventResponse, MessageCreate, MessageResponse, AdminStats
)
from .auth import (
    get_password_hash, verify_password, create_access_token,
    get_current_user, get_current_admin, SECRET_KEY, ALGORITHM
)

# Initialize database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Eco Clean API", version="1.0.0")

# CORS middleware configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Allow all origins for local development ease
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Helper to optionally get user_id from Authorization header
def get_optional_user_id(authorization: Optional[str] = Header(None)) -> Optional[str]:
    if not authorization or not authorization.startswith("Bearer "):
        return None
    try:
        token = authorization.split(" ")[1]
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload.get("sub")
    except Exception:
        return None

# --- AUTH ENDPOINTS ---

@app.post("/api/auth/register", response_model=Token, status_code=status.HTTP_201_CREATED)
def register(user_data: UserCreate, db: Session = Depends(get_db)):
    # Check if email is already registered
    existing_user = db.query(User).filter(User.email == user_data.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email is already registered"
        )
    
    # Hash password and create user
    hashed_password = get_password_hash(user_data.password)
    new_user = User(
        email=user_data.email,
        password_hash=hashed_password,
        full_name=user_data.full_name,
        phone=user_data.phone,
        role=user_data.role
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    # Issue JWT token
    access_token = create_access_token(data={"sub": new_user.id})

    # Prepare response formats matching supabase client structure
    user_res = UserResponse.from_orm(new_user)
    profile_res = ProfileResponse.from_orm(new_user)

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": user_res,
        "profile": profile_res
    }

@app.post("/api/auth/login", response_model=Token)
def login(credentials: UserLogin, db: Session = Depends(get_db)):
    # Fetch user
    user = db.query(User).filter(User.email == credentials.email).first()
    if not user or not verify_password(credentials.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Issue JWT token
    access_token = create_access_token(data={"sub": user.id})

    # Prepare response formats matching supabase client structure
    user_res = UserResponse.from_orm(user)
    profile_res = ProfileResponse.from_orm(user)

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": user_res,
        "profile": profile_res
    }

@app.get("/api/auth/me")
def get_me(current_user: User = Depends(get_current_user)):
    user_res = UserResponse.from_orm(current_user)
    profile_res = ProfileResponse.from_orm(current_user)
    return {
        "user": user_res,
        "profile": profile_res
    }

# --- EVENTS ENDPOINTS ---

@app.get("/api/events")
def get_events(
    user_id: Optional[str] = Depends(get_optional_user_id),
    db: Session = Depends(get_db)
):
    # Fetch all events sorted by date
    events = db.query(Event).order_by(Event.event_date.asc()).all()

    # If user is logged in, check their registrations
    registered_event_ids = set()
    if user_id:
        regs = db.query(Registration.event_id).filter(Registration.user_id == user_id).all()
        registered_event_ids = {r[0] for r in regs}

    result = []
    for e in events:
        event_dict = {
            "id": e.id,
            "title": e.title,
            "description": e.description,
            "location": e.location,
            "event_date": e.event_date,
            "start_time": e.start_time,
            "end_time": e.end_time,
            "image_url": e.image_url,
            "status": e.status,
            "created_at": e.created_at,
            "is_registered": e.id in registered_event_ids
        }
        result.append(event_dict)
    
    return result

@app.get("/api/events/{event_id}")
def get_event_by_id(
    event_id: int,
    user_id: Optional[str] = Depends(get_optional_user_id),
    db: Session = Depends(get_db)
):
    event = db.query(Event).filter(Event.id == event_id).first()
    if not event:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Event not found"
        )

    # Check if current user is registered
    is_registered = False
    if user_id:
        reg = db.query(Registration).filter(
            Registration.user_id == user_id,
            Registration.event_id == event_id
        ).first()
        is_registered = reg is not None

    # Fetch registrations with volunteer profiles
    regs = db.query(Registration).filter(Registration.event_id == event_id).all()
    registrations_list = []
    for r in regs:
        u = db.query(User).filter(User.id == r.user_id).first()
        if u:
            registrations_list.append({
                "id": r.id,
                "user": {
                    "id": u.id,
                    "full_name": u.full_name,
                    "email": u.email,
                    "phone": u.phone
                }
            })

    return {
        "id": event.id,
        "title": event.title,
        "description": event.description,
        "location": event.location,
        "event_date": event.event_date,
        "start_time": event.start_time,
        "end_time": event.end_time,
        "image_url": event.image_url,
        "status": event.status,
        "created_at": event.created_at,
        "is_registered": is_registered,
        "registrations": registrations_list
    }

@app.post("/api/events", response_model=EventResponse, status_code=status.HTTP_201_CREATED)
def create_event(event_data: EventCreate, current_admin: User = Depends(get_current_admin), db: Session = Depends(get_db)):
    new_event = Event(
        title=event_data.title,
        description=event_data.description,
        location=event_data.location,
        event_date=event_data.event_date,
        start_time=event_data.start_time,
        end_time=event_data.end_time,
        image_url=event_data.image_url,
        status=event_data.status or "upcoming"
    )
    db.add(new_event)
    db.commit()
    db.refresh(new_event)
    return new_event

@app.put("/api/events/{event_id}", response_model=EventResponse)
def update_event(event_id: int, event_data: EventUpdate, current_admin: User = Depends(get_current_admin), db: Session = Depends(get_db)):
    event = db.query(Event).filter(Event.id == event_id).first()
    if not event:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Event not found"
        )
    
    if event_data.title is not None:
        event.title = event_data.title
    if event_data.description is not None:
        event.description = event_data.description
    if event_data.location is not None:
        event.location = event_data.location
    if event_data.event_date is not None:
        event.event_date = event_data.event_date
    if event_data.start_time is not None:
        event.start_time = event_data.start_time
    if event_data.end_time is not None:
        event.end_time = event_data.end_time
    if event_data.image_url is not None:
        event.image_url = event_data.image_url
    if event_data.status is not None:
        event.status = event_data.status

    db.commit()
    db.refresh(event)
    return event

@app.delete("/api/events/{event_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_event(event_id: int, current_admin: User = Depends(get_current_admin), db: Session = Depends(get_db)):
    event = db.query(Event).filter(Event.id == event_id).first()
    if not event:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Event not found"
        )
    db.delete(event)
    db.commit()
    return None

# --- REGISTRATIONS ENDPOINTS ---

@app.post("/api/events/{event_id}/join")
def join_event(event_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    # Check if event exists
    event = db.query(Event).filter(Event.id == event_id).first()
    if not event:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Event not found"
        )
    
    # Check if already registered
    existing_reg = db.query(Registration).filter(
        Registration.user_id == current_user.id,
        Registration.event_id == event_id
    ).first()
    
    if existing_reg:
        return {"message": "Already registered", "id": existing_reg.id}
    
    new_reg = Registration(user_id=current_user.id, event_id=event_id)
    db.add(new_reg)
    db.commit()
    db.refresh(new_reg)
    return {"message": "Successfully registered", "id": new_reg.id}

@app.delete("/api/events/{event_id}/leave")
def leave_event(event_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    reg = db.query(Registration).filter(
        Registration.user_id == current_user.id,
        Registration.event_id == event_id
    ).first()
    
    if not reg:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You are not registered for this event"
        )
    
    db.delete(reg)
    db.commit()
    return {"message": "Successfully unregistered"}

@app.get("/api/users/me/registrations")
def get_user_registrations(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    regs = db.query(Registration).filter(Registration.user_id == current_user.id).all()
    
    result = []
    for r in regs:
        e = db.query(Event).filter(Event.id == r.event_id).first()
        if e:
            result.append({
                "id": r.id,
                "event": {
                    "id": e.id,
                    "title": e.title,
                    "description": e.description,
                    "location": e.location,
                    "event_date": e.event_date,
                    "start_time": e.start_time,
                    "end_time": e.end_time,
                    "image_url": e.image_url,
                    "status": e.status
                }
            })
    return result

# --- MESSAGES ENDPOINTS ---

@app.post("/api/messages", response_model=MessageResponse, status_code=status.HTTP_201_CREATED)
def submit_contact_message(msg_data: MessageCreate, db: Session = Depends(get_db)):
    new_message = Message(
        name=msg_data.name,
        email=msg_data.email,
        phone=msg_data.phone,
        category=msg_data.category,
        subject=msg_data.subject,
        message=msg_data.message,
        priority=msg_data.priority
    )
    db.add(new_message)
    db.commit()
    db.refresh(new_message)
    return new_message

@app.get("/api/messages", response_model=List[MessageResponse])
def get_contact_messages(current_admin: User = Depends(get_current_admin), db: Session = Depends(get_db)):
    messages = db.query(Message).order_by(Message.created_at.desc()).all()
    return messages

@app.delete("/api/messages/{message_id}", status_code=status.HTTP_204_NO_CONTENT)
def resolve_message(message_id: int, current_admin: User = Depends(get_current_admin), db: Session = Depends(get_db)):
    msg = db.query(Message).filter(Message.id == message_id).first()
    if not msg:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Message not found"
        )
    db.delete(msg)
    db.commit()
    return None

# --- ADMIN METRICS & VOLUNTEERS ENDPOINTS ---

@app.get("/api/admin/stats", response_model=AdminStats)
def get_admin_stats(current_admin: User = Depends(get_current_admin), db: Session = Depends(get_db)):
    upcoming = db.query(Event).filter(Event.status == "upcoming").count()
    completed = db.query(Event).filter(Event.status == "completed").count()
    return {
        "upcoming_events": upcoming,
        "completed_events": completed
    }

@app.get("/api/admin/volunteers", response_model=List[ProfileResponse])
def get_volunteers(current_admin: User = Depends(get_current_admin), db: Session = Depends(get_db)):
    volunteers = db.query(User).filter(User.role == "volunteer").order_by(User.created_at.desc()).all()
    return volunteers

@app.get("/api/admin/event-registrations")
def get_all_event_registrations(current_admin: User = Depends(get_current_admin), db: Session = Depends(get_db)):
    events = db.query(Event).order_by(Event.event_date.asc()).all()
    
    result = []
    for e in events:
        regs = db.query(Registration).filter(Registration.event_id == e.id).all()
        registrations_list = []
        for r in regs:
            u = db.query(User).filter(User.id == r.user_id).first()
            if u:
                registrations_list.append({
                    "id": r.id,
                    "user": {
                        "id": u.id,
                        "full_name": u.full_name,
                        "email": u.email,
                        "phone": u.phone
                    }
                })
        
        event_dict = {
            "id": e.id,
            "title": e.title,
            "description": e.description,
            "location": e.location,
            "event_date": e.event_date,
            "start_time": e.start_time,
            "end_time": e.end_time,
            "image_url": e.image_url,
            "status": e.status,
            "created_at": e.created_at,
            "registrations": registrations_list
        }
        result.append(event_dict)
        
    return result
