from typing import List, Optional
from pydantic import BaseModel, UUID4

class ProductSummary(BaseModel):
    id: UUID4
    name: str
    price: float
    main_image: Optional[str]
    isSale: bool = False
    isNew: bool = False
    rating: Optional[float] = 0.0
    reviewCount: Optional[int] = 0

    model_config = {"from_attributes": True}



class CategoryBase(BaseModel):
    name: str
    isFeatured: bool = False
    status: Optional[str] = None
    image: Optional[str] = None
    description: Optional[str] = None

class CategoryCreate(CategoryBase):
    pass

class CategoryUpdate(BaseModel):
    name: Optional[str]
    isFeatured: bool
    status: Optional[str]
    image: Optional[str]
    description: Optional[str]

    model_config = {"from_attributes": True}

class CategoryRead(CategoryBase):
    id: UUID4
    products: List[ProductSummary] = []

    model_config = {"from_attributes": True}
