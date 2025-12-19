from sqlalchemy import (
    Column, Integer, String, Float, Boolean, ForeignKey, TIMESTAMP, ARRAY
)
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.base_class import Base
import uuid


class Wishlist(Base):
    __tablename__ = "wishlists"

    id = Column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
        unique=True,
        nullable=False,
        index=True
    )
    user_id = Column(String(255), ForeignKey("users.supabase_id"), unique=True, nullable=False)

    user = relationship("User", back_populates="wishlists")
    items = relationship("WishlistItem", back_populates="wishlist", cascade="all, delete-orphan", order_by='WishlistItem.id.asc()')


class WishlistItem(Base):
    __tablename__ = "wishlist_items"

    id = Column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
        unique=True,
        nullable=False,
        index=True
    )
    wishlist_id = Column(UUID(as_uuid=True), ForeignKey("wishlists.id"), unique=True, nullable=False)
    product_id = Column(UUID(as_uuid=True), ForeignKey("products.id"), unique=True)

    wishlist = relationship("Wishlist", back_populates="items")
    product = relationship("Product")