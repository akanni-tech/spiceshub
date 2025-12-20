from sqlalchemy import (
    Column, Integer, String, Text, Boolean, TIMESTAMP, UUID, ARRAY
)
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.base_class import Base
import uuid


class SmartRecommendationRule(Base):
    __tablename__ = "smart_recommendation_rules"

    id = Column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
        unique=True,
        nullable=False,
        index=True
    )
    type = Column(String, nullable=False)  # 'cooking' or 'health'
    trigger = Column(String, nullable=False)  # e.g., 'Pilau', 'Immunity'
    recommended_products = Column(ARRAY(UUID), nullable=False)  # Array of product IDs
    is_active = Column(Boolean, default=True)
    created_at = Column(TIMESTAMP(timezone=True), server_default=func.now())
    updated_at = Column(TIMESTAMP(timezone=True), onupdate=func.now())