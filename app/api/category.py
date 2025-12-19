from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload

from typing import List

from app.db.session import get_db
from app.models.product import Category
from app.models.product import Product
from app.schemas.categorySchema import CategoryCreate, CategoryUpdate, CategoryRead
from app.schemas.categorySchema import ProductSummary
from sqlalchemy.orm import selectinload

router = APIRouter(prefix="/categories", tags=["Categories"])

# CREATE CATEGORY
@router.post("/", response_model=CategoryRead)
async def create_category(category_in: CategoryCreate, db: AsyncSession = Depends(get_db)):
    category = Category(**category_in.dict())
    db.add(category)
    await db.commit()
    await db.refresh(category)

    # Load products relationship to avoid serialization error
    result = await db.execute(
        select(Category)
        .where(Category.id == category.id)
        .options(selectinload(Category.products))
    )
    category = result.scalar_one()
    return category


# LIST CATEGORIES WITH LIGHTWEIGHT PRODUCTS
@router.get("/", response_model=List[CategoryRead])
async def list_categories(db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(Category)
        .options(
            selectinload(Category.products)
        )
    )

    categories = result.scalars().all()

    # Convert products -> ProductSummary
    # for c in categories:
    #     for p in c.products:
    #         # p.images is safely loaded now
    #         p.main_image = (
    #             next((img.url for img in p.images if img.is_main), None)
    #             or (p.images[0].url if p.images else None)
    #         )

    return categories


# GET SINGLE CATEGORY WITH LIGHTWEIGHT PRODUCTS
@router.get("/{category_id}", response_model=CategoryRead)
async def get_category(category_id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(Category)
        .where(Category.id == category_id)
        .options(
            selectinload(Category.products)
        )
    )

    category = result.scalar_one_or_none()

    if not category:
        raise HTTPException(status_code=404, detail="Category not found")

    # Now p.images is fully loaded, so no lazy loading occurs
    # for p in category.products:
    #     p.main_image = (
    #         next((img.url for img in p.images if img.is_main), None)
    #         or (p.images[0].url if p.images else None)
    #     )

    return category



# UPDATE CATEGORY
@router.put("/{category_id}", response_model=CategoryRead)
async def update_category(category_id: str, category_in: CategoryUpdate, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Category).where(Category.id == category_id))
    category = result.scalar_one_or_none()
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")

    update_data = category_in.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(category, field, value)

    db.add(category)
    await db.commit()
    await db.refresh(category)
    return category


# DELETE CATEGORY
@router.delete("/{category_id}")
async def delete_category(category_id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Category).where(Category.id == category_id))
    category = result.scalar_one_or_none()
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")

    await db.delete(category)
    await db.commit()

    return {"detail": "Category deleted successfully"}
