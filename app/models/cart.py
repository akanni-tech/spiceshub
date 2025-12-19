from sqlalchemy import (
    Column, Integer, String, Float, Boolean, ForeignKey, TIMESTAMP, ARRAY, UUID
)
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.base_class import Base
import uuid


class Cart(Base):
    __tablename__ = "carts"

    id = Column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
        unique=True,
        nullable=False,
        index=True
    )
    user_id = Column(String(255), ForeignKey("users.supabase_id"), unique=True, nullable=False)

    user = relationship("User", back_populates="carts")
    items = relationship("CartItem", back_populates="cart", cascade="all, delete-orphan", order_by='CartItem.id.asc()')


class CartItem(Base):
    __tablename__ = "cart_items"

    id = Column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
        unique=True,
        nullable=False,
        index=True
    )
    cart_id = Column(UUID(as_uuid=True), ForeignKey("carts.id"), nullable=False)
    product_id = Column(UUID(as_uuid=True), ForeignKey("products.id"))
    container = Column(String, nullable=True) 
    quantity = Column(Integer)

    cart = relationship("Cart", back_populates="items")
    product = relationship("Product")