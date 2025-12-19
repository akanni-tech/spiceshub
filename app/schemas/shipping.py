from pydantic import BaseModel
from typing import Optional

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
    area: str

class ShippingCreate(ShippingBase):
    user_id: str

    model_config = {"from_attributes": True}

class ShippingUpdate(BaseModel):
    country: Optional[str] = None
    city: Optional[str] = None
    area: Optional[str] = None

class Shipping(ShippingBase):
    id: str
    user: UserNested

    class Config:
        orm_mode = True
