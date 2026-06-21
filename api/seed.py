import datetime
from .database import engine, SessionLocal
from .models import Base, User, Event, Registration, Message
from .auth import get_password_hash

def seed_database():
    print("Initializing database tables...")
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    try:
        # Check if users already exist
        if db.query(User).count() > 0:
            print("Database already seeded with users. Skipping...")
            return
            
        print("Seeding users...")
        # 1. Admin
        admin_user = User(
            email="admin@ecoclean.org",
            password_hash=get_password_hash("admin123"),
            full_name="Eco Admin",
            phone="+91 9999988888",
            role="admin"
        )
        db.add(admin_user)
        
        # 2. Volunteer
        volunteer_user = User(
            email="volunteer@gmail.com",
            password_hash=get_password_hash("volunteer123"),
            full_name="John Volunteer",
            phone="+91 8888877777",
            role="volunteer"
        )
        db.add(volunteer_user)
        db.commit()
        db.refresh(admin_user)
        db.refresh(volunteer_user)
        
        print("Seeding events...")
        # 3. Events
        event1 = Event(
            title="Marina Beach Coastal Clean Drive",
            description="Join us in our monthly beach clean drive to remove plastic pollution and restore the beauty of Marina Beach. Meet at Light House. Bags, gloves, and refreshments will be provided!",
            location="Marina Beach Light House, Chennai",
            event_date="2026-07-15",
            start_time="06:30",
            end_time="09:30",
            image_url="https://images.unsplash.com/photo-1618477388954-7852f32655ec?auto=format&fit=crop&q=80&w=800",
            status="upcoming"
        )
        db.add(event1)
        
        event2 = Event(
            title="Bessy Beach Plastics Removal Campaign",
            description="A special campaign focused on removing microplastics and fishing nets from the Besant Nagar beach sands. Huge success with over 50 volunteers participating!",
            location="Besant Nagar Beach, Chennai",
            event_date="2026-06-10",
            start_time="07:00",
            end_time="10:00",
            image_url="https://images.unsplash.com/photo-1520333789090-1afc82db536a?auto=format&fit=crop&q=80&w=800",
            status="completed"
        )
        db.add(event2)
        
        event3 = Event(
            title="Adyar Estuary Clean Campaign",
            description="Protect local marine life by cleaning the Adyar river mouth and estuary area. Focus on removing plastic bottles and debris blocks.",
            location="Adyar River Estuary Area, Chennai",
            event_date="2026-08-02",
            start_time="06:00",
            end_time="09:00",
            image_url="https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&q=80&w=800",
            status="upcoming"
        )
        db.add(event3)
        db.commit()
        db.refresh(event1)
        
        print("Seeding registration...")
        # 4. Registration
        reg = Registration(
            user_id=volunteer_user.id,
            event_id=event1.id
        )
        db.add(reg)
        
        print("Seeding contact messages...")
        # 5. Messages
        msg = Message(
            name="Sarah Green",
            email="sarah@eco-lover.org",
            phone="9876543210",
            category="partnership",
            subject="Corporate Volunteering Inquiry",
            message="Hello! Our software team of 25 people would love to participate in your upcoming beach clean drive as part of our CSR program. Could you please let us know how we can coordinate?",
            priority="high"
        )
        db.add(msg)
        db.commit()
        
        print("Database seeding completed successfully!")
    except Exception as e:
        db.rollback()
        print(f"Error seeding database: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    seed_database()
