from pydantic import BaseModel, UUID4
from typing import Optional
from datetime import datetime


# LIGHTWEIGHT NESTED OBJECTS (optional)

class UserSummary(BaseModel):
    id: UUID4
    firstName: Optional[str] = None
    lastName: Optional[str] = None

    model_config = {"from_attributes": True}


class ProductSummary(BaseModel):
    id: UUID4
    name: str

    model_config = {"from_attributes": True}


# REVIEW SCHEMAS

class ReviewBase(BaseModel):
    rating: float
    comment: Optional[str] = None


class ReviewCreate(ReviewBase):
    product_id: UUID4
    user_id: UUID4

    model_config = {"from_attributes": True}


class ReviewRead(ReviewBase):
    id: UUID4
    product_id: UUID4
    user_id: UUID4
    created_at: datetime

    # Optional nested relationships
    user: Optional[UserSummary] = None
    product: Optional[ProductSummary] = None

    model_config = {"from_attributes": True}
