from fastapi import APIRouter, Depends
from typing import List, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import noload
from app.db.session import get_db
from app.schemas.shipping import Shipping, ShippingCreate, ShippingUpdate
from app.models.shipping import ShippingAddress
from uuid import UUID

router = APIRouter(tags=["Shipping"])


@router.post("/", response_model=Shipping)
async def create_shipping(data: ShippingCreate, db: AsyncSession = Depends(get_db)):
    item = ShippingAddress(**data.dict())
    db.add(item)
    await db.commit()
    return item


@router.get("/", response_model=List[Shipping])
async def list_shipping(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(ShippingAddress))
    return result.scalars().all()


@router.put("/{shipping_id}", response_model=Shipping)
async def update_shipping(shipping_id: str, data: ShippingUpdate, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(ShippingAddress).options(noload(ShippingAddress.user)).where(ShippingAddress.id == UUID(shipping_id)))
    item = result.scalar_one_or_none()
    if not item:
        return {"error": "Not found"}

    update_data = data.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(item, field, value)

    await db.commit()
    await db.refresh(item)
    return item


@router.delete("/{shipping_id}")
async def delete_shipping(shipping_id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(ShippingAddress).where(ShippingAddress.id == UUID(shipping_id)))
    item = result.scalar_one_or_none()
    if not item:
        return {"error": "Not found"}
    await db.delete(item)
    await db.commit()
    return {"message": "Deleted"}

@router.get("/user/{user_id}", response_model=Optional[Shipping])
async def get_user_shipping(user_id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(ShippingAddress).options(noload(ShippingAddress.user)).where(ShippingAddress.user_id == UUID(user_id)))
    item = result.scalar_one_or_none()
    return item
