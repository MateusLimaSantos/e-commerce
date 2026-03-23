from sqlalchemy import Column, Integer, String, Boolean
from .product import Base

class Admin(Base):
    __tablename__ = 'admins'

    id = Column(Integer, primary_key=True, autoincrement=True)
    email = Column(String(150), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    is_active = Column(Boolean, default=True)

    def __repr__(self):
        return f"<Admin(email='{self.email}', active={self.is_active})>"