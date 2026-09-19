from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.connection import get_db
from app.models.shipment import Shipment
from app.models.alert import Alert

router = APIRouter(prefix="/api/qr", tags=["QR Verification"])

@router.get("/{shipment_id}")
def verify_shipment_qr(shipment_id: str, db: Session = Depends(get_db)):
    shipment = db.query(Shipment).filter(Shipment.shipment_id == shipment_id).first()
    if not shipment:
        raise HTTPException(status_code=404, detail=f"Shipment {shipment_id} not registered")
    
    alerts_count = db.query(Alert).filter(Alert.shipment_id == shipment_id, Alert.status == "Active").count()
    is_compliant = alerts_count == 0 and shipment.status in ["Safe", "In Transit", "Delivered"]

    return {
        "shipment_id": shipment.shipment_id,
        "product_name": shipment.product_name,
        "origin": shipment.origin,
        "destination": shipment.destination,
        "status": shipment.status,
        "is_compliant": is_compliant,
        "active_alerts": alerts_count,
        "compliance_summary": "✅ Consignment maintains compliant cold-chain parameters (2-8°C)" if is_compliant else "⚠️ Temperature/Shock Excursions logged during transit. Quality audit mandatory.",
        "verified_at": shipment.updated_at
    }
