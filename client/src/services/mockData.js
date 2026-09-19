export const MOCK_SHIPMENTS = [
  {
    id: 1,
    shipment_id: "PHARMA-001",
    product_name: "COVID-19 Vaccine (Pfizer-BioNTech)",
    origin: "Mumbai Hub (BOM)",
    destination: "Coimbatore Medical Center",
    status: "Safe",
    current_temp: 4.2,
    current_humidity: 61.0,
    current_shock: 0.18,
    current_light: 120.0,
    battery_level: 82.0,
    connectivity_status: "Online",
    lat: 11.0168,
    lng: 76.9558,
    updated_at: "2 mins ago"
  },
  {
    id: 2,
    shipment_id: "PHARMA-002",
    product_name: "Insulin Glargine Cold Storage",
    origin: "Hyderabad Biopark",
    destination: "Chennai Apollo Hospital",
    status: "Alert",
    current_temp: 9.5,
    current_humidity: 78.0,
    current_shock: 2.4,
    current_light: 450.0,
    battery_level: 64.0,
    connectivity_status: "Online",
    lat: 12.9716,
    lng: 77.5946,
    updated_at: "5 mins ago"
  },
  {
    id: 3,
    shipment_id: "PHARMA-003",
    product_name: "Monoclonal Antibodies Batch #402",
    origin: "Bengaluru Cold Hub",
    destination: "Kochi Specialist Clinic",
    status: "In Transit",
    current_temp: 3.8,
    current_humidity: 58.0,
    current_shock: 0.12,
    current_light: 95.0,
    battery_level: 91.0,
    connectivity_status: "Online",
    lat: 10.8505,
    lng: 76.2711,
    updated_at: "12 mins ago"
  },
  {
    id: 4,
    shipment_id: "PHARMA-004",
    product_name: "Pediatric Vaccines (Rotavirus)",
    origin: "Delhi Central Depot",
    destination: "Madurai General Hospital",
    status: "Offline",
    current_temp: 5.1,
    current_humidity: 63.0,
    current_shock: 0.25,
    current_light: 110.0,
    battery_level: 44.0,
    connectivity_status: "Offline",
    lat: 9.9252,
    lng: 78.1198,
    updated_at: "1 hour ago"
  },
  {
    id: 5,
    shipment_id: "PHARMA-005",
    product_name: "Blood Plasma Consignment #88",
    origin: "Pune Serum Institute",
    destination: "Tiruchirappalli Blood Bank",
    status: "Delivered",
    current_temp: 4.0,
    current_humidity: 55.0,
    current_shock: 0.08,
    current_light: 80.0,
    battery_level: 98.0,
    connectivity_status: "Online",
    lat: 10.7905,
    lng: 78.7047,
    updated_at: "3 hours ago"
  }
];

export const MOCK_ALERTS = [
  {
    id: 101,
    timestamp: "14:32:10",
    type: "Temperature Excursion",
    shipment_id: "PHARMA-002",
    severity: "Critical",
    message: "Temperature spike to 9.5°C breach of 2°C - 8°C cold chain specification",
    status: "Active"
  },
  {
    id: 102,
    timestamp: "14:15:00",
    type: "Shock Event",
    shipment_id: "PHARMA-002",
    severity: "High",
    message: "Container experienced vertical impact acceleration of 2.4g",
    status: "Active"
  },
  {
    id: 103,
    timestamp: "13:58:44",
    type: "Tamper Detected",
    shipment_id: "PHARMA-002",
    severity: "Critical",
    message: "Optical sensor illuminated at 450 lux indicating hatch breach",
    status: "Active"
  },
  {
    id: 104,
    timestamp: "12:10:05",
    type: "Network Lost",
    shipment_id: "PHARMA-004",
    severity: "Medium",
    message: "Cellular signal drop. Unit buffering sensor data to EEPROM store-and-forward queue",
    status: "Acknowledged"
  },
  {
    id: 105,
    timestamp: "10:45:22",
    type: "Humidity Excursion",
    shipment_id: "PHARMA-003",
    severity: "Low",
    message: "Relative humidity reached 78% (Upper limit 75%)",
    status: "Resolved"
  }
];

export const MOCK_SENSOR_HISTORY = [
  { time: "00:00", temp: 4.1, humidity: 59, shock: 0.1, light: 100 },
  { time: "03:00", temp: 4.3, humidity: 60, shock: 0.1, light: 100 },
  { time: "06:00", temp: 4.0, humidity: 62, shock: 0.2, light: 105 },
  { time: "09:00", temp: 4.5, humidity: 61, shock: 0.1, light: 110 },
  { time: "12:00", temp: 4.8, humidity: 64, shock: 0.4, light: 120 },
  { time: "15:00", temp: 4.2, humidity: 61, shock: 0.18, light: 120 },
  { time: "18:00", temp: 4.1, humidity: 60, shock: 0.1, light: 115 },
  { time: "21:00", temp: 4.0, humidity: 58, shock: 0.1, light: 100 }
];
