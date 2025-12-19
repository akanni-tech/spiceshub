from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from typing import List

from app.db.session import get_db
from app.models.cart import Cart, CartItem
from app.models.product import Product
from app.schemas.cartSchema import CartCreate, CartRead, CartItemCreate, CartItemRead

router = APIRouter(prefix="/carts", tags=["Carts"])

# CREATE OR GET CART
@router.post("/", response_model=CartRead)
async def add_to_cart(cart_in: CartCreate, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(Cart)
        .where(Cart.user_id == cart_in.user_id)
        .order_by(Cart.id.desc())
        .options(selectinload(Cart.items))
    )
    cart = result.scalars().first()

    if not cart:
        cart = Cart(user_id=cart_in.user_id)
        db.add(cart)
        await db.flush()
        await db.refresh(cart, attribute_names=["items"])  # ✅ preload items

    for item_in in cart_in.items:
        result = await db.execute(select(Product).where(Product.id == item_in.product_id))
        product = result.scalar_one_or_none()
        if not product:
            raise HTTPException(status_code=404, detail=f"Product {item_in.product_id} not found")

        # Async-safe check for existing item
        result = await db.execute(
            select(CartItem)
            .where(
                CartItem.cart_id == cart.id,
                CartItem.product_id == item_in.product_id,
                CartItem.container == item_in.container,
            )
        )
        existing_item = result.scalar_one_or_none()

        if existing_item:
            existing_item.quantity += item_in.quantity
        else:
            cart_item = CartItem(
                product_id=item_in.product_id,
                quantity=item_in.quantity,
                container=item_in.container,
            )
            cart.items.append(cart_item)

    await db.commit()

    result = await db.execute(
        select(Cart)
        .where(Cart.id == cart.id)
        .options(
            selectinload(Cart.items)
            .selectinload(CartItem.product)
            .selectinload(Product.category),
        )
    )

    return result.scalar_one()




# GET USER CART
@router.get("/user/{user_id}", response_model=CartRead)
async def get_cart(user_id: str, db: AsyncSession = Depends(get_db)):
  result = await db.execute(
    select(Cart)
    .where(Cart.user_id == user_id)
    .order_by(Cart.id.desc())
    .options(
      selectinload(Cart.items)
      .selectinload(CartItem.product)
      .selectinload(Product.category),
    )
    )
  cart = result.scalars().first()
  if not cart:
    raise HTTPException(status_code=404, detail="Cart not found")
  return cart


# ADD ITEM TO CART
@router.post("/{cart_id}/items", response_model=CartItemRead)
async def add_cart_item(cart_id: str, item_in: CartItemCreate, db: AsyncSession = Depends(get_db)):
  result = await db.execute(select(Cart).where(Cart.id == cart_id))
  cart = result.scalar_one_or_none()
  if not cart:
    raise HTTPException(status_code=404, detail="Cart not found")
  
  # Fetch product
  result = await db.execute(select(Product).where(Product.id == item_in.product_id))
  product = result.scalar_one_or_none()
  if not product:
    raise HTTPException(status_code=404, detail="Product not found")

  # Check if item already exists in cart
  for existing_item in cart.items:
    if (
      existing_item.product_id == item_in.product_id
      and existing_item.container == item_in.container
    ):
      existing_item.quantity += item_in.quantity
      db.add(existing_item)
      await db.commit()
      await db.refresh(existing_item)
      return existing_item


  # Add new item
  cart_item = CartItem(
    product_id=item_in.product_id,
    quantity=item_in.quantity,     
    container=item_in.container,
    product=product
  )
  cart.items.append(cart_item)
  db.add(cart)
  await db.commit()
  await db.refresh(cart_item)
  return cart_item


# UPDATE CART ITEM
@router.put("/items/{item_id}", response_model=CartItemRead)
async def update_cart_item(item_id: str, item_in: CartItemCreate, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(CartItem)
        .where(CartItem.id == item_id)
        .options(
            selectinload(CartItem.product)
            .selectinload(Product.category),
        )
    )
    cart_item = result.scalar_one_or_none()
    if not cart_item:
        raise HTTPException(status_code=404, detail="Cart item not found")

    cart_item.quantity = item_in.quantity
    cart_item.container = item_in.container

    db.add(cart_item)
    await db.commit()
    await db.refresh(cart_item)

    # Re-fetch with relationships eagerly loaded (important!)
    result = await db.execute(
        select(CartItem)
        .where(CartItem.id == item_id)
        .options(
            selectinload(CartItem.product)
            .selectinload(Product.category),
            selectinload(CartItem.product)
        )
    )
    return result.scalar_one()

# DELETE CART ITEM
@router.delete("/{cart_id}/items/{item_id}")
async def delete_cart_item(cart_id: str, item_id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(CartItem)
        .where(CartItem.id == item_id, CartItem.cart_id == cart_id)
    )
    cart_item = result.scalar_one_or_none()

    if not cart_item:
        raise HTTPException(status_code=404, detail="Cart item not found in this cart")

    await db.delete(cart_item)
    await db.commit()

    return {"detail": "Cart item deleted successfully"}


# CLEAR CART
@router.delete("/{cart_id}/items")
async def clear_cart(cart_id: str, db: AsyncSession = Depends(get_db)):
  result = await db.execute(select(Cart).where(Cart.id == cart_id).options(selectinload(Cart.items)))
  cart = result.scalar_one_or_none()
  if not cart:
    raise HTTPException(status_code=404, detail="Cart not found")
  
  for item in cart.items:
    await db.delete(item)
  await db.commit()
  return {"detail": "Cart cleared successfully"}
