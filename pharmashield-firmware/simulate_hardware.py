"""
PharmaShield Hardware Simulator
Simulates a live physical ESP32 telemetry device transmitting real sensor telemetry data
to test the full end-to-end software pipeline.
"""

import requests
import time
import random
import sys

API_URL = "http://127.0.0.1:8000/api/sensor-data"

def main():
    print("==================================================")
    print("  PharmaShield Hardware Simulation Telemetry Stream ")
    print("==================================================")
    print(f"Targeting API Endpoint: {API_URL}")
    print("Press Ctrl+C to stop simulation.\n")

    base_lat = 11.0168
    base_lng = 76.9558
    step = 0

    try:
        while True:
            step += 1
            # Simulate slight sensor fluctuations
            temp = round(4.0 + random.uniform(-0.5, 0.8), 2)
            humidity = round(60.0 + random.uniform(-2.0, 2.0), 1)
            shock = round(0.1 + random.uniform(0.0, 0.15), 2)
            light = round(110.0 + random.uniform(-10.0, 15.0), 1)
            battery = max(20.0, round(95.0 - (step * 0.1), 1))

            # Simulate occasional cold chain threshold excursion (every 8 steps)
            if step % 8 == 0:
                temp = 9.2 # High temp breach!
                print("[EVENT SIMULATED] Temperature Excursion Triggered (9.2°C)!")

            # Simulate occasional shock event (every 12 steps)
            if step % 12 == 0:
                shock = 2.8 # Impact breach!
                print("[EVENT SIMULATED] Impact / Shock Event Triggered (2.8g)!")

            # Simulate location movement along route
            lat = round(base_lat + (step * 0.0012), 6)
            lng = round(base_lng + (step * 0.0018), 6)

            payload = {
                "shipment_id": "PHARMA-001",
                "temperature": temp,
                "humidity": humidity,
                "shock": shock,
                "light": light,
                "battery": battery,
                "latitude": lat,
                "longitude": lng,
                "connectivity_status": "Online"
            }

            try:
                response = requests.post(API_URL, json=payload, timeout=3)
                if response.status_code == 200:
                    print(f"[{time.strftime('%H:%M:%S')}] [PACKET #{step}] Sent successfully! Temp: {temp}°C | Humidity: {humidity}% | Shock: {shock}g | Lat: {lat}, Lng: {lng}")
                else:
                    print(f"[ERROR] HTTP {response.status_code}: {response.text}")
            except Exception as e:
                print(f"[CONNECTION ERROR] Failed to reach server: {e}")

            time.sleep(3)

    except KeyboardInterrupt:
        print("\n[INFO] Simulator stopped.")

if __name__ == "__main__":
    main()
