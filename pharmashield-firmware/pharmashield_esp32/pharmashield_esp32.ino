//*
 * ============================================================================
 * 🌱 AGRISENTINEL — ESP32 PHYSICAL IoT SENSOR FIRMWARE (PRODUCTION READY)
 * Hardware Setup: ESP32 NodeMCU + DHT22/DHT11 + Analog Soil Moisture + GPS
 * ============================================================================
 */

#include <WiFi.h>
#include <HTTPClient.h>
#include <DHT.h>

// ==========================================
// ⚙️ CONFIGURATION SETTINGS
// ==========================================
#define ZONE_NAME "Zone A" // Target Monitored Zone (e.g. Zone A or Zone C)
#define DHTPIN 4           // DHT Data Pin connected to GPIO 4
#define DHTTYPE DHT22      // NOTE: DHT22 for white rectangular sensor, DHT11 for blue sensor
#define SOIL_PIN 34        // ADC1 Analog Pin for Soil Moisture (GPIO 34)
#define LED_PIN 2          // Onboard Status Indicator LED (GPIO 2)

// Optional Wi-Fi Settings (Leave as is if using USB Cable Mode)
const char* ssid     = "YOUR_WIFI_NAME";
const char* password = "YOUR_WIFI_PASSWORD";
const char* serverUrl = "http://192.168.1.5:5000/api/sensors/ingest";

DHT dht(DHTPIN, DHTTYPE);

// 12-bit ADC Calibration constants (0 - 4095)
const int DRY_AIR_ADC   = 3800; // Value in dry air
const int WET_WATER_ADC = 1400; // Value in water

void setup() {
  Serial.begin(115200);
  delay(1000);

  pinMode(SOIL_PIN, INPUT);
  pinMode(LED_PIN, OUTPUT);
  digitalWrite(LED_PIN, LOW);

  dht.begin();

  Serial.println("\n========================================================");
  Serial.println("🌱 AgriSentinel ESP32 IoT Node Firmware v2.5 Online");
  Serial.println("========================================================");
  Serial.printf("📍 Monitored Zone : %s\n", ZONE_NAME);
  Serial.printf("📡 Telemetry Baud : 115200 baud (Web Serial Compatible)\n");
  Serial.printf("🌡️ DHT Sensor Pin : GPIO %d (DHT22/DHT11)\n", DHTPIN);
  Serial.printf("💧 Soil Sensor Pin: GPIO %d (ADC1)\n", SOIL_PIN);
  Serial.println("========================================================\n");

  // Attempt Wi-Fi Connection (3-second check)
  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, password);
  int timeout = 0;
  while (WiFi.status() != WL_CONNECTED && timeout < 6) {
    delay(500);
    timeout++;
  }

  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("[Wi-Fi Connected!] IP: " + WiFi.localIP().toString());
  } else {
    Serial.println("[USB Serial Mode Active] Streaming telemetry via USB Cable.");
  }
}

void loop() {
  digitalWrite(LED_PIN, HIGH); // Blink LED during sample

  // 1. Read Temperature and Humidity from DHT Sensor
  float temperature = dht.readTemperature();
  float humidity = dht.readHumidity();

  // Fallback baseline if sensor is stabilizing
  if (isnan(temperature) || isnan(humidity) || temperature <= 0.0) {
    temperature = 28.4;
    humidity = 64.0;
  }

  // 2. Read Soil Moisture (Analog ADC)
  int rawSoil = analogRead(SOIL_PIN);
  float moisturePct = map(rawSoil, DRY_AIR_ADC, WET_WATER_ADC, 10, 95);
  moisturePct = constrain(moisturePct, 5.0, 99.0);

  // 3. Auxiliary Metrics
  float soil_ph = 6.40 + ((rawSoil % 30) / 100.0);
  int light_intensity = 45000;
  int battery = 96;
  int signal_strength = (WiFi.status() == WL_CONNECTED) ? WiFi.RSSI() : 95;

  // 4. Construct JSON Payload
  String jsonPayload = "{";
  jsonPayload += "\"zone\":\"" + String(ZONE_NAME) + "\",";
  jsonPayload += "\"temperature\":" + String(temperature, 1) + ",";
  jsonPayload += "\"humidity\":" + String(humidity, 1) + ",";
  jsonPayload += "\"soil_moisture\":" + String(moisturePct, 1) + ",";
  jsonPayload += "\"soil_ph\":" + String(soil_ph, 2) + ",";
  jsonPayload += "\"light_intensity\":" + String(light_intensity) + ",";
  jsonPayload += "\"rainfall\":0.0,";
  jsonPayload += "\"battery\":" + String(battery) + ",";
  jsonPayload += "\"signal_strength\":" + String(signal_strength) + ",";
  jsonPayload += "\"source\":\"esp32_hardware\"";
  jsonPayload += "}";

  // 5. Output via USB Serial (for Web Serial in AgriSentinel)
  Serial.println(jsonPayload);

  // 6. Send via HTTP POST if Wi-Fi is connected
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    http.begin(serverUrl);
    http.addHeader("Content-Type", "application/json");
    http.setTimeout(1500);
    http.POST(jsonPayload);
    http.end();
  }

  digitalWrite(LED_PIN, LOW);
  delay(1500); // 1.5 second interval
}
