from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime
from app.database.connection import get_db
from app.models.alert import Alert
from app.schemas.shipment import AlertResponse, AlertUpdate

router = APIRouter(prefix="/api/alerts", tags=["Alerts"])

@router.get("", response_model=List[AlertResponse])
def get_alerts(type: Optional[str] = None, status: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(Alert)
    if type and type != "All":
        query = query.filter(Alert.type == type)
    if status and status != "All":
        query = query.filter(Alert.status == status)
    return query.order_by(Alert.created_at.desc()).all()

@router.get("/{shipment_id}", response_model=List[AlertResponse])
def get_shipment_alerts(shipment_id: str, db: Session = Depends(get_db)):
    return db.query(Alert).filter(Alert.shipment_id == shipment_id).order_by(Alert.created_at.desc()).all()

@router.put("/{alert_id}", response_model=AlertResponse)
def update_alert_status(alert_id: int, payload: AlertUpdate, db: Session = Depends(get_db)):
    alert = db.query(Alert).filter(Alert.id == alert_id).first()
    if not alert:
        raise HTTPException(status_code=404, detail="Alert not found")
    
    alert.status = payload.status
    if payload.status == "Resolved":
        alert.resolved_at = datetime.utcnow()
    db.commit()
    db.refresh(alert)
    return alert
