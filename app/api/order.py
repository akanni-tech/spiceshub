from fastapi import APIRouter, HTTPException, Depends, Response
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload, joinedload
from app.schemas.orderSchema import OrderRead, OrderUpdate
from typing import List

from app.db.session import get_db
from app.models.order import Order, OrderItem
from app.models.product import Product
from app.models.user import User
from app.schemas.orderSchema import OrderCreate, OrderRead, OrderItemCreate, OrderItemRead

router = APIRouter(prefix="/orders", tags=["Orders"])


# CREATE ORDER
@router.post("/", response_model=OrderRead)
async def create_order(order_in: OrderCreate, db: AsyncSession = Depends(get_db)):
  # Check user exists
  result = await db.execute(select(User).where(User.id == order_in.user_id))
  user = result.scalar_one_or_none()
  if not user:
    raise HTTPException(status_code=404, detail=f"User {order_in.user_id} not found")

  order = Order(
    user_id=order_in.user_id,
    status=order_in.status,
    total_amount=order_in.total_amount,
    shipping_method=order_in.shipping_method,
    city=order_in.city,
    area=order_in.area,
    internal_notes = order_in.internal_notes,
    address=order_in.address,
    phoneNumber=order_in.phoneNumber,
    apartment=order_in.apartment,
    payOnDelivery=order_in.payOnDelivery,
    mpesaCode=order_in.mpesaCode,
    additionalNote=order_in.additionalNote
  )

  # Add order items
  for item_in in order_in.items:
    result = await db.execute(select(Product).where(Product.id == item_in.product_id))
    product = result.scalar_one_or_none()
    if not product:
      raise HTTPException(status_code=404, detail=f"Product {item_in.product_id} not found")

    order_item = OrderItem(
      product_id=item_in.product_id,
      container=item_in.container,
      name= item_in.name,
      image = item_in.image,
      quantity=item_in.quantity,
      price=item_in.price,
      product=product
    )
    order.items.append(order_item)

  db.add(order)
  await db.commit()
  await db.refresh(order)

  # Reload order with items
  result = await db.execute(
    select(Order).where(Order.id == order.id).options(selectinload(Order.items).selectinload(OrderItem.product))
  )
  order = result.scalar_one()
  return order


# GET ALL ORDERS
@router.get("/", response_model=List[OrderRead])
async def list_orders(db: AsyncSession = Depends(get_db)):
  result = await db.execute(
    select(Order).options(selectinload(Order.items).selectinload(OrderItem.product))
  )
  orders = result.scalars().all()
  return orders


# GET SINGLE ORDER
@router.get("/{order_id}", response_model=OrderRead)
async def get_order(order_id: str, db: AsyncSession = Depends(get_db)):
  result = await db.execute(
    select(Order)
    .where(Order.id == order_id)
    .options(selectinload(Order.items).selectinload(OrderItem.product))
  )
  order = result.scalar_one_or_none()
  if not order:
    raise HTTPException(status_code=404, detail="Order not found")
  return order


# GET ORDERS BY USER ID
@router.get("/user/{user_id}", response_model=List[OrderRead])
async def get_orders_by_user(user_id: str, db: AsyncSession = Depends(get_db)):
  result = await db.execute(
    select(Order)
    .where(Order.user_id == user_id)
    .options(selectinload(Order.items).selectinload(OrderItem.product))
    .order_by(Order.created_at.desc())
  )
  orders = result.scalars().all()
  return orders


# UPDATE ORDER STATUS AND PAYMENT
@router.put("/{order_id}", response_model=OrderRead)
async def update_order(order_id: str, order_in: OrderUpdate, db: AsyncSession = Depends(get_db)):
  result = await db.execute(
    select(Order).where(Order.id == order_id)
  )
  order = result.scalar_one_or_none()
  if not order:
    raise HTTPException(status_code=404, detail="Order not found")

  update_data = order_in.dict(exclude_unset=True)
  for field, value in update_data.items():
    setattr(order, field, value)

  db.add(order)
  await db.commit()
  await db.refresh(order)

  # Reload with items
  result = await db.execute(
    select(Order).where(Order.id == order.id).options(selectinload(Order.items).selectinload(OrderItem.product))
  )
  return result.scalar_one()


# UPDATE ORDER ITEM (e.g., quantity, size, color)
@router.put("/items/{item_id}", response_model=OrderItemRead)
async def update_order_item(item_id: str, item_in: OrderItemCreate, db: AsyncSession = Depends(get_db)):
  result = await db.execute(
    select(OrderItem).where(OrderItem.id == item_id).options(selectinload(OrderItem.product))
  )
  order_item = result.scalar_one_or_none()
  if not order_item:
    raise HTTPException(status_code=404, detail="Order item not found")

  order_item.quantity = item_in.quantity
  order_item.container = item_in.container
  order_item.price = item_in.price

  db.add(order_item)
  await db.commit()
  await db.refresh(order_item)
  return order_item


# DELETE ORDER ITEM
@router.delete("/items/{item_id}")
async def delete_order_item(item_id: str, db: AsyncSession = Depends(get_db)):
  result = await db.execute(select(OrderItem).where(OrderItem.id == item_id))
  order_item = result.scalar_one_or_none()
  if not order_item:
    raise HTTPException(status_code=404, detail="Order item not found")

  await db.delete(order_item)
  await db.commit()
  return {"detail": "Order item deleted successfully"}


# DELETE ORDER
@router.delete("/{order_id}")
async def delete_order(order_id: str, db: AsyncSession = Depends(get_db)):
  result = await db.execute(select(Order).where(Order.id == order_id).options(selectinload(Order.items)))
  order = result.scalar_one_or_none()
  if not order:
    raise HTTPException(status_code=404, detail="Order not found")

  await db.delete(order)
  await db.commit()
  return {"detail": "Order deleted successfully"}


from app.models.order import Order, OrderItem
from app.models.product import Product

@router.get("/items/topProducts")
async def get_top_products_data(db: AsyncSession = Depends(get_db)):
  # Fetch orders and items, joined with products
  result = await db.execute(
      select(Order)
      .options(joinedload(Order.items).joinedload(OrderItem.product))
  )
  orders = result.unique().scalars().all()

  product_stats = {}

  for order in orders:
      for item in order.items:
          product = item.product
          if not product:
              continue

          name = product.name
          price = product.price
          quantity = item.quantity
          revenue = quantity * price

          if name not in product_stats:
              product_stats[name] = {
                  "name": name,
                  "price": price,
                  "sales": 0,
                  "revenue": 0,
              }

          product_stats[name]["sales"] += quantity
          product_stats[name]["revenue"] += revenue

  # Sort by total sales or revenue
  top_products = sorted(
      product_stats.values(),
      key=lambda x: x["revenue"],  # or x["sales"]
      reverse=True,
  )[:5]

  return top_products



CATEGORY_COLORS = [
    "#99582A", "#B5764A", "#D19B6A", "#E8C18C", "#FFE6A7"
]

@router.get("/items/categorySales")
async def get_category_sales(db: AsyncSession = Depends(get_db)):
    # Fetch orders and items with product and category info
    result = await db.execute(
        select(Order)
        .options(
            joinedload(Order.items)
            .joinedload(OrderItem.product)
            .joinedload(Product.category)
        )
    )
    orders = result.unique().scalars().all() 

    category_stats = {}

    for order in orders:
        for item in order.items:
            product = item.product
            if not product or not product.category:
                continue

            category_name = product.category.name
            quantity = item.quantity
            revenue = quantity * item.price

            if category_name not in category_stats:
                category_stats[category_name] = {
                    "name": category_name,
                    "value": 0,  # will store total sales count
                    "revenue": 0.0,
                }

            category_stats[category_name]["value"] += quantity
            category_stats[category_name]["revenue"] += revenue

    # Convert dict to list and assign colors dynamically
    category_list = []
    for i, cat in enumerate(category_stats.values()):
        cat["color"] = CATEGORY_COLORS[i % len(CATEGORY_COLORS)]
        category_list.append(cat)

    # Sort by most sold
    category_list.sort(key=lambda x: x["value"], reverse=True)

    return category_list


# GENERATE INVOICE
@router.get("/{order_id}/invoice")
async def generate_invoice(order_id: str, db: AsyncSession = Depends(get_db)):
    # Get order with items
    result = await db.execute(
        select(Order).where(Order.id == order_id).options(selectinload(Order.items).selectinload(OrderItem.product))
    )
    order = result.scalar_one_or_none()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    # Create invoice text content
    shipping_cost = 500 if order.shipping_method == 'express' else 0
    subtotal = sum(item.quantity * item.price / 100 for item in order.items)
    total = subtotal + shipping_cost

    invoice_content = f"""
SPICE HUB - INVOICE
{'='*50}

Order ID: {order.id}
Date: {order.created_at.strftime("%Y-%m-%d %H:%M:%S")}
Status: {order.status.title()}

SHIPPING ADDRESS:
City: {order.city}
Area: {order.area}
Address: {order.address or 'N/A'}
Phone: {order.phoneNumber}

ORDER ITEMS:
{'-'*50}
"""

    for item in order.items:
        quantity = item.quantity / 100  # Convert from stored format
        unit_price = item.price
        item_total = quantity * unit_price
        invoice_content += f"{item.name}\n"
        invoice_content += f"  Quantity: {quantity} x Ksh {unit_price:.2f} = Ksh {item_total:.2f}\n\n"

    invoice_content += f"""
{'-'*50}
Subtotal: Ksh {subtotal:.2f}
Shipping: Ksh {shipping_cost:.2f}
TOTAL: Ksh {total:.2f}

Payment Method: {'Pay on Delivery' if order.payOnDelivery else 'M-Pesa'}
"""

    if order.mpesaCode:
        invoice_content += f"M-Pesa Code: {order.mpesaCode}\n"

    invoice_content += "\nThank you for shopping with Spice Hub!\n"

    return Response(
        content=invoice_content.strip(),
        media_type="text/plain",
        headers={"Content-Disposition": f"attachment; filename=invoice-{order.id}.txt"}
    )