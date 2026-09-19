from sqlalchemy import Column, Integer, String, DateTime, Float
from datetime import datetime
from app.database.connection import Base

class Shipment(Base):
    __tablename__ = "shipments"

    id = Column(Integer, primary_key=True, index=True)
    shipment_id = Column(String, unique=True, index=True, nullable=False) # e.g. PHARMA-001
    product_name = Column(String, nullable=False)
    origin = Column(String, nullable=False)
    destination = Column(String, nullable=False)
    status = Column(String, default="In Transit") # In Transit, Safe, Alert, Delivered, Offline
    current_temp = Column(Float, default=4.0)
    current_humidity = Column(Float, default=60.0)
    current_shock = Column(Float, default=0.1)
    current_light = Column(Float, default=120.0)
    battery_level = Column(Float, default=85.0)
    connectivity_status = Column(String, default="Online") # Online, Offline
    lat = Column(Float, default=11.0168)
    lng = Column(Float, default=76.9558)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
