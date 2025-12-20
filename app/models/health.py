from sqlalchemy import (
    Column, Integer, String, Text, Boolean, TIMESTAMP, UUID, ARRAY, Float, ForeignKey
)
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.base_class import Base
import uuid


class HealthCategory(Base):
    __tablename__ = "health_categories"

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
    icon = Column(String)
    benefits = Column(Text)
    usage = Column(Text)
    safety_notes = Column(Text)
    is_active = Column(Boolean, default=True)
    created_at = Column(TIMESTAMP(timezone=True), server_default=func.now())
    updated_at = Column(TIMESTAMP(timezone=True), onupdate=func.now())

    recommendations = relationship("HealthRecommendation", back_populates="category", cascade="all, delete-orphan")


class HealthRecommendation(Base):
    __tablename__ = "health_recommendations"

    id = Column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
        unique=True,
        nullable=False,
        index=True
    )
    category_id = Column(UUID(as_uuid=True), ForeignKey("health_categories.id"), index=True)
    product_id = Column(UUID(as_uuid=True), ForeignKey("products.id"), index=True)
    product_name = Column(String, nullable=False)
    quantity = Column(Float, nullable=False)
    unit = Column(String, nullable=False)
    frequency = Column(String, default="daily")

    category = relationship("HealthCategory", back_populates="recommendations")