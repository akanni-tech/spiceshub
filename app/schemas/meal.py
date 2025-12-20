from pydantic import BaseModel
from typing import List, Optional
from uuid import UUID
from datetime import datetime


# MEAL ITEM SCHEMAS
class MealItemBase(BaseModel):
    product_id: UUID
    product_name: str
    quantity: float
    unit: str

    model_config = {"from_attributes": True}


class MealItemCreate(MealItemBase):
    pass


class MealItemRead(MealItemBase):
    id: UUID

    class Config:
        orm_mode = True


# MEAL SCHEMAS
class MealBase(BaseModel):
    name: str
    description: Optional[str] = None
    image: Optional[str] = None
    serves: int = 4
    recipe: Optional[str] = None
    add_ons: Optional[List[str]] = None
    is_active: bool = True

    model_config = {"from_attributes": True}


class MealCreate(MealBase):
    items: List[MealItemCreate]


class MealUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    image: Optional[str] = None
    serves: Optional[int] = None
    recipe: Optional[str] = None
    add_ons: Optional[List[str]] = None
    is_active: Optional[bool] = None

    model_config = {"from_attributes": True}


class MealRead(MealBase):
    id: UUID
    created_at: datetime
    updated_at: Optional[datetime] = None
    items: List[MealItemRead] = []

    class Config:
        orm_mode = True