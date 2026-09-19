from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database.connection import get_db
from app.models.shipment import Shipment
from app.schemas.shipment import ShipmentCreate, ShipmentResponse

router = APIRouter(prefix="/api/shipments", tags=["Shipments"])

@router.get("", response_model=List[ShipmentResponse])
def get_shipments(status: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(Shipment)
    if status:
        query = query.filter(Shipment.status == status)
    return query.order_by(Shipment.updated_at.desc()).all()

@router.get("/{shipment_id}", response_model=ShipmentResponse)
def get_shipment_by_id(shipment_id: str, db: Session = Depends(get_db)):
    shipment = db.query(Shipment).filter(Shipment.shipment_id == shipment_id).first()
    if not shipment:
        raise HTTPException(status_code=404, detail=f"Shipment {shipment_id} not found")
    return shipment

@router.post("", response_model=ShipmentResponse)
def create_shipment(shipment_in: ShipmentCreate, db: Session = Depends(get_db)):
    existing = db.query(Shipment).filter(Shipment.shipment_id == shipment_in.shipment_id).first()
    if existing:
        raise HTTPException(status_code=400, detail=f"Shipment ID {shipment_in.shipment_id} already exists")
    
    new_shipment = Shipment(**shipment_in.dict())
    db.add(new_shipment)
    db.commit()
    db.refresh(new_shipment)
    return new_shipment
