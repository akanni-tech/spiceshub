from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from typing import List

from app.db.session import get_db
from app.models.review import Review
from app.models.product import Product
from app.models.user import User
from app.schemas.reviewSchema import ReviewCreate, ReviewRead

router = APIRouter(prefix="/reviews", tags=["Reviews"])


# CREATE REVIEW
@router.post("/", response_model=ReviewRead)
async def create_review(review_in: ReviewCreate, db: AsyncSession = Depends(get_db)):
  # Check product exists
  result = await db.execute(select(Product).where(Product.id == review_in.product_id))
  product = result.scalar_one_or_none()
  if not product:
    raise HTTPException(status_code=404, detail=f"Product {review_in.product_id} not found")

  # Check user exists
  result = await db.execute(select(User).where(User.id == review_in.user_id))
  user = result.scalar_one_or_none()
  if not user:
    raise HTTPException(status_code=404, detail=f"User {review_in.user_id} not found")

  review = Review(
    product_id=review_in.product_id,
    user_id=review_in.user_id,
    rating=review_in.rating,
    comment=review_in.comment,
    product=product,
    user=user
  )

  db.add(review)
  await db.commit()
  await db.refresh(review)
  return review


# GET ALL REVIEWS
@router.get("/", response_model=List[ReviewRead])
async def list_reviews(db: AsyncSession = Depends(get_db)):
  result = await db.execute(
    select(Review)
    .options(selectinload(Review.user), selectinload(Review.product))
  )
  reviews = result.scalars().all()
  return reviews


# GET SINGLE REVIEW
@router.get("/{review_id}", response_model=ReviewRead)
async def get_review(review_id: str, db: AsyncSession = Depends(get_db)):
  result = await db.execute(
    select(Review)
    .where(Review.id == review_id)
    .options(selectinload(Review.user), selectinload(Review.product))
  )
  review = result.scalar_one_or_none()
  if not review:
    raise HTTPException(status_code=404, detail="Review not found")
  return review


# UPDATE REVIEW
@router.put("/{review_id}", response_model=ReviewRead)
async def update_review(review_id: str, review_in: ReviewCreate, db: AsyncSession = Depends(get_db)):
  result = await db.execute(
    select(Review).where(Review.id == review_id)
    .options(selectinload(Review.user), selectinload(Review.product))
  )
  review = result.scalar_one_or_none()
  if not review:
    raise HTTPException(status_code=404, detail="Review not found")

  review.rating = review_in.rating
  review.comment = review_in.comment

  db.add(review)
  await db.commit()
  await db.refresh(review)
  return review


# DELETE REVIEW
@router.delete("/{review_id}")
async def delete_review(review_id: str, db: AsyncSession = Depends(get_db)):
  result = await db.execute(select(Review).where(Review.id == review_id))
  review = result.scalar_one_or_none()
  if not review:
    raise HTTPException(status_code=404, detail="Review not found")

  await db.delete(review)
  await db.commit()
  return {"detail": "Review deleted successfully"}


# GET REVIEWS FOR A PRODUCT
@router.get("/product/{product_id}", response_model=List[ReviewRead])
async def get_reviews_for_product(product_id: str, db: AsyncSession = Depends(get_db)):
  result = await db.execute(
    select(Review)
    .where(Review.product_id == product_id)
    .options(selectinload(Review.user), selectinload(Review.product))
  )
  reviews = result.scalars().all()
  return reviews


# GET REVIEWS FOR A USER
@router.get("/user/{user_id}", response_model=List[ReviewRead])
async def get_reviews_for_user(user_id: str, db: AsyncSession = Depends(get_db)):
  result = await db.execute(
    select(Review)
    .where(Review.user_id == user_id)
    .options(selectinload(Review.user), selectinload(Review.product))
  )
  reviews = result.scalars().all()
  return reviews
