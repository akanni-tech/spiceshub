from pydantic import BaseModel
from typing import List, Optional
from uuid import UUID
from datetime import datetime


# SALE PRODUCT SCHEMAS
class SaleProductBase(BaseModel):
    product_id: UUID
    discounted_price: float

    class Config:
        orm_mode = True


class SaleProductCreate(SaleProductBase):
    pass


class SaleProductRead(SaleProductBase):
    id: UUID
    product: Optional[dict] = None  # Simplified product info

    class Config:
        orm_mode = True
        from_attributes = True


# SALE SCHEMAS
class SaleBase(BaseModel):
    name: str
    description: Optional[str] = None
    discount_percentage: float
    start_date: datetime
    end_date: datetime
    is_active: bool = False
    banner_image: Optional[str] = None
    banner_text: Optional[str] = None

    class Config:
        orm_mode = True


class SaleCreate(SaleBase):
    products: List[SaleProductCreate]


class SaleUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    discount_percentage: Optional[float] = None
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    is_active: Optional[bool] = None
    banner_image: Optional[str] = None
    banner_text: Optional[str] = None

    class Config:
        orm_mode = True


class SaleRead(SaleBase):
    id: UUID
    created_at: datetime
    updated_at: Optional[datetime] = None
    products: List[SaleProductRead] = []

    class Config:
        orm_mode = True