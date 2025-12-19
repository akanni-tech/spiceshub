from pydantic import BaseModel, UUID4
from typing import List, Optional


class CategoryRead(BaseModel):
  id: UUID4
  name: str

  class Config:
      orm_mode = True



class ProductSummary(BaseModel):
    id: UUID4
    name: str
    price: float
    category: CategoryRead
    main_image: Optional[str] = None
    rating: Optional[float] = None
    reviewCount: Optional[int] = None

    class Config:
        orm_mode = True


# WISHLIST ITEM SCHEMAS

class WishlistItemBase(BaseModel):
    product_id: UUID4

    model_config = {"from_attributes": True}


class WishlistItemCreate(WishlistItemBase):
    pass


class WishlistItemRead(WishlistItemBase):
    id: UUID4
    product: ProductSummary

    class Config:
        orm_mode = True


# WISHLIST SCHEMAS

class WishlistBase(BaseModel):
    user_id: str

    model_config = {"from_attributes": True}


class WishlistCreate(WishlistBase):
    items: Optional[List[WishlistItemCreate]] = []


class WishlistRead(BaseModel):
    id: UUID4
    user_id: str
    items: List[WishlistItemRead] = []

    class Config:
        orm_mode = True
