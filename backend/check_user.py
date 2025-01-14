from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
import models
from database import SQLALCHEMY_DATABASE_URL

# Create database engine
engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
db = SessionLocal()

def check_user(email):
    user = db.query(models.User).filter(models.User.email == email).first()
    if user:
        print(f"\nUser Details for {email}:")
        print(f"Username: {user.username}")
        print(f"Email Verified: {user.is_active}")
        print(f"Is Admin: {user.is_admin}")
        print(f"Created At: {user.created_at}")
    else:
        print(f"\nNo user found with email: {email}")

if __name__ == "__main__":
    email = input("Enter email to check: ")
    check_user(email)
