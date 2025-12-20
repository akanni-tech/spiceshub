from pydantic import BaseModel
from typing import List, Optional
from uuid import UUID
from datetime import datetime


# HEALTH RECOMMENDATION SCHEMAS
class HealthRecommendationBase(BaseModel):
    product_id: UUID
    product_name: str
    quantity: float
    unit: str
    frequency: str = "daily"

    model_config = {"from_attributes": True}


class HealthRecommendationCreate(HealthRecommendationBase):
    pass


class HealthRecommendationRead(HealthRecommendationBase):
    id: UUID
    category_id: UUID

    class Config:
        orm_mode = True


# HEALTH CATEGORY SCHEMAS
class HealthCategoryBase(BaseModel):
    name: str
    description: Optional[str] = None
    icon: Optional[str] = None
    benefits: Optional[str] = None
    usage: Optional[str] = None
    safety_notes: Optional[str] = None
    is_active: bool = True

    model_config = {"from_attributes": True}


class HealthCategoryCreate(HealthCategoryBase):
    recommendations: List[HealthRecommendationCreate]


class HealthCategoryUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    icon: Optional[str] = None
    benefits: Optional[str] = None
    usage: Optional[str] = None
    safety_notes: Optional[str] = None
    is_active: Optional[bool] = None

    model_config = {"from_attributes": True}


class HealthCategoryRead(HealthCategoryBase):
    id: UUID
    created_at: datetime
    updated_at: Optional[datetime] = None
    recommendations: List[HealthRecommendationRead] = []

    class Config:
        orm_mode = True