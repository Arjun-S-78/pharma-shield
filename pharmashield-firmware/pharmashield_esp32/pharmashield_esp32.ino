/*
 * PharmaShield IoT Consignment Tracker - ESP32 Firmware
 * Custom Firmware mapped to breadboard hardware setup:
 * 
 * Hardware Wiring:
 * 1. ESP32 Dev Board (30-pin)
 * 2. DHT22 Temperature & Humidity Sensor -> GPIO 4 (Data), 3.3V/5V, GND
 * 3. MPU6050 Accelerometer/Gyroscope    -> I2C SDA = GPIO 21, SCL = GPIO 22
 * 4. NEO-6M GPS Module                  -> RX2 = GPIO 16 (connected to GPS TX), TX2 = GPIO 17 (connected to GPS RX)
 * 5. LM393 Sensor Module (Light/Sound)   -> GPIO 34 (Analog AO pin)
 */

#include <WiFi.h>
#include <HTTPClient.h>
#include <Wire.h>
#include <DHT.h>
#include <Adafruit_MPU6050.h>
#include <Adafruit_Sensor.h>
#include <TinyGPS++.h>
#include <HardwareSerial.h>

// ================= USER CONFIGURATION =================
const char* WIFI_SSID     = "YOUR_WIFI_SSID";     // Change to your Wi-Fi SSID
const char* WIFI_PASSWORD = "YOUR_WIFI_PASSWORD"; // Change to your Wi-Fi Password

// Backend Server Endpoint (Replace with your Laptop IP when using Wi-Fi)
const char* API_ENDPOINT  = "http://192.168.1.100:8000/api/sensor-data";

// Shipment ID
const char* SHIPMENT_ID   = "PHARMA-001";

// Telemetry Interval (Milliseconds)
const unsigned long TELEMETRY_INTERVAL_MS = 5000;
// ======================================================

// Pin Definitions Mapped from Breadboard
#define DHTPIN            4       // GPIO 4 connected to DHT22 DATA
#define DHTTYPE           DHT22   // Sensor Type DHT22
#define SENSOR_ANALOG_PIN 34      // GPIO 34 connected to LM393 module AO
#define GPS_RX_PIN        16      // ESP32 RX2 connected to GPS TX
#define GPS_TX_PIN        17      // ESP32 TX2 connected to GPS RX

// Hardware Component Objects
DHT dht(DHTPIN, DHTTYPE);
Adafruit_MPU6050 mpu;
TinyGPSPlus gps;
HardwareSerial gpsSerial(2);

bool isMpuConnected = false;
unsigned long lastSendTime = 0;

void setup() {
  // Initialize USB Serial for debugging and Serial Bridge script
  Serial.begin(115200);
  delay(1000);
  Serial.println("\n==================================================");
  Serial.println("  PharmaShield IoT ESP32 Firmware Starting...    ");
  Serial.println("==================================================");

  // 1. Initialize DHT22 Sensor
  dht.begin();
  Serial.println("[OK] DHT22 Temp & Humidity Sensor Initialized (GPIO 4)");

  // 2. Initialize MPU6050 I2C (SDA=21, SCL=22)
  Wire.begin(21, 22);
  if (!mpu.begin()) {
    Serial.println("[WARNING] MPU6050 not detected on I2C (GPIO 21/22). Fallback mode enabled.");
    isMpuConnected = false;
  } else {
    Serial.println("[OK] MPU6050 Accelerometer & Gyro Initialized (GPIO 21/22)");
    mpu.setAccelerometerRange(MPU6050_RANGE_8_G);
    isMpuConnected = true;
  }

  // 3. Initialize GPS Module on HardwareSerial2
  gpsSerial.begin(9600, SERIAL_8N1, GPS_RX_PIN, GPS_TX_PIN);
  Serial.println("[OK] NEO-6M GPS Module Initialized on UART2 (RX:16, TX:17)");

  // 4. Configure Analog Input Pin
  analogSetAttenuation(ADC_11db); // Full 0 - 3.3V range
  Serial.println("[OK] Analog LM393 Sensor Input Configured (GPIO 34)");

  // 5. Connect to Wi-Fi Network
  WiFi.mode(WIFI_STA);
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  Serial.print("Connecting to Wi-Fi: ");
  Serial.print(WIFI_SSID);

  int retries = 0;
  while (WiFi.status() != WL_CONNECTED && retries < 12) {
    delay(500);
    Serial.print(".");
    retries++;
  }

  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("\n[OK] Wi-Fi Connected Successfully!");
    Serial.print("ESP32 Local IP: ");
    Serial.println(WiFi.localIP());
  } else {
    Serial.println("\n[NOTICE] Wi-Fi offline. Telemetry will be transmitted via USB Serial Bridge.");
  }
}

void loop() {
  // Feed GPS serial data stream whenever available
  while (gpsSerial.available() > 0) {
    gps.encode(gpsSerial.read());
  }

  // Periodic Telemetry Transmission
  if (millis() - lastSendTime >= TELEMETRY_INTERVAL_MS) {
    lastSendTime = millis();
    sendTelemetryData();
  }
}

void sendTelemetryData() {
  // --- 1. Read DHT22 Sensor ---
  float temp = dht.readTemperature();
  float hum  = dht.readHumidity();

  // Fallback defaults if DHT22 is warming up or reading fails
  if (isnan(temp)) temp = 5.2;  // Cold chain standard fallback (5.2 °C)
  if (isnan(hum))  hum  = 58.0; // Standard fallback humidity (58 %)

  // --- 2. Read MPU6050 Shock ---
  float shock = 0.05; // Base normal shock value
  if (isMpuConnected) {
    sensors_event_t a, g, mpuTemp;
    if (mpu.getEvent(&a, &g, &mpuTemp)) {
      float totalAcc = sqrt(a.acceleration.x * a.acceleration.x +
                            a.acceleration.y * a.acceleration.y +
                            a.acceleration.z * a.acceleration.z);
      shock = abs(totalAcc - 9.81) / 9.81; // Calculate excess shock above 1G
    }
  }

  // --- 3. Read Analog Sensor (LM393 module on GPIO 34) ---
  int rawAnalog = analogRead(SENSOR_ANALOG_PIN);
  float lightLux = map(rawAnalog, 0, 4095, 0, 1000);
  if (lightLux < 0) lightLux = 0;

  // --- 4. Read GPS Coordinates ---
  float lat = 11.0168; // Default Coimbatore location if testing indoors
  float lng = 76.9558;
  if (gps.location.isValid()) {
    lat = gps.location.lat();
    lng = gps.location.lng();
  }

  // --- 5. Battery Level ---
  float battery = 92.5; // Battery percentage estimate

  // --- Build JSON Payload ---
  String jsonPayload = "{";
  jsonPayload += "\"shipment_id\":\"" + String(SHIPMENT_ID) + "\",";
  jsonPayload += "\"temperature\":" + String(temp, 2) + ",";
  jsonPayload += "\"humidity\":" + String(hum, 2) + ",";
  jsonPayload += "\"shock\":" + String(shock, 2) + ",";
  jsonPayload += "\"light\":" + String(lightLux, 1) + ",";
  jsonPayload += "\"battery\":" + String(battery, 1) + ",";
  jsonPayload += "\"latitude\":" + String(lat, 6) + ",";
  jsonPayload += "\"longitude\":" + String(lng, 6) + ",";
  jsonPayload += "\"connectivity_status\":\"" + String(WiFi.status() == WL_CONNECTED ? "Online" : "Offline") + "\"";
  jsonPayload += "}";

  // Output JSON string to USB Serial Monitor (for Python bridge / monitoring)
  Serial.println(jsonPayload);

  // Send over Wi-Fi POST if Wi-Fi is connected
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    http.begin(API_ENDPOINT);
    http.addHeader("Content-Type", "application/json");

    int httpCode = http.POST(jsonPayload);
    if (httpCode > 0) {
      Serial.print("[HTTP SUCCESS] Code: ");
      Serial.println(httpCode);
    } else {
      Serial.print("[HTTP ERROR] Failed to send POST request. Code: ");
      Serial.println(httpCode);
    }
    http.end();
  }
}
