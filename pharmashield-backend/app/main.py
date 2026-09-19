from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database.connection import engine, Base, SessionLocal
from app.routes import auth, shipments, sensor_data, alerts, qr, dashboard, sync
from app.models.shipment import Shipment
from app.models.alert import Alert
from app.models.user import User
from passlib.context import CryptContext
from datetime import datetime

# Create Database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="PharmaShield Telemetry & Consignment Monitoring API",
    description="IoT-based pharmaceutical shipment monitoring with offline-first store-and-forward sync",
    version="1.0.0"
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(auth.router)
app.include_router(shipments.router)
app.include_router(sensor_data.router)
app.include_router(alerts.router)
app.include_router(qr.router)
app.include_router(dashboard.router)
app.include_router(sync.router)

@app.on_event("startup")
def seed_initial_data():
    db = SessionLocal()
    try:
        # Check if shipments seeded
        if db.query(Shipment).count() == 0:
            sample_shipments = [
                Shipment(
                    shipment_id="PHARMA-001",
                    product_name="COVID-19 Vaccine (Pfizer-BioNTech)",
                    origin="Mumbai Hub (BOM)",
                    destination="Coimbatore Medical Center",
                    status="Safe",
                    current_temp=4.2,
                    current_humidity=61.0,
                    current_shock=0.18,
                    current_light=120.0,
                    battery_level=82.0,
                    connectivity_status="Online",
                    lat=11.0168,
                    lng=76.9558
                ),
                Shipment(
                    shipment_id="PHARMA-002",
                    product_name="Insulin Glargine Cold Storage",
                    origin="Hyderabad Biopark",
                    destination="Chennai Apollo Hospital",
                    status="Alert",
                    current_temp=9.5,
                    current_humidity=78.0,
                    current_shock=2.4,
                    current_light=450.0,
                    battery_level=64.0,
                    connectivity_status="Online",
                    lat=12.9716,
                    lng=77.5946
                ),
                Shipment(
                    shipment_id="PHARMA-003",
                    product_name="Monoclonal Antibodies Batch #402",
                    origin="Bengaluru Cold Hub",
                    destination="Kochi Specialist Clinic",
                    status="In Transit",
                    current_temp=3.8,
                    current_humidity=58.0,
                    current_shock=0.12,
                    current_light=95.0,
                    battery_level=91.0,
                    connectivity_status="Online",
                    lat=10.8505,
                    lng=76.2711
                ),
                Shipment(
                    shipment_id="PHARMA-004",
                    product_name="Pediatric Vaccines (Rotavirus)",
                    origin="Delhi Central Depot",
                    destination="Madurai General Hospital",
                    status="Offline",
                    current_temp=5.1,
                    current_humidity=63.0,
                    current_shock=0.25,
                    current_light=110.0,
                    battery_level=44.0,
                    connectivity_status="Offline",
                    lat=9.9252,
                    lng=78.1198
                ),
                Shipment(
                    shipment_id="PHARMA-005",
                    product_name="Blood Plasma Consignment #88",
                    origin="Pune Serum Institute",
                    destination="Tiruchirappalli Blood Bank",
                    status="Delivered",
                    current_temp=4.0,
                    current_humidity=55.0,
                    current_shock=0.08,
                    current_light=80.0,
                    battery_level=98.0,
                    connectivity_status="Online",
                    lat=10.7905,
                    lng=78.7047
                )
            ]
            db.add_all(sample_shipments)
            db.commit()

        # Seed sample alerts
        if db.query(Alert).count() == 0:
            sample_alerts = [
                Alert(shipment_id="PHARMA-002", type="Temperature Excursion", severity="Critical", message="Temperature 9.5°C exceeded 8.0°C cold-chain upper threshold", status="Active"),
                Alert(shipment_id="PHARMA-002", type="Shock Event", severity="High", message="Impact g-force 2.4g detected on container axis Z", status="Active"),
                Alert(shipment_id="PHARMA-002", type="Tamper Detected", severity="Critical", message="Light intensity spiked to 450 lux indicating hatch breach", status="Active"),
                Alert(shipment_id="PHARMA-004", type="Network Lost", severity="Medium", message="Cellular handshake timeout. Transponder switched to offline buffer.", status="Acknowledged"),
                Alert(shipment_id="PHARMA-003", type="Humidity Excursion", severity="Low", message="Transitory relative humidity spike 76%", status="Resolved")
            ]
            db.add_all(sample_alerts)
            db.commit()

        # Seed default admin user
        pwd_context = CryptContext(schemes=["pbkdf2_sha256"], deprecated="auto")
        if db.query(User).count() == 0:
            admin_user = User(
                username="admin",
                email="admin@pharmashield.io",
                hashed_password=pwd_context.hash("admin123"),
                role="admin"
            )
            db.add(admin_user)
            db.commit()

    finally:
        db.close()

@app.get("/")
def read_root():
    return {
        "system": "PharmaShield IoT Pharmaceutical Consignment Tracking API",
        "status": "Operational",
        "version": "1.0.0",
        "docs_url": "/docs"
    }
