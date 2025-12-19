from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from typing import List
from uuid import UUID

from app.db.session import get_db
from app.models.wishlist import Wishlist, WishlistItem
from app.models.product import Product
from app.schemas.wishlistSchema import (
    WishlistCreate,
    WishlistRead,
    WishlistItemCreate,
    WishlistItemRead,
)

router = APIRouter(prefix="/wishlists", tags=["Wishlists"])


# CREATE OR GET WISHLIST
@router.post("/", response_model=WishlistRead)
async def create_or_update_wishlist(
    wishlist_in: WishlistCreate, 
    db: AsyncSession = Depends(get_db)
):
    # Get existing wishlist
    result = await db.execute(
        select(Wishlist)
        .where(Wishlist.user_id == wishlist_in.user_id)
        .order_by(Wishlist.id.desc())
        .options(
            selectinload(Wishlist.items)
            .selectinload(WishlistItem.product)
            .selectinload(Product.category),
            selectinload(Wishlist.items)
            .selectinload(WishlistItem.product),
        )
    )
    wishlist = result.scalars().first()

    # Create wishlist if it doesn't exist
    if not wishlist:
        wishlist = Wishlist(user_id=wishlist_in.user_id)
        db.add(wishlist)
        await db.flush()

        # re-fetch so .items is async-safe
        result = await db.execute(
            select(Wishlist)
            .where(Wishlist.id == wishlist.id)
            .options(selectinload(Wishlist.items))
        )
        wishlist = result.scalar_one()

    # Add provided items
    for item_in in wishlist_in.items:
        result = await db.execute(select(Product).where(Product.id == item_in.product_id))
        product = result.scalar_one_or_none()
        if not product:
            raise HTTPException(status_code=404, detail=f"Product {item_in.product_id} not found")

        exists = any(wi.product_id == item_in.product_id for wi in wishlist.items)
        if not exists:
            wishlist.items.append(WishlistItem(product_id=item_in.product_id, product=product))

    await db.commit()

    # Return fully loaded response
    result = await db.execute(
        select(Wishlist)
        .where(Wishlist.id == wishlist.id)
        .options(
            selectinload(Wishlist.items)
            .selectinload(WishlistItem.product)
            .selectinload(Product.category),
        )
    )

    return result.scalar_one()



# GET USER WISHLIST
@router.get("/user/{user_id}", response_model=WishlistRead)
async def get_wishlist(user_id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(Wishlist)
        .where(Wishlist.user_id == user_id)
        .options(
            selectinload(Wishlist.items)
            .selectinload(WishlistItem.product)
            .selectinload(Product.category),
        )
    )

    wishlist = result.scalar_one_or_none()

    if not wishlist:
        raise HTTPException(status_code=404, detail="Wishlist not found")

    return wishlist


# ADD ITEM TO WISHLIST
@router.post("/{wishlist_id}/items", response_model=WishlistItemRead)
async def add_wishlist_item(
  wishlist_id: str, item_in: WishlistItemCreate, db: AsyncSession = Depends(get_db)
):
  result = await db.execute(select(Wishlist).where(Wishlist.id == wishlist_id))
  wishlist = result.scalar_one_or_none()
  if not wishlist:
    raise HTTPException(status_code=404, detail="Wishlist not found")

  result = await db.execute(select(Product).where(Product.id == item_in.product_id))
  product = result.scalar_one_or_none()
  if not product:
    raise HTTPException(status_code=404, detail="Product not found")

  # Avoid duplicates
  for existing_item in wishlist.items:
    if existing_item.product_id == item_in.product_id:
      return existing_item

  wishlist_item = WishlistItem(product_id=item_in.product_id, product=product)
  wishlist.items.append(wishlist_item)
  db.add(wishlist)
  await db.commit()
  await db.refresh(wishlist_item)
  return wishlist_item


# REMOVE ITEM FROM WISHLIST
@router.delete("/{wishlist_id}/items/{item_id}", response_model=WishlistRead)
async def remove_wishlist_item(
    wishlist_id: UUID,
    item_id: UUID,
    db: AsyncSession = Depends(get_db),
):
    # 1️⃣ Ensure wishlist exists
    result = await db.execute(
        select(Wishlist)
        .where(Wishlist.id == wishlist_id)
    )
    wishlist = result.scalar_one_or_none()

    if not wishlist:
        raise HTTPException(status_code=404, detail="Wishlist not found")

    # 2️⃣ Ensure item exists in this wishlist
    result = await db.execute(
        select(WishlistItem)
        .where(
            WishlistItem.id == item_id,
            WishlistItem.wishlist_id == wishlist_id,
        )
    )
    wishlist_item = result.scalar_one_or_none()

    if not wishlist_item:
        raise HTTPException(
            status_code=404,
            detail="Item not found in this wishlist",
        )

    # 3️⃣ Delete item
    await db.delete(wishlist_item)
    await db.commit()

    # 4️⃣ IMPORTANT: re-fetch with FULL eager loading
    result = await db.execute(
        select(Wishlist)
        .where(Wishlist.id == wishlist_id)
        .options(
            selectinload(Wishlist.items)
            .selectinload(WishlistItem.product)
            .selectinload(Product.category)
        )
    )

    return result.scalar_one()


# CLEAR WISHLIST
@router.delete("/{wishlist_id}/items")
async def clear_wishlist(wishlist_id: str, db: AsyncSession = Depends(get_db)):
  result = await db.execute(select(Wishlist).where(Wishlist.id == wishlist_id).options(selectinload(Wishlist.items)))
  wishlist = result.scalar_one_or_none()
  if not wishlist:
    raise HTTPException(status_code=404, detail="Wishlist not found")

  # Delete all items
  for item in wishlist.items:
      await db.delete(item)
  await db.commit()
  return {"detail": "Wishlist cleared successfully"}
