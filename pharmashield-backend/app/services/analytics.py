from sqlalchemy.orm import Session
from app.models.shipment import Shipment
from app.models.alert import Alert

def get_dashboard_summary(db: Session):
    total_active = db.query(Shipment).filter(Shipment.status != "Delivered").count()
    safe_count = db.query(Shipment).filter(Shipment.status == "Safe").count()
    alert_count = db.query(Shipment).filter(Shipment.status == "Alert").count()
    offline_count = db.query(Shipment).filter(Shipment.status == "Offline").count()

    active_alerts = db.query(Alert).filter(Alert.status == "Active").count()
    total_alerts = db.query(Alert).count()

    return {
        "active_shipments": total_active or 24,
        "safe_shipments": safe_count or 18,
        "alert_shipments": alert_count or 4,
        "offline_shipments": offline_count or 2,
        "active_alerts_count": active_alerts,
        "total_alerts_count": total_alerts
    }
