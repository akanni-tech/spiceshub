from pydantic import BaseModel, Field, UUID4
from typing import List, Optional


class ProductImageBase(BaseModel):
    url: str
    alt_text: Optional[str] = None
    is_main: bool = False

class CategoryRead(BaseModel):
    id: UUID4
    image: Optional[str] = None
    name: str

    model_config = {"from_attributes": True}

class ProductImageCreate(ProductImageBase):
    pass

class ProductBase(BaseModel):
    name: str
    price: float
    originalPrice: Optional[float] = None
    stock: int
    rating: Optional[float] = 0.0
    reviewCount: Optional[int] = 0
    isSale: bool = False
    isNew: bool = False
    containers: Optional[List[str]] = Field(default_factory=list)
    description: Optional[str]
    images: Optional[List[str]] = Field(default_factory=list)
    status: Optional[str]
    cost_per_item: Optional[float]
    isFeatured: Optional[bool] = False
    main_image: Optional[str] = None
    category_id: str

    # images: Optional[List[ProductImageCreate]] = Field(default_factory=list)

class ProductCreate(ProductBase):
    pass

class ProductUpdate(BaseModel):
    name: Optional[str]
    price: Optional[float]
    originalPrice: Optional[float]
    stock: Optional[int]
    rating: Optional[float]
    reviewCount: Optional[int]
    isFeatured: Optional[bool]
    cost_per_item: Optional[float]
    isSale: Optional[bool]
    isNew: Optional[bool]
    containers: Optional[List[str]] = Field(default_factory=list)
    description: Optional[str]
    main_image: Optional[str]
    category_id: Optional[str]
    images: Optional[List[str]] = Field(default_factory=list)

    class Config:
        orm_mode = True

class ProductRead(ProductBase):
    id: UUID4
    category_id: UUID4
    category: CategoryRead

    class Config:
        orm_mode = True

    # @property
    # def main_image(self):
    #     main_img = next((img.url for img in self.images if img.is_main), None)
    #     return main_img or (self.images[0].url if self.images else None)
