from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker
from app.core.config import settings


engine = create_async_engine(
    settings.DATABASE_URI,
    echo=False,
    future=True,
    pool_recycle=1800, 
    pool_pre_ping=True,
    connect_args={"ssl": "require"}       # keep connections alive
)

async_session = sessionmaker(
  bind=engine, 
  class_=AsyncSession, 
  expire_on_commit=False
)



async def get_db():
  async with async_session() as session:
    yield session
