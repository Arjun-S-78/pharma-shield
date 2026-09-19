from sqlalchemy import Column, Integer, String, DateTime, Float
from datetime import datetime
from app.database.connection import Base

class SensorData(Base):
    __tablename__ = "sensor_data"

    id = Column(Integer, primary_key=True, index=True)
    shipment_id = Column(String, index=True, nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow, index=True)
    temperature = Column(Float, nullable=False)
    humidity = Column(Float, nullable=False)
    shock = Column(Float, nullable=False)
    light = Column(Float, nullable=False)
    battery = Column(Float, nullable=False)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    connectivity_status = Column(String, default="Online") # Online, Offline
    is_synced_from_offline = Column(Integer, default=0) # 1 if store-and-forward synced
