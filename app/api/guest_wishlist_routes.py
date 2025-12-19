from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.session import get_db
from app.services.guest_wishlist_service import (
    get_wishlist,
    add_item_to_wishlist,
    remove_item_from_wishlist,
    clear_wishlist,
)

router = APIRouter(prefix="/guest-wishlist", tags=["Guest Wishlist"])


@router.get("/{session_id}")
async def read_guest_wishlist(session_id: str, db: AsyncSession = Depends(get_db)):
    return await get_wishlist(db, session_id)


@router.post("/{session_id}/add/{product_id}")
async def add_to_guest_wishlist(session_id: str, product_id: int, db: AsyncSession = Depends(get_db)):
    return await add_item_to_wishlist(db, session_id, product_id)


@router.delete("/{session_id}/items/{product_id}")
async def remove_from_guest_wishlist(session_id: str, product_id: int, db: AsyncSession = Depends(get_db)):
    return await remove_item_from_wishlist(db, session_id, product_id)


@router.delete("/{session_id}/clear")
async def clear_guest_wishlist_route(session_id: str):
    await clear_wishlist(session_id)
    return {"detail": "Wishlist cleared successfully"}


@router.post("/merge/{session_id}/{user_id}")
async def merge_guest_wishlist(session_id: str, user_id: int, db: AsyncSession = Depends(get_db)):
    from app.services.guest_wishlist_service import merge_guest_wishlist_into_user
    return await merge_guest_wishlist_into_user(db, session_id, user_id)
