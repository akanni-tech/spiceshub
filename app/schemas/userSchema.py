from pydantic import BaseModel, EmailStr, UUID4
from datetime import datetime
from typing import List, Optional

class UserBase(BaseModel):
    firstName: str
    lastName: str
    supabase_id: str
    email: EmailStr
    phoneNumber: Optional[str]
    role: Optional[str] = "user"

    class Config:
        orm_mode = True
    
class UserCreate(UserBase):
    pass

class UserRead(UserBase):
    id: UUID4
    created_at: datetime

    class Config:
        orm_mode = True