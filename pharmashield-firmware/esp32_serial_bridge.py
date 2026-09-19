"""
PharmaShield Hardware-to-Software USB Serial Bridge
Reads live JSON telemetry packets sent over USB Serial from the ESP32 and posts them directly
to the local PharmaShield backend API (http://127.0.0.1:8000/api/sensor-data).
"""

import serial
import serial.tools.list_ports
import requests
import json
import time
import sys

API_URL = "http://127.0.0.1:8000/api/sensor-data"
BAUD_RATE = 115200

def find_esp32_port():
    if len(sys.argv) > 1:
        return sys.argv[1]
    ports = serial.tools.list_ports.comports()
    # First pass: look specifically for USB-to-UART chips (CP210x, CH340, FTDI, Silicon Labs)
    for port in ports:
        desc = port.description.upper()
        if "CP210" in desc or "SILICON LABS" in desc or "CH340" in desc or "FT232" in desc or "UART" in desc:
            return port.device
    # Second pass: look for any non-bluetooth USB device
    for port in ports:
        desc = port.description.upper()
        if "BLUETOOTH" not in desc and ("USB" in desc or "SERIAL" in desc):
            return port.device
    # Fallback if no matching description
    for port in ports:
        if "BLUETOOTH" not in port.description.upper():
            return port.device
    return None

def main():
    print("==================================================")
    print("  PharmaShield ESP32 USB Serial Telemetry Bridge  ")
    print("==================================================")
    
    port_name = find_esp32_port()
    if not port_name:
        print("[ERROR] No USB Serial COM ports detected! Please connect your ESP32 via USB.")
        sys.exit(1)
        
    print(f"[INFO] Connecting to ESP32 on port: {port_name} at {BAUD_RATE} baud...")
    
    try:
        ser = serial.Serial(port_name, BAUD_RATE, timeout=2)
        time.sleep(2)
        print(f"[OK] Successfully connected to {port_name}")
        print(f"[INFO] Listening for incoming sensor telemetry packets...\n")
        
        buffer = ""
        while True:
            if ser.in_waiting > 0:
                line = ser.readline().decode('utf-8', errors='ignore').strip()
                if not line:
                    continue
                
                print(f"[SERIAL RX] {line}")
                
                # Check if line contains a valid JSON payload from ESP32
                if line.startswith("{") and line.endswith("}"):
                    try:
                        payload = json.loads(line)
                        print("\n[BRIDGING] Valid JSON Telemetry Packet detected!")
                        print(json.dumps(payload, indent=2))
                        
                        # Post to FastAPI Backend
                        response = requests.post(API_URL, json=payload, headers={"Content-Type": "application/json"})
                        if response.status_code == 200:
                            print(f"[SUCCESS] Packet delivered to Software API! Response: {response.json()}\n")
                        else:
                            print(f"[SERVER ERROR] Status {response.status_code}: {response.text}\n")
                    except Exception as e:
                        print(f"[PARSE ERROR] Failed to parse JSON: {e}\n")
                        
    except KeyboardInterrupt:
        print("\n[INFO] Bridge stopped by user.")
    except Exception as e:
        print(f"[ERROR] Serial Communication Error: {e}")

if __name__ == "__main__":
    main()
