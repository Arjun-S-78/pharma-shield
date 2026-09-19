from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime
from app.database.connection import get_db
from app.models.sensor_data import SensorData
from app.models.shipment import Shipment
from app.schemas.shipment import SensorDataCreate, SensorDataResponse
from app.services.alert_engine import evaluate_sensor_data

router = APIRouter(prefix="/api/sensor-data", tags=["Sensor Data"])

@router.post("", response_model=SensorDataResponse)
def post_sensor_data(data_in: SensorDataCreate, db: Session = Depends(get_db)):
    sensor_rec = SensorData(
        shipment_id=data_in.shipment_id,
        timestamp=data_in.timestamp or datetime.utcnow(),
        temperature=data_in.temperature,
        humidity=data_in.humidity,
        shock=data_in.shock,
        light=data_in.light,
        battery=data_in.battery,
        latitude=data_in.latitude,
        longitude=data_in.longitude,
        connectivity_status=data_in.connectivity_status or "Online",
        is_synced_from_offline=data_in.is_synced_from_offline or 0
    )
    db.add(sensor_rec)
    
    # Update latest shipment metrics
    shipment = db.query(Shipment).filter(Shipment.shipment_id == data_in.shipment_id).first()
    if shipment:
        shipment.current_temp = data_in.temperature
        shipment.current_humidity = data_in.humidity
        shipment.current_shock = data_in.shock
        shipment.current_light = data_in.light
        shipment.battery_level = data_in.battery
        shipment.lat = data_in.latitude
        shipment.lng = data_in.longitude
        shipment.connectivity_status = data_in.connectivity_status or "Online"
        shipment.updated_at = datetime.utcnow()

    # Trigger automatic alert evaluation engine
    evaluate_sensor_data(
        db=db,
        shipment_id=data_in.shipment_id,
        temp=data_in.temperature,
        humidity=data_in.humidity,
        shock=data_in.shock,
        light=data_in.light,
        conn_status=data_in.connectivity_status or "Online"
    )

    db.commit()
    db.refresh(sensor_rec)
    return sensor_rec

@router.get("/{shipment_id}", response_model=List[SensorDataResponse])
def get_sensor_history(shipment_id: str, db: Session = Depends(get_db)):
    records = db.query(SensorData).filter(SensorData.shipment_id == shipment_id).order_by(SensorData.timestamp.asc()).all()
    return records
