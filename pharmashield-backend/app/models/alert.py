from sqlalchemy import Column, Integer, String, DateTime
from datetime import datetime
from app.database.connection import Base

class Alert(Base):
    __tablename__ = "alerts"

    id = Column(Integer, primary_key=True, index=True)
    shipment_id = Column(String, index=True, nullable=False)
    type = Column(String, nullable=False) # Temperature Excursion, Shock Event, Tamper Detected, Network Lost, Humidity Excursion
    severity = Column(String, nullable=False) # Critical, High, Medium, Low
    message = Column(String, nullable=False)
    status = Column(String, default="Active") # Active, Acknowledged, Resolved
    created_at = Column(DateTime, default=datetime.utcnow)
    resolved_at = Column(DateTime, nullable=True)

class SyncLog(Base):
    __tablename__ = "sync_logs"

    id = Column(Integer, primary_key=True, index=True)
    shipment_id = Column(String, index=True, nullable=False)
    record_id = Column(Integer, nullable=True)
    records_synced = Column(Integer, default=1)
    sync_status = Column(String, default="Success") # Success, Pending, Failed
    created_at = Column(DateTime, default=datetime.utcnow)
