from sqlalchemy.orm import Session
from app.models.sensor_data import SensorData
from app.models.shipment import Shipment
from app.models.alert import SyncLog
from app.services.alert_engine import evaluate_sensor_data
from datetime import datetime

def process_offline_sync_batch(db: Session, shipment_id: str, records: list):
    synced_count = 0
    latest_record = None

    for r in records:
        record_time = r.timestamp if hasattr(r, 'timestamp') and r.timestamp else datetime.utcnow()
        sd = SensorData(
            shipment_id=shipment_id,
            timestamp=record_time,
            temperature=r.temperature,
            humidity=r.humidity,
            shock=r.shock,
            light=r.light,
            battery=r.battery,
            latitude=r.latitude,
            longitude=r.longitude,
            connectivity_status="Online", # Restored network status
            is_synced_from_offline=1
        )
        db.add(sd)
        evaluate_sensor_data(db, shipment_id, r.temperature, r.humidity, r.shock, r.light, "Online")
        synced_count += 1
        latest_record = r

    # Update shipment with latest record data
    if latest_record:
        shipment = db.query(Shipment).filter(Shipment.shipment_id == shipment_id).first()
        if shipment:
            shipment.current_temp = latest_record.temperature
            shipment.current_humidity = latest_record.humidity
            shipment.current_shock = latest_record.shock
            shipment.current_light = latest_record.light
            shipment.battery_level = latest_record.battery
            shipment.lat = latest_record.latitude
            shipment.lng = latest_record.longitude
            shipment.connectivity_status = "Online"
            shipment.updated_at = datetime.utcnow()

    # Log store & forward sync transaction
    sync_log = SyncLog(
        shipment_id=shipment_id,
        records_synced=synced_count,
        sync_status="Success"
    )
    db.add(sync_log)
    db.commit()

    return synced_count
