from pydantic import BaseModel, UUID4
from typing import List
from typing import Optional


# CART ITEM SCHEMAS

from typing import Optional
from pydantic import BaseModel

class CategoryRead(BaseModel):
    id: UUID4
    image: Optional[str] = None
    name: str

    model_config = {"from_attributes": True}


class ProductSummary(BaseModel):
    id: UUID4
    name: str
    price: float
    main_image: Optional[str] = None
    category: Optional[CategoryRead] = None
    rating: Optional[float] = 0.0
    reviewCount: Optional[int] = 0
    isSale: bool = False
    isNew: bool = False

    container: Optional[str] = None

    model_config = {"from_attributes": True}

class CartItemBase(BaseModel):
  product_id: UUID4
  container: Optional[str] = None
  quantity: int


class CartItemCreate(CartItemBase):
  pass


class CartItemRead(CartItemBase):
  id: UUID4
  product: ProductSummary

  model_config = {"from_attributes": True}


# CART SCHEMAS

class CartBase(BaseModel):
  user_id: str


class CartCreate(CartBase):
  items: Optional[List[CartItemCreate]] = []


class CartRead(CartBase):
  id: UUID4
  items: List[CartItemRead] = []

  class Config:
    orm_mode = True




class GuestCartItemRead(BaseModel):
    product_id: str
    name: str
    price: float
    main_image: Optional[str] = None
    category_name: Optional[str] = None
    rating: Optional[float] = None
    reviewCount: Optional[int] = None
    isSale: Optional[bool] = None
    isNew: Optional[bool] = None
    container: Optional[str] = None
    quantity: int


class GuestCartRead(BaseModel):
    session_id: str
    items: List[GuestCartItemRead]


class GuestUpdateQuantity(BaseModel):
    session_id: str
    product_id: str
    quantity: int
    container: Optional[str] = None

