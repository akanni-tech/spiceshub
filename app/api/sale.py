from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from typing import List
from datetime import datetime

from app.db.session import get_db
from app.models.sale import Sale, SaleProduct
from app.models.product import Product
from app.schemas.saleSchema import SaleRead, SaleCreate, SaleUpdate, SaleProductRead

router = APIRouter(prefix="/sales", tags=["Sales"])


# CREATE SALE
@router.post("/", response_model=SaleRead)
async def create_sale(sale_in: SaleCreate, db: AsyncSession = Depends(get_db)):
    sale = Sale(
        name=sale_in.name,
        description=sale_in.description,
        discount_percentage=sale_in.discount_percentage,
        start_date=sale_in.start_date,
        end_date=sale_in.end_date,
        is_active=sale_in.is_active,
        banner_image=sale_in.banner_image,
        banner_text=sale_in.banner_text
    )

    # Add sale products
    for product_in in sale_in.products:
        # Verify product exists
        result = await db.execute(select(Product).where(Product.id == product_in.product_id))
        product = result.scalar_one_or_none()
        if not product:
            raise HTTPException(status_code=404, detail=f"Product {product_in.product_id} not found")

        sale_product = SaleProduct(
            product_id=product_in.product_id,
            discounted_price=product_in.discounted_price
        )
        sale.products.append(sale_product)

    db.add(sale)
    await db.commit()
    await db.refresh(sale)

    # Reload with products and categories
    result = await db.execute(
        select(Sale).where(Sale.id == sale.id).options(
            selectinload(Sale.products).selectinload(SaleProduct.product).selectinload(Product.category)
        )
    )
    sale = result.scalar_one()

    # Build response dict
    response_sale = {
        "id": sale.id,
        "name": sale.name,
        "description": sale.description,
        "discount_percentage": sale.discount_percentage,
        "start_date": sale.start_date,
        "end_date": sale.end_date,
        "is_active": sale.is_active,
        "banner_image": sale.banner_image,
        "banner_text": sale.banner_text,
        "created_at": sale.created_at,
        "updated_at": sale.updated_at,
        "products": [
            {
                "id": sp.id,
                "product_id": sp.product_id,
                "discounted_price": sp.discounted_price,
                "product": {
                    "id": sp.product.id,
                    "name": sp.product.name,
                    "price": sp.product.price,
                    "main_image": sp.product.main_image,
                    "category": {
                        "id": sp.product.category.id,
                        "name": sp.product.category.name
                    } if sp.product.category else None
                } if sp.product else None
            } for sp in sale.products
        ]
    }

    return response_sale


# GET ALL SALES
@router.get("/", response_model=List[SaleRead])
async def list_sales(db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(Sale).options(selectinload(Sale.products).selectinload(SaleProduct.product).selectinload(Product.category))
        .order_by(Sale.created_at.desc())
    )
    sales = result.scalars().all()

    # Build response dicts
    response_sales = []
    for sale in sales:
        response_sale = {
            "id": sale.id,
            "name": sale.name,
            "description": sale.description,
            "discount_percentage": sale.discount_percentage,
            "start_date": sale.start_date,
            "end_date": sale.end_date,
            "is_active": sale.is_active,
            "banner_image": sale.banner_image,
            "banner_text": sale.banner_text,
            "created_at": sale.created_at,
            "updated_at": sale.updated_at,
            "products": [
                {
                    "id": sp.id,
                    "product_id": sp.product_id,
                    "discounted_price": sp.discounted_price,
                    "product": {
                        "id": sp.product.id,
                        "name": sp.product.name,
                        "price": sp.product.price,
                        "main_image": sp.product.main_image,
                        "category": {
                            "id": sp.product.category.id,
                            "name": sp.product.category.name
                        } if sp.product.category else None
                    } if sp.product else None
                } for sp in sale.products
            ]
        }
        response_sales.append(response_sale)

    return response_sales


# GET ACTIVE SALE
@router.get("/active", response_model=SaleRead)
async def get_active_sale(db: AsyncSession = Depends(get_db)):
    now = datetime.utcnow()
    result = await db.execute(
        select(Sale).where(
            Sale.is_active == True,
            Sale.end_date > now
        ).options(
            selectinload(Sale.products).selectinload(SaleProduct.product).selectinload(Product.category)
        )
    )
    sale = result.scalar_one_or_none()
    if not sale:
        raise HTTPException(status_code=404, detail="No active sale found")

    # Build response dict
    response_sale = {
        "id": sale.id,
        "name": sale.name,
        "description": sale.description,
        "discount_percentage": sale.discount_percentage,
        "start_date": sale.start_date,
        "end_date": sale.end_date,
        "is_active": sale.is_active,
        "banner_image": sale.banner_image,
        "banner_text": sale.banner_text,
        "created_at": sale.created_at,
        "updated_at": sale.updated_at,
        "products": [
            {
                "id": sp.id,
                "product_id": sp.product_id,
                "discounted_price": sp.discounted_price,
                "product": {
                    "id": sp.product.id,
                    "name": sp.product.name,
                    "price": sp.product.price,
                    "main_image": sp.product.main_image,
                    "category": {
                        "id": sp.product.category.id,
                        "name": sp.product.category.name
                    } if sp.product.category else None
                } if sp.product else None
            } for sp in sale.products
        ]
    }

    return response_sale


# GET SINGLE SALE
@router.get("/{sale_id}", response_model=SaleRead)
async def get_sale(sale_id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(Sale).where(Sale.id == sale_id).options(selectinload(Sale.products).selectinload(SaleProduct.product).selectinload(Product.category))
    )
    sale = result.scalar_one_or_none()
    if not sale:
        raise HTTPException(status_code=404, detail="Sale not found")

    # Build response dict
    response_sale = {
        "id": sale.id,
        "name": sale.name,
        "description": sale.description,
        "discount_percentage": sale.discount_percentage,
        "start_date": sale.start_date,
        "end_date": sale.end_date,
        "is_active": sale.is_active,
        "banner_image": sale.banner_image,
        "banner_text": sale.banner_text,
        "created_at": sale.created_at,
        "updated_at": sale.updated_at,
        "products": [
            {
                "id": sp.id,
                "product_id": sp.product_id,
                "discounted_price": sp.discounted_price,
                "product": {
                    "id": sp.product.id,
                    "name": sp.product.name,
                    "price": sp.product.price,
                    "main_image": sp.product.main_image,
                    "category": {
                        "id": sp.product.category.id,
                        "name": sp.product.category.name
                    } if sp.product.category else None
                } if sp.product else None
            } for sp in sale.products
        ]
    }

    return response_sale


# UPDATE SALE
@router.put("/{sale_id}", response_model=SaleRead)
async def update_sale(sale_id: str, sale_in: SaleUpdate, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Sale).where(Sale.id == sale_id))
    sale = result.scalar_one_or_none()
    if not sale:
        raise HTTPException(status_code=404, detail="Sale not found")

    update_data = sale_in.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(sale, field, value)

    db.add(sale)
    await db.commit()
    await db.refresh(sale)

    # Reload with products
    result = await db.execute(
        select(Sale).where(Sale.id == sale.id).options(selectinload(Sale.products).selectinload(SaleProduct.product).selectinload(Product.category))
    )
    sale = result.scalar_one()

    # Build response dict
    response_sale = {
        "id": sale.id,
        "name": sale.name,
        "description": sale.description,
        "discount_percentage": sale.discount_percentage,
        "start_date": sale.start_date,
        "end_date": sale.end_date,
        "is_active": sale.is_active,
        "banner_image": sale.banner_image,
        "banner_text": sale.banner_text,
        "created_at": sale.created_at,
        "updated_at": sale.updated_at,
        "products": [
            {
                "id": sp.id,
                "product_id": sp.product_id,
                "discounted_price": sp.discounted_price,
                "product": {
                    "id": sp.product.id,
                    "name": sp.product.name,
                    "price": sp.product.price,
                    "main_image": sp.product.main_image,
                    "category": {
                        "id": sp.product.category.id,
                        "name": sp.product.category.name
                    } if sp.product.category else None
                } if sp.product else None
            } for sp in sale.products
        ]
    }

    return response_sale


# DELETE SALE
@router.delete("/{sale_id}")
async def delete_sale(sale_id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Sale).where(Sale.id == sale_id).options(selectinload(Sale.products)))
    sale = result.scalar_one_or_none()
    if not sale:
        raise HTTPException(status_code=404, detail="Sale not found")

    await db.delete(sale)
    await db.commit()
    return {"detail": "Sale deleted successfully"}