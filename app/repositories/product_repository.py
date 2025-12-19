from sqlalchemy import select
from sqlalchemy.orm import selectinload
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.product import Product

class ProductRepository:
    async def get_product_by_id(self, db: AsyncSession, product_id: int):
        stmt = (
            select(Product)
            .where(Product.id == product_id)
            .options(
                selectinload(Product.category),
                selectinload(Product.images),
            )
        )
        result = await db.execute(stmt)
        return result.scalar_one_or_none()

product_repository = ProductRepository()
