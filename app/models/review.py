from sqlalchemy import (
    Column, Integer, String, Float, Boolean, ForeignKey, TIMESTAMP, ARRAY, UUID
)
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.base_class import Base
import uuid


class Review(Base):
    __tablename__ = "reviews"

    id = Column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
        unique=True,
        nullable=False,
        index=True
    )
    product_id = Column(UUID(as_uuid=True), ForeignKey("products.id"), nullable=False)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    rating = Column(Float)
    comment = Column(String)
    created_at = Column(TIMESTAMP(timezone=True), server_default=func.now())

    product = relationship("Product", back_populates="reviews")
    user = relationship("User", back_populates="reviews")