import datetime
import uuid
from sqlalchemy import Column, String, Integer, DateTime, ForeignKey, Date, Time, Text
from sqlalchemy.orm import relationship
from .database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    full_name = Column(String, nullable=False)
    phone = Column(String, nullable=True)
    role = Column(String, default="volunteer") # 'volunteer' or 'admin'
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    # Relationships
    registrations = relationship("Registration", back_populates="user", cascade="all, delete-orphan")


class Event(Base):
    __tablename__ = "events"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    location = Column(String, nullable=False)
    event_date = Column(String, nullable=False) # 'YYYY-MM-DD'
    start_time = Column(String, nullable=False) # 'HH:MM' or 'HH:MM:SS'
    end_time = Column(String, nullable=False) # 'HH:MM' or 'HH:MM:SS'
    image_url = Column(Text, nullable=True)
    status = Column(String, default="upcoming") # 'upcoming' or 'completed'
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    # Relationships
    registrations = relationship("Registration", back_populates="event", cascade="all, delete-orphan")


class Registration(Base):
    __tablename__ = "registrations"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    event_id = Column(Integer, ForeignKey("events.id", ondelete="CASCADE"), nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    # Relationships
    user = relationship("User", back_populates="registrations")
    event = relationship("Event", back_populates="registrations")


class Message(Base):
    __tablename__ = "messages"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, nullable=False)
    phone = Column(String, nullable=False)
    category = Column(String, nullable=False)
    subject = Column(String, nullable=False)
    message = Column(Text, nullable=False)
    priority = Column(String, default="medium") # 'low', 'medium', 'high', 'emergency'
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
