import json
import redis.asyncio as redis
from fastapi import HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.repositories.product_repository import product_repository
from app.schemas.cartSchema import ProductSummary, CategoryRead
from sqlalchemy.future import select
from app.models.wishlist import Wishlist, WishlistItem
from app.models.product import Product
from app.core.config import settings

async def get_redis():
    global redis_client
    if redis_client is None:
        redis_client = redis.from_url(
            settings.REDIS_URL,
            encoding="utf-8",
            decode_responses=True
        )
    return redis_client


# GET WISHLIST
async def get_wishlist(db: AsyncSession, session_id: str):
    r = await get_redis()
    data = await r.get(f"guest_wishlist:{session_id}")

    if not data:
        return {"session_id": session_id, "items": []}

    wishlist = json.loads(data)

    items_output = []
    for item in wishlist["items"]:
        product = await product_repository.get_product_by_id(db, item["product_id"])

        product_summary = ProductSummary(
            id=product.id,
            name=product.name,
            price=product.price,
            main_image=product.main_image,
            category=CategoryRead(
                id=product.category.id,
                name=product.category.name
            ) if product.category else None,
            rating=product.rating,
            reviewCount=product.reviewCount,
            isSale=product.isSale,
            isNew=product.isNew,
        )

        items_output.append({
            "product_id": product.id,
            "product": product_summary
        })

    return {
        "session_id": session_id,
        "items": items_output
    }


# SAVE WISHLIST
async def save_wishlist(session_id: str, wishlist: dict):
    r = await get_redis()
    await r.set(f"guest_wishlist:{session_id}", json.dumps(wishlist, default=str))


# ADD ITEM
async def add_item_to_wishlist(db: AsyncSession, session_id: str, product_id: int):
    r = await get_redis()
    raw = await r.get(f"guest_wishlist:{session_id}")

    if raw:
        wishlist = json.loads(raw)
    else:
        wishlist = {"session_id": session_id, "items": []}

    # Avoid duplicates
    if any(i["product_id"] == product_id for i in wishlist["items"]):
        return await get_wishlist(db, session_id)

    wishlist["items"].append({"product_id": product_id})
    await save_wishlist(session_id, wishlist)
    return await get_wishlist(db, session_id)


# REMOVE ITEM
async def remove_item_from_wishlist(db: AsyncSession, session_id: str, product_id: int):
    r = await get_redis()
    raw = await r.get(f"guest_wishlist:{session_id}")

    if not raw:
        raise HTTPException(status_code=404, detail="Wishlist not found")

    wishlist = json.loads(raw)
    wishlist["items"] = [i for i in wishlist["items"] if i["product_id"] != product_id]

    await save_wishlist(session_id, wishlist)
    return await get_wishlist(db, session_id)


# CLEAR WISHLIST
async def clear_wishlist(session_id: str):
    r = await get_redis()
    await r.delete(f"guest_wishlist:{session_id}")



async def merge_guest_wishlist_into_user(db: AsyncSession, session_id: str, user_id: int):
    # Step 1: Fetch guest wishlist
    guest = await get_wishlist(db, session_id)
    guest_items = guest.get("items", [])

    # If guest wishlist is empty, nothing to merge
    if not guest_items:
        return

    # Step 2: Load user's wishlist (create if missing)
    

    result = await db.execute(select(Wishlist).where(Wishlist.user_id == user_id))
    wishlist = result.scalars().first()

    if not wishlist:
        wishlist = Wishlist(user_id=user_id)
        db.add(wishlist)
        await db.flush()

    # Step 3: Merge — avoid duplicates
    existing_product_ids = {item.product_id for item in wishlist.items}

    for item in guest_items:
        product_id = item["product_id"]
        if product_id not in existing_product_ids:
            wishlist.items.append(WishlistItem(product_id=product_id))

    # Save changes
    await db.commit()

    # Step 4: Clear guest wishlist
    await clear_wishlist(session_id)

    return wishlist