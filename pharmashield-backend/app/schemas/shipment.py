from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class ShipmentBase(BaseModel):
    shipment_id: str
    product_name: str
    origin: str
    destination: str
    status: Optional[str] = "In Transit"
    current_temp: Optional[float] = 4.0
    current_humidity: Optional[float] = 60.0
    current_shock: Optional[float] = 0.1
    current_light: Optional[float] = 120.0
    battery_level: Optional[float] = 85.0
    connectivity_status: Optional[str] = "Online"
    lat: Optional[float] = 11.0168
    lng: Optional[float] = 76.9558

class ShipmentCreate(ShipmentBase):
    pass

class ShipmentResponse(ShipmentBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class SensorDataBase(BaseModel):
    shipment_id: str
    temperature: float
    humidity: float
    shock: float
    light: float
    battery: float
    latitude: float
    longitude: float
    connectivity_status: Optional[str] = "Online"

class SensorDataCreate(SensorDataBase):
    timestamp: Optional[datetime] = None
    is_synced_from_offline: Optional[int] = 0

class SensorDataResponse(SensorDataBase):
    id: int
    timestamp: datetime
    is_synced_from_offline: int

    class Config:
        from_attributes = True

class AlertBase(BaseModel):
    shipment_id: str
    type: str
    severity: str
    message: str
    status: Optional[str] = "Active"

class AlertCreate(AlertBase):
    pass

class AlertUpdate(BaseModel):
    status: str # Active, Acknowledged, Resolved

class AlertResponse(AlertBase):
    id: int
    created_at: datetime
    resolved_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class SyncBatchRequest(BaseModel):
    shipment_id: str
    records: List[SensorDataCreate]

class SyncBatchResponse(BaseModel):
    status: str
    synced_count: int
    message: str
