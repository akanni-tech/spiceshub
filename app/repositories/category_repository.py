from sqlalchemy.future import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload
from app.models.product import Category

class CategoryRepository:

    async def get_all(self, db: AsyncSession):
        result = await db.execute(select(Category))
        return result.scalars().all()

    async def get_with_products(self, db: AsyncSession, category_id: int):
        result = await db.execute(
            select(Category)
            .where(Category.id == category_id)
            .options(
                selectinload(Category.products)
                .selectinload("images"),   # If you have image relationship
                selectinload(Category.products)
                .selectinload("category")
            )
        )
        return result.scalar_one_or_none()

category_repository = CategoryRepository()
