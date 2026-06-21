from pydantic import BaseModel, EmailStr
from typing import Optional, List
import datetime

class UserCreate(BaseModel):
    email: EmailStr
    password: str
    full_name: str
    phone: Optional[str] = None
    role: Optional[str] = "volunteer"

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: str
    email: EmailStr
    full_name: str
    phone: Optional[str] = None
    role: str
    created_at: datetime.datetime

    class Config:
        from_attributes = True

class ProfileResponse(BaseModel):
    id: str
    full_name: str
    phone: Optional[str] = None
    role: str
    email: EmailStr
    created_at: datetime.datetime

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str
    user: UserResponse
    profile: ProfileResponse

class TokenData(BaseModel):
    user_id: Optional[str] = None

class EventCreate(BaseModel):
    title: str
    description: str
    location: str
    event_date: str
    start_time: str
    end_time: str
    image_url: Optional[str] = None
    status: Optional[str] = "upcoming"

class EventUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    location: Optional[str] = None
    event_date: Optional[str] = None
    start_time: Optional[str] = None
    end_time: Optional[str] = None
    image_url: Optional[str] = None
    status: Optional[str] = None

class EventResponse(BaseModel):
    id: int
    title: str
    description: str
    location: str
    event_date: str
    start_time: str
    end_time: str
    image_url: Optional[str] = None
    status: str
    created_at: datetime.datetime

    class Config:
        from_attributes = True

class MessageCreate(BaseModel):
    name: str
    email: EmailStr
    phone: str
    category: str
    subject: str
    message: str
    priority: str

class MessageResponse(BaseModel):
    id: int
    name: str
    email: EmailStr
    phone: str
    category: str
    subject: str
    message: str
    priority: str
    created_at: datetime.datetime

    class Config:
        from_attributes = True

class AdminStats(BaseModel):
    upcoming_events: int
    completed_events: int
