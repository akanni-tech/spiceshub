from sqlalchemy import (
    Column, Integer, String, Float, Boolean, ForeignKey, TIMESTAMP, ARRAY, DateTime, Enum
)
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from app.db.base_class import Base
import uuid
import enum

class UserRole(str, enum.Enum):
    ADMIN = "admin"
    USER = "user"
    GUEST = "guest"

class User(Base):
    __tablename__ = "users"

    id = Column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
        unique=True,
        nullable=False,
        index=True
    )
    supabase_id = Column(String(255), unique=True, index=True)
    firstName = Column(String(255))
    lastName = Column(String(255))
    role = Column(Enum(UserRole), default=UserRole.USER)
    email = Column(String, unique=True, index=True)
    phoneNumber = Column(String)
    is_active = Column(Boolean, default=True)
    is_verified = Column(Boolean, default=False)
    avatar_url = Column(String(500), nullable=True)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    last_login = Column(DateTime(timezone=True))

    orders = relationship("Order", back_populates="user", cascade="all, delete-orphan")
    carts = relationship("Cart", back_populates="user", cascade="all, delete-orphan")
    wishlists = relationship("Wishlist", back_populates="user", cascade="all, delete-orphan")
    reviews = relationship("Review", back_populates="user", cascade="all, delete-orphan")
    shipping_addresses = relationship("ShippingAddress", back_populates="user", cascade="all, delete-orphan")