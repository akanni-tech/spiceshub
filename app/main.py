# main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api import api_router
import asyncio

app = FastAPI(title="E-commerce API", version="1.0.0")

# CORS configuration (adjust origins as needed)
origins = [
    "http://localhost",
    "http://localhost:5173",
    "http://127.0.0.1:3000",
    # Add your frontend domain here
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include all routers
app.include_router(api_router)


# Optional: simple root endpoint
@app.get("/")
async def root():
    return {"message": "Welcome to the E-commerce API"}
