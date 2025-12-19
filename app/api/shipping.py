from fastapi import APIRouter, Depends
from typing import List
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.schemas.shipping import Shipping, ShippingCreate, ShippingUpdate
from app.models.shipping import ShippingAddress

router = APIRouter(prefix="/shipping", tags=["Shipping"])


@router.post("/", response_model=Shipping)
def create_shipping(data: ShippingCreate, db: Session = Depends(get_db)):
    item = ShippingAddress(**data.dict())
    db.add(item)
    db.commit()
    db.refresh(item)
    return item


@router.get("/", response_model=List[Shipping])
def list_shipping(db: Session = Depends(get_db)):
    return db.query(ShippingAddress).all()


@router.put("/{shipping_id}", response_model=Shipping)
def update_shipping(shipping_id: str, data: ShippingUpdate, db: Session = Depends(get_db)):
    item = db.query(ShippingAddress).filter_by(id=shipping_id).first()
    if not item:
        return {"error": "Not found"}

    update_data = data.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(item, field, value)

    db.commit()
    db.refresh(item)
    return item


@router.delete("/{shipping_id}")
def delete_shipping(shipping_id: str, db: Session = Depends(get_db)):
    item = db.query(ShippingAddress).filter_by(id=shipping_id).first()
    if not item:
        return {"error": "Not found"}
    db.delete(item)
    db.commit()
    return {"message": "Deleted"}
