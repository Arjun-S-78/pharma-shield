from sqlalchemy.orm import Session
from app.models.alert import Alert
from app.models.shipment import Shipment
from datetime import datetime

def evaluate_sensor_data(db: Session, shipment_id: str, temp: float, humidity: float, shock: float, light: float, conn_status: str):
    alerts = []
    
    # 1. Temperature Excursion Check (Cold chain 2.0°C - 8.0°C)
    if temp < 2.0 or temp > 8.0:
        severity = "Critical" if (temp < 0.0 or temp > 12.0) else "High"
        msg = f"Temperature Excursion: {temp}°C detected (Allowed Range: 2.0°C - 8.0°C)"
        alerts.append(Alert(
            shipment_id=shipment_id,
            type="Temperature Excursion",
            severity=severity,
            message=msg,
            status="Active"
        ))

    # 2. Shock & Vibration Event Check (Threshold > 2.0g)
    if shock >= 2.0:
        severity = "Critical" if shock >= 4.0 else "High"
        msg = f"Severe Shock Event detected: {shock}g exceeds safe threshold (2.0g)"
        alerts.append(Alert(
            shipment_id=shipment_id,
            type="Shock Event",
            severity=severity,
            message=msg,
            status="Active"
        ))

    # 3. Light Exposure / Tamper Detection (> 300 lux)
    if light > 300:
        msg = f"Light Tamper Alert: Ambient light reading {light} lux indicates container compromise"
        alerts.append(Alert(
            shipment_id=shipment_id,
            type="Tamper Detected",
            severity="Critical",
            message=msg,
            status="Active"
        ))

    # 4. Humidity Out of Specification (30% - 75%)
    if humidity < 30.0 or humidity > 75.0:
        msg = f"Humidity Out-of-Bounds: {humidity}% (Safe Range: 30% - 75%)"
        alerts.append(Alert(
            shipment_id=shipment_id,
            type="Humidity Excursion",
            severity="Medium",
            message=msg,
            status="Active"
        ))

    # 5. Network Connectivity Loss
    if conn_status.lower() == "offline":
        msg = f"Connectivity Lost: Transponder switched to local offline store-and-forward mode"
        alerts.append(Alert(
            shipment_id=shipment_id,
            type="Network Lost",
            severity="Warning",
            message=msg,
            status="Active"
        ))

    # Save alerts to database if any generated
    for alert in alerts:
        db.add(alert)
    
    # Update Shipment status if critical alert exists
    shipment = db.query(Shipment).filter(Shipment.shipment_id == shipment_id).first()
    if shipment:
        if any(a.severity in ["Critical", "High"] for a in alerts):
            shipment.status = "Alert"
        elif conn_status.lower() == "offline":
            shipment.status = "Offline"
        db.commit()

    return len(alerts)
