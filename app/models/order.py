from sqlalchemy import (
    Column, Integer, String, Float, Boolean, ForeignKey, TIMESTAMP, ARRAY, UUID, Text
)
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.base_class import Base
import uuid

class Order(Base):
    __tablename__ = "orders"

    id = Column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
        unique=True,
        nullable=False,
        index=True
    )
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    status = Column(String)
    city = Column(String)
    area = Column(String)
    address = Column(String)
    phoneNumber = Column(String)
    apartment = Column(String)
    payOnDelivery = Column(Boolean)
    paid = Column(Boolean, default=False)
    mpesaCode = Column(String)
    additionalNote = Column(Text)
    internal_notes = Column(ARRAY(String), nullable=True)
    total_amount = Column(Float)
    shipping_method = Column(String, default='standard')
    created_at = Column(TIMESTAMP(timezone=True), server_default=func.now())

    user = relationship("User", back_populates="orders")
    items = relationship("OrderItem", back_populates="order", cascade="all, delete-orphan")


class OrderItem(Base):
    __tablename__ = "order_items"

    id = Column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
        unique=True,
        nullable=False,
        index=True
    )
    order_id = Column(UUID(as_uuid=True), ForeignKey("orders.id"))
    product_id = Column(UUID(as_uuid=True), ForeignKey("products.id"))
    name = Column(String)
    image = Column(String, nullable=True)
    container = Column(String, nullable=True)
    quantity = Column(Integer)
    price = Column(Float)

    order = relationship("Order", back_populates="items")
    product = relationship("Product")