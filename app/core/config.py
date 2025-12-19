from datetime import timedelta
from pydantic_settings import BaseSettings
from dotenv import load_dotenv
import os

load_dotenv()

class Settings(BaseSettings):
    PROJECT_NAME: str = "SpicesHubAPI"
    DATABASE_URI: str = "sqlite:///database.db"
    JWT_SECRET_KEY: str
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60
    ALGORITHM: str = "HS256"
    REDIS_URL: str

    class Config:
        env_file = '.env'

settings = Settings()