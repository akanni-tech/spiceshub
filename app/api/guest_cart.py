# app/api/guest_cart.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.session import get_db
from pydantic import BaseModel
from typing import List
import json

from app.schemas.cartSchema import CartItemBase, GuestCartRead, GuestUpdateQuantity
from app.services.guest_cart import (
    get_redis, get_raw_cart, save_raw_cart, get_cart, remove_item_from_cart
)
from app.repositories.product_repository import product_repository

router = APIRouter(prefix="/guest-cart", tags=["Guest Cart"])


class GuestCartAddRequest(BaseModel):
    session_id: str
    items: List[CartItemBase]


@router.post("/guest/add", response_model=GuestCartRead)
async def guest_add_to_cart(data: GuestCartAddRequest, db: AsyncSession = Depends(get_db)):
    # Use compact raw cart for manipulation, then save, then return enriched
    raw = await get_raw_cart(data.session_id)

    # Make item lookup easier (composite key)
    item_map = {(i["product_id"], i.get("size"), i.get("color")): i for i in raw.get("items", [])}

    for it in data.items:
        key = (it.product_id, it.size, it.color)
        if key in item_map:
            item_map[key]["quantity"] = item_map[key].get("quantity", 0) + it.quantity
        else:
            # We only store minimal snapshot in Redis
            # No heavy fields — enrichment is done on GET/get_cart
            item_map[key] = {
                "product_id": it.product_id,
                "size": it.size,
                "color": it.color,
                "quantity": it.quantity
            }

    new_raw = {"items": list(item_map.values())}
    await save_raw_cart(data.session_id, new_raw)

    # Return enriched cart
    return await get_cart(db, data.session_id)


@router.get("/{session_id}", response_model=GuestCartRead)
async def get_guest_cart(session_id: str, db: AsyncSession = Depends(get_db)):
    # Always return enriched cart (matches response model)
    return await get_cart(db, session_id)


@router.patch("/quantity", response_model=GuestCartRead)
async def update_guest_quantity(payload: GuestUpdateQuantity, db: AsyncSession = Depends(get_db)):
    session_id = payload.session_id
    if payload.quantity < 1:
        raise HTTPException(status_code=400, detail="Quantity must be ≥ 1")

    raw = await get_raw_cart(session_id)
    updated = False
    for item in raw.get("items", []):
        if (
            item.get("product_id") == payload.product_id
            and item.get("size") == payload.size
            and item.get("color") == payload.color
        ):
            item["quantity"] = payload.quantity
            updated = True
            break

    if not updated:
        raise HTTPException(status_code=404, detail="Product not in cart")

    await save_raw_cart(session_id, raw)
    return await get_cart(db, session_id)


@router.delete("/{session_id}/items/{product_id}", response_model=GuestCartRead)
async def guest_remove_item(session_id: str, product_id: int, db: AsyncSession = Depends(get_db)):
    return await remove_item_from_cart(db, session_id, product_id)
