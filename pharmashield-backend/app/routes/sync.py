from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database.connection import get_db
from app.schemas.shipment import SyncBatchRequest, SyncBatchResponse
from app.services.data_sync import process_offline_sync_batch
from app.models.alert import SyncLog

router = APIRouter(prefix="/api/sync", tags=["Offline Store-and-Forward Sync"])

@router.post("", response_model=SyncBatchResponse)
def sync_offline_records(payload: SyncBatchRequest, db: Session = Depends(get_db)):
    if not payload.records:
        return {"status": "Ignored", "synced_count": 0, "message": "No telemetry records submitted"}

    count = process_offline_sync_batch(db, payload.shipment_id, payload.records)
    return {
        "status": "Success",
        "synced_count": count,
        "message": f"Successfully synchronized {count} store-and-forward telemetry logs for shipment {payload.shipment_id}"
    }

@router.get("/pending")
def get_pending_sync_logs(db: Session = Depends(get_db)):
    logs = db.query(SyncLog).order_by(SyncLog.created_at.desc()).limit(20).all()
    return logs
