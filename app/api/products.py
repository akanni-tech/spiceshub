from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload
from sqlalchemy.future import select
from typing import List

from app.db.session import get_db
from app.models.product import Product, ProductImage
from app.schemas.productSchema import ProductCreate, ProductRead, ProductImageCreate, ProductUpdate

router = APIRouter(prefix="/products", tags=["Products"])

# CREATE PRODUCT
@router.post("/", response_model=ProductRead)
async def create_product(
  product_in: ProductCreate,
  db: AsyncSession = Depends(get_db),
):
  # Create product object
  product = Product(
    name=product_in.name,
    price=product_in.price,
    originalPrice=product_in.originalPrice,
    stock=product_in.stock,
    rating=product_in.rating,
    reviewCount=product_in.reviewCount,
    isSale=product_in.isSale,
    description=product_in.description,
    isNew=product_in.isNew,
    containers=product_in.containers,
    images=product_in.images,
    cost_per_item=product_in.cost_per_item,
    isFeatured=product_in.isFeatured,
    status=product_in.status,
    main_image=product_in.main_image,
    category_id=product_in.category_id,
  )

  # Add images if any
  # for img_in in product_in.images:
  #   image = ProductImage(
  #     url=img_in.url,
  #     alt_text=img_in.alt_text,
  #     is_main=img_in.is_main,
  #   )
  #   product.images.append(image)

  db.add(product)
  await db.commit()
  await db.refresh(product)

  # Load category relationship to avoid serialization error
  result = await db.execute(
      select(Product)
      .where(Product.id == product.id)
      .options(selectinload(Product.category))
  )
  product = result.scalar_one()
  return product


# GET ALL PRODUCTS
@router.get("/", response_model=List[ProductRead])
async def list_products(db: AsyncSession = Depends(get_db)):
  result = await db.execute(
    select(Product)
    .options(
      # selectinload(Product.images),
      selectinload(Product.category)
    )
  )
  products = result.scalars().all()
  return products


# GET SINGLE PRODUCT
@router.get("/{product_id}", response_model=ProductRead)
async def get_product(product_id: str, db: AsyncSession = Depends(get_db)):
  result = await db.execute(
    select(Product)
    .where(Product.id == product_id)
    .options(
      # selectinload(Product.images),
      selectinload(Product.category)
    )
  )
  product = result.scalar_one_or_none()

  if not product:
    raise HTTPException(status_code=404, detail="Product not found")

  return product

# UPDATE PRODUCT
@router.put("/{product_id}", response_model=ProductRead)
async def update_product(
  product_id: str,
  product_in: ProductUpdate,
  db: AsyncSession = Depends(get_db)
):
  result = await db.execute(
    select(Product).where(Product.id == product_id)
  )
  product = result.scalar_one_or_none()
  if not product:
    raise HTTPException(status_code=404, detail="Product not found")

  # Update fields (partial updates)
  update_data = product_in.dict(exclude_unset=True)
  for field, value in update_data.items():
    setattr(product, field, value)

  # Update images if provided
  # if product_in.images:
  #   # Clear existing images
  #   product.images.clear()
  #   # Add new images
  #   for img_in in product_in.images:
  #     image = ProductImage(
  #       url=img_in.url,
  #       alt_text=img_in.alt_text,
  #       is_main=img_in.is_main,
  #     )
  #     product.images.append(image)

  db.add(product)
  await db.commit()
  await db.refresh(product)
  return product


# DELETE PRODUCT
@router.delete("/{product_id}")
async def delete_product(product_id: str, db: AsyncSession = Depends(get_db)):
  result = await db.execute(select(Product).where(Product.id == product_id))
  product = result.scalar_one_or_none()
  if not product:
    raise HTTPException(status_code=404, detail="Product not found")
  
  db.delete(product)
  await db.commit()
  return {"detail": "Product deleted successfully"}
