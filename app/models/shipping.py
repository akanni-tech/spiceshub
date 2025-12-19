from sqlalchemy import Column, Integer, String, ForeignKey, UUID
from sqlalchemy.orm import relationship
from app.db.base_class import Base
import uuid

class ShippingAddress(Base):
  __tablename__ = "shipping_addresses"

  id = Column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
        unique=True,
        nullable=False,
        index=True
    )
  country = Column(String, nullable=False)
  city = Column(String, nullable=False)
  area = Column(String, nullable=False)

  user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), unique=True, nullable=False)
  user = relationship("User", back_populates="shipping_addresses")
