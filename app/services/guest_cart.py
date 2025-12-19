# app/services/guest_cart.py
import json
import redis.asyncio as redis
from fastapi import HTTPException
from app.schemas.cartSchema import ProductSummary, CategoryRead
from sqlalchemy.ext.asyncio import AsyncSession
from app.repositories.product_repository import product_repository
from app.core.config import settings

redis_client = None
REDIS_PREFIX = "guest_cart:"


async def get_redis():
    global redis_client
    if redis_client is None:
        redis_client = redis.from_url(
            settings.REDIS_URL,
            encoding="utf-8",
            decode_responses=True
        )
    return redis_client


# --- Raw cart utilities (compact) ---

async def get_raw_cart(session_id: str) -> dict:
    """
    Return the raw compact cart stored in Redis (no product enrichment).
    Always returns {'items': [...]}
    """
    r = await get_redis()
    data = await r.get(f"{REDIS_PREFIX}{session_id}")
    if not data:
        return {"items": []}
    try:
        return json.loads(data)
    except Exception:
        # If corrupted, return empty
        return {"items": []}


async def save_raw_cart(session_id: str, cart: dict):
    """
    Normalize and save only the compact form to Redis.
    """
    r = await get_redis()
    normalized = {"items": cart.get("items", [])}
    await r.set(f"{REDIS_PREFIX}{session_id}", json.dumps(normalized, default=str))


async def clear_cart(session_id: str):
    r = await get_redis()
    await r.delete(f"{REDIS_PREFIX}{session_id}")


# --- Enriched cart returned to clients ---

async def get_cart(db: AsyncSession, session_id: str):
    """
    Return enriched cart for responses: each item includes a 'product' summary.
    If product is deleted / not found, that item will be skipped.
    """
    raw = await get_raw_cart(session_id)
    items_output = []

    # Create a small cache to avoid hitting DB multiple times per product
    product_cache = {}

    for item in raw.get("items", []):
        pid = item.get("product_id")
        if pid is None:
            continue

        # reuse cached product if present
        product = product_cache.get(pid)
        if product is None:
            product = await product_repository.get_product_by_id(db, pid)
            product_cache[pid] = product

        if not product:
            # skip stale product references
            continue

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
            size=item.get("size"),
            color=item.get("color"),
        )

        items_output.append({
            "product_id": product.id,
            "size": item.get("size"),
            "color": item.get("color"),
            "quantity": item.get("quantity", 1),
            "product": product_summary
        })

    return {
        "session_id": session_id,
        "items": items_output
    }


# --- Helpers used by routes (remove item etc.) ---

async def remove_item_from_cart_raw(session_id: str, product_id: int):
    """
    Remove any item(s) with product_id from the raw cart.
    Returns the new raw cart.
    """
    cart = await get_raw_cart(session_id)
    cart["items"] = [i for i in cart.get("items", []) if i.get("product_id") != product_id]
    await save_raw_cart(session_id, cart)
    return cart


# If you still want the function signature that uses DB (as earlier), keep compatibility
async def remove_item_from_cart(db: AsyncSession, session_id: str, product_id: int):
    raw = await get_raw_cart(session_id)
    if not raw or not raw.get("items"):
        raise HTTPException(status_code=404, detail="Cart not found")
    raw["items"] = [i for i in raw["items"] if i.get("product_id") != product_id]
    await save_raw_cart(session_id, raw)
    # return enriched
    return await get_cart(db, session_id)
