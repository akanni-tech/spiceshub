from pydantic import BaseModel
from typing import List, Optional
from uuid import UUID
from datetime import datetime
from uuid import UUID


# ORDER ITEM SCHEMAS


class OrderItemBase(BaseModel):
    product_id: UUID
    container: Optional[str] = None
    name: Optional[str]
    image: Optional[str]
    quantity: int
    price: float

    model_config = {"from_attributes": True}


class OrderItemCreate(OrderItemBase):
    pass


class OrderItemRead(OrderItemBase):
    id: UUID

    class Config:
        orm_mode = True


# ORDER SCHEMAS

class OrderBase(BaseModel):
    user_id: UUID
    status: str
    total_amount: float
    shipping_method: str = 'standard'
    city: str
    area: str
    paid: Optional[bool]
    address: str
    phoneNumber: str
    internal_notes: Optional[List[str]]
    apartment: str
    payOnDelivery: bool = False
    mpesaCode: Optional[str] = None
    additionalNote: Optional[str] = None
    internal_notes: Optional[List[str]] = None

    model_config = {"from_attributes": True}


class OrderCreate(OrderBase):
    items: List[OrderItemCreate]


class OrderUpdate(BaseModel):
    status: Optional[str] = None
    paid: Optional[bool] = None
    internal_notes: Optional[List[str]] = None

    model_config = {"from_attributes": True}


class OrderRead(OrderBase):
    id: UUID
    created_at: datetime
    items: List[OrderItemRead] = []

    class Config:
        orm_mode = True
