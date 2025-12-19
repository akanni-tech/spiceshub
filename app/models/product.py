from sqlalchemy import (
    Column, Integer, String, Float, Text, Boolean, ForeignKey, TIMESTAMP, ARRAY, UUID
)
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.base_class import Base
import uuid

class Product(Base):
  __tablename__ = "products"

  id = Column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
        unique=True,
        nullable=False,
        index=True
    )
  name = Column(String)
  price = Column(Float)
  originalPrice = Column(Float, nullable=True)
  stock = Column(Integer)
  rating = Column(Float)
  isFeatured = Column(Boolean, default=False)
  reviewCount = Column(Integer)
  isSale = Column(Boolean, default=False)
  isNew = Column(Boolean, default=False)
  # colors = Column(ARRAY(String))
  containers = Column(ARRAY(String)) #the packaging containers available for the spice
  description = Column(Text)
  status = Column(String)
  main_image = Column(String, nullable=True)
  images = Column(ARRAY(String))
  cost_per_item = Column(Float) #cost per 100g
  category_id = Column(UUID(as_uuid=True), ForeignKey("categories.id"))

  category = relationship("Category", back_populates="products")
  images_rel = relationship("ProductImage", back_populates="product", cascade="all, delete")
  reviews = relationship("Review", back_populates="product", cascade="all, delete-orphan")


class ProductImage(Base):
  __tablename__ = "product_images"

  id = Column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
        unique=True,
        nullable=False,
        index=True
    )
  url = Column(String)
  alt_text = Column(String, nullable=True)
  is_main = Column(Boolean, default=False)
  product_id = Column(UUID(as_uuid=True), ForeignKey("products.id"), unique=True, nullable=False)

  product = relationship("Product", back_populates="images_rel")



class Category(Base):
    __tablename__ = "categories"

    id = Column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
        unique=True,
        nullable=False,
        index=True
    )
    name = Column(String)
    status = Column(String, default='draft')
    isFeatured = Column(Boolean, default=False)
    image = Column(String, nullable=True)
    description = Column(String)

    products = relationship("Product", back_populates="category", cascade="all, delete-orphan")

