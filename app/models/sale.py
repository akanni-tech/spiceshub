from sqlalchemy import (
    Column, Integer, String, Text, Boolean, TIMESTAMP, UUID, ARRAY, Float, DateTime, ForeignKey
)
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.base_class import Base
import uuid


class Sale(Base):
    __tablename__ = "sales"

    id = Column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
        unique=True,
        nullable=False,
        index=True
    )
    name = Column(String, nullable=False)
    description = Column(Text)
    discount_percentage = Column(Float, nullable=False)  # e.g., 20.0 for 20%
    start_date = Column(DateTime, nullable=False)
    end_date = Column(DateTime, nullable=False)
    is_active = Column(Boolean, default=False)
    banner_image = Column(String)
    banner_text = Column(Text)
    created_at = Column(TIMESTAMP(timezone=True), server_default=func.now())
    updated_at = Column(TIMESTAMP(timezone=True), onupdate=func.now())

    # Relationship with products (many-to-many through sale_products)
    products = relationship("SaleProduct", back_populates="sale", cascade="all, delete-orphan")


class SaleProduct(Base):
    __tablename__ = "sale_products"

    id = Column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
        unique=True,
        nullable=False,
        index=True
    )
    sale_id = Column(UUID(as_uuid=True), ForeignKey("sales.id"), index=True)
    product_id = Column(UUID(as_uuid=True), ForeignKey("products.id"), index=True)
    discounted_price = Column(Float, nullable=False)

    sale = relationship("Sale", back_populates="products")
    product = relationship("Product")