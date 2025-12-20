from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from typing import List

from app.db.session import get_db
from app.models.health import HealthCategory, HealthRecommendation
from app.schemas.health import HealthCategoryRead, HealthCategoryCreate, HealthCategoryUpdate

router = APIRouter(prefix="/health", tags=["Health"])


# CREATE HEALTH CATEGORY
@router.post("/", response_model=HealthCategoryRead)
async def create_health_category(category_in: HealthCategoryCreate, db: AsyncSession = Depends(get_db)):
    category = HealthCategory(
        name=category_in.name,
        description=category_in.description,
        icon=category_in.icon,
        benefits=category_in.benefits,
        usage=category_in.usage,
        safety_notes=category_in.safety_notes,
        is_active=category_in.is_active
    )

    # Add recommendations
    for rec_in in category_in.recommendations:
        recommendation = HealthRecommendation(
            product_id=rec_in.product_id,
            product_name=rec_in.product_name,
            quantity=rec_in.quantity,
            unit=rec_in.unit,
            frequency=rec_in.frequency
        )
        category.recommendations.append(recommendation)

    db.add(category)
    await db.commit()
    await db.refresh(category)

    # Reload with recommendations
    result = await db.execute(
        select(HealthCategory).where(HealthCategory.id == category.id).options(selectinload(HealthCategory.recommendations))
    )
    category = result.scalar_one()
    return category


# GET ALL HEALTH CATEGORIES
@router.get("/", response_model=List[HealthCategoryRead])
async def list_health_categories(db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(HealthCategory).where(HealthCategory.is_active == True).options(selectinload(HealthCategory.recommendations))
    )
    categories = result.scalars().all()
    return categories


# GET SINGLE HEALTH CATEGORY
@router.get("/{category_id}", response_model=HealthCategoryRead)
async def get_health_category(category_id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(HealthCategory).where(HealthCategory.id == category_id).options(selectinload(HealthCategory.recommendations))
    )
    category = result.scalar_one_or_none()
    if not category:
        raise HTTPException(status_code=404, detail="Health category not found")
    return category


# UPDATE HEALTH CATEGORY
@router.put("/{category_id}", response_model=HealthCategoryRead)
async def update_health_category(category_id: str, category_in: HealthCategoryUpdate, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(HealthCategory).where(HealthCategory.id == category_id))
    category = result.scalar_one_or_none()
    if not category:
        raise HTTPException(status_code=404, detail="Health category not found")

    update_data = category_in.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(category, field, value)

    db.add(category)
    await db.commit()
    await db.refresh(category)

    # Reload with recommendations
    result = await db.execute(
        select(HealthCategory).where(HealthCategory.id == category.id).options(selectinload(HealthCategory.recommendations))
    )
    return result.scalar_one()


# DELETE HEALTH CATEGORY
@router.delete("/{category_id}")
async def delete_health_category(category_id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(HealthCategory).where(HealthCategory.id == category_id).options(selectinload(HealthCategory.recommendations)))
    category = result.scalar_one_or_none()
    if not category:
        raise HTTPException(status_code=404, detail="Health category not found")

    await db.delete(category)
    await db.commit()
    return {"detail": "Health category deleted successfully"}