from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List

from app.db.session import get_db
from app.models.user import User
from app.schemas.userSchema import UserCreate, UserRead

router = APIRouter(prefix="/users", tags=["Users"])


# CREATE USER
@router.post("/", response_model=UserRead)
async def create_user(user_in: UserCreate, db: AsyncSession = Depends(get_db)):
    # Check if email already exists
  result = await db.execute(select(User).where(User.email == user_in.email))
  existing_user = result.scalar_one_or_none()
  if existing_user:
    raise HTTPException(status_code=400, detail="Email already registered")

  user = User(
    firstName=user_in.firstName,
    lastName=user_in.lastName,
    email=user_in.email,
    phoneNumber=user_in.phoneNumber,
    supabase_id=user_in.supabase_id,
    role=user_in.role
  )
  db.add(user)
  await db.commit()
  await db.refresh(user)
  return user


# GET ALL USERS
@router.get("/", response_model=List[UserRead])
async def list_users(db: AsyncSession = Depends(get_db)):
  result = await db.execute(select(User))
  users = result.scalars().all()
  return users


# GET SINGLE USER
@router.get("/{user_id}", response_model=UserRead)
async def get_user(user_id: str, db: AsyncSession = Depends(get_db)):
  result = await db.execute(select(User).where(User.id == user_id))
  user = result.scalar_one_or_none()
  if not user:
    raise HTTPException(status_code=404, detail="User not found")
  return user


# GET USER BY SUPABASE ID
@router.get("/by-supabase/{supabase_id}", response_model=UserRead)
async def get_user_by_supabase_id(supabase_id: str, db: AsyncSession = Depends(get_db)):
  result = await db.execute(select(User).where(User.supabase_id == supabase_id))
  user = result.scalar_one_or_none()
  if not user:
    raise HTTPException(status_code=404, detail="User not found")
  return user


# UPDATE USER
@router.put("/{user_id}", response_model=UserRead)
async def update_user(user_id: str, user_in: UserCreate, db: AsyncSession = Depends(get_db)):
  result = await db.execute(select(User).where(User.id == user_id))
  user = result.scalar_one_or_none()
  if not user:
    raise HTTPException(status_code=404, detail="User not found")

  update_data = user_in.dict(exclude_unset=True)
  for field, value in update_data.items():
    setattr(user, field, value)

  db.add(user)
  await db.commit()
  await db.refresh(user)
  return user


# DELETE USER
@router.delete("/{user_id}")
async def delete_user(user_id: str, db: AsyncSession = Depends(get_db)):
  result = await db.execute(select(User).where(User.id == user_id))
  user = result.scalar_one_or_none()
  if not user:
    raise HTTPException(status_code=404, detail="User not found")

  await db.delete(user)
  await db.commit()
  return {"detail": "User deleted successfully"}
