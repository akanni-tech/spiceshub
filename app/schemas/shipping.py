from pydantic import BaseModel
from typing import Optional
from uuid import UUID

class UserNested(BaseModel):
    id: str
    firstName: str
    lastName: str
    email: str
    phoneNumber: str

    class Config:
        orm_mode = True


class ShippingBase(BaseModel):
    country: str
    city: str
    phone: Optional[str] = None
    address: Optional[str] = None
    apartment: Optional[str] = None
    note: Optional[str] = None
    area: str

class ShippingCreate(ShippingBase):
    user_id: UUID

    model_config = {"from_attributes": True}

class ShippingUpdate(BaseModel):
    country: Optional[str] = None
    city: Optional[str] = None
    area: Optional[str] = None
    phone: Optional[str] = None
    apartment: Optional[str] = None
    note: Optional[str] = None
    address: Optional[str] = None

class Shipping(ShippingBase):
    id: UUID
    user_id: UUID

    model_config = {"from_attributes": True}
