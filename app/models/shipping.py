from sqlalchemy import Column, Integer, String, ForeignKey, UUID, Text
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
  address = Column(String, nullable=True)
  phone = Column(String, nullable=True)
  apartment = Column(String, nullable=True)
  note = Column(Text, nullable=True)

  user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), unique=True, nullable=False)
  user = relationship("User", back_populates="shipping_addresses")
