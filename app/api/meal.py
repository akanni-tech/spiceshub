from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from typing import List

from app.db.session import get_db
from app.models.meal import Meal, MealItem
from app.schemas.meal import MealRead, MealCreate, MealUpdate, MealItemRead

router = APIRouter(prefix="/meals", tags=["Meals"])


# CREATE MEAL
@router.post("/", response_model=MealRead)
async def create_meal(meal_in: MealCreate, db: AsyncSession = Depends(get_db)):
    meal = Meal(
        name=meal_in.name,
        description=meal_in.description,
        image=meal_in.image,
        serves=meal_in.serves,
        recipe=meal_in.recipe,
        add_ons=meal_in.add_ons,
        is_active=meal_in.is_active
    )

    # Add meal items
    for item_in in meal_in.items:
        meal_item = MealItem(
            product_id=item_in.product_id,
            product_name=item_in.product_name,
            quantity=item_in.quantity,
            unit=item_in.unit
        )
        meal.items.append(meal_item)

    db.add(meal)
    await db.commit()
    await db.refresh(meal)

    # Reload with items
    result = await db.execute(
        select(Meal).where(Meal.id == meal.id).options(selectinload(Meal.items))
    )
    meal = result.scalar_one()
    return meal


# GET ALL MEALS
@router.get("/", response_model=List[MealRead])
async def list_meals(db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(Meal).where(Meal.is_active == True).options(selectinload(Meal.items))
    )
    meals = result.scalars().all()
    return meals


# GET SINGLE MEAL
@router.get("/{meal_id}", response_model=MealRead)
async def get_meal(meal_id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(Meal).where(Meal.id == meal_id).options(selectinload(Meal.items))
    )
    meal = result.scalar_one_or_none()
    if not meal:
        raise HTTPException(status_code=404, detail="Meal not found")
    return meal


# UPDATE MEAL
@router.put("/{meal_id}", response_model=MealRead)
async def update_meal(meal_id: str, meal_in: MealUpdate, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Meal).where(Meal.id == meal_id))
    meal = result.scalar_one_or_none()
    if not meal:
        raise HTTPException(status_code=404, detail="Meal not found")

    update_data = meal_in.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(meal, field, value)

    db.add(meal)
    await db.commit()
    await db.refresh(meal)

    # Reload with items
    result = await db.execute(
        select(Meal).where(Meal.id == meal.id).options(selectinload(Meal.items))
    )
    return result.scalar_one()


# DELETE MEAL
@router.delete("/{meal_id}")
async def delete_meal(meal_id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Meal).where(Meal.id == meal_id).options(selectinload(Meal.items)))
    meal = result.scalar_one_or_none()
    if not meal:
        raise HTTPException(status_code=404, detail="Meal not found")

    await db.delete(meal)
    await db.commit()
    return {"detail": "Meal deleted successfully"}