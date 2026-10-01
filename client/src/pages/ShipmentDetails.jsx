import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '../components/Header';
import SensorCard from '../components/SensorCard';
import MapWrapper from '../components/MapWrapper';
import StatusBadge from '../components/StatusBadge';
import ChartWrapper from '../components/ChartWrapper';
import { QRCodeSVG } from 'qrcode.react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ReferenceLine 
} from 'recharts';
import { 
  ArrowLeft, 
  MapPin, 
  Calendar, 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  Wifi, 
  HardDrive, 
  Truck, 
  QrCode, 
  Download 
} from 'lucide-react';
import { fetchShipmentById } from '../services/api';
import { MOCK_SENSOR_HISTORY } from '../services/mockData';
import QRPassModal from '../components/QRPassModal';
import { getPublicJourneyUrl } from '../services/qrConfig';

export default function ShipmentDetails() {
  const { id } = useParams();
  const [shipment, setShipment] = useState(null);

  useEffect(() => {
    async function load() {
      const data = await fetchShipmentById(id || 'PHARMA-001');
      setShipment(data);
    }
    load();
  }, [id]);

  if (!shipment) return null;

  const routePolyline = [
    [19.0760, 72.8777], // Mumbai
    [17.3850, 78.4867], // Hyderabad
    [12.9716, 77.5946], // Bengaluru
    [11.0168, 76.9558]  // Coimbatore
  ];

  const timelineEvents = [
    { title: 'Shipment Manifest Created', time: '2 days ago', icon: CheckCircle, color: 'text-emerald-500 bg-emerald-50' },
    { title: 'Departed Central Cold Hub', time: '1 day, 8 hours ago', icon: Truck, color: 'text-blue-500 bg-blue-50' },
    { title: 'GPS Location Update (NH-44)', time: '3 hours ago', icon: MapPin, color: 'text-[#2C7BE5] bg-blue-50' },
    { title: 'Cellular Network Lost', time: '2 hours ago', icon: Wifi, color: 'text-amber-500 bg-amber-50', warning: true },
    { title: 'Local EEPROM Store & Forward Buffering', time: '2 hours ago', icon: HardDrive, color: 'text-slate-600 bg-slate-100' },
    { title: 'Vertical Shock Acceleration Peak 2.4g', time: '1 hour ago', icon: AlertTriangle, color: 'text-rose-500 bg-rose-50', alert: true },
    { title: 'Network Connection Restored', time: '30 mins ago', icon: Wifi, color: 'text-emerald-500 bg-emerald-50' },
    { title: 'Store-and-Forward Telemetry Synced', time: '25 mins ago', icon: CheckCircle, color: 'text-blue-600 bg-blue-50' },
    { title: 'Estimated Delivery (Coimbatore Medical Center)', time: 'In 4 hours', icon: Clock, color: 'text-purple-500 bg-purple-50' }
  ];

  const qrVerifyUrl = `${window.location.origin}/qr-verification?shipment=${shipment.shipment_id}`;

  return (
    <div className="flex-1 bg-slate-50 min-h-screen">
      <Header title={`Consignment Audit: ${shipment.shipment_id}`} />

      <main className="p-6 space-y-6 max-w-7xl mx-auto">
        {/* Back Link & Header Card */}
        <div className="bg-white rounded-xl p-6 border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <Link to="/shipments" className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-[#2C7BE5] transition-colors">
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Directory</span>
            </Link>
            <StatusBadge status={shipment.status} />
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-t pt-4 border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-extrabold text-slate-900">{shipment.shipment_id}</span>
                <span className="text-xs px-2.5 py-1 bg-blue-50 text-[#2C7BE5] font-bold rounded-lg border border-blue-200">
                  {shipment.product_name}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1 flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span>Origin: <strong>{shipment.origin}</strong> ➔ Destination: <strong>{shipment.destination}</strong></span>
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button 
                onClick={() => window.print()}
                className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                <span>Export Audit PDF</span>
              </button>
            </div>
          </div>
        </div>

        {/* 2. Live Sensor Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <SensorCard type="temperature" value={shipment.current_temp} />
          <SensorCard type="humidity" value={shipment.current_humidity} />
          <SensorCard type="shock" value={shipment.current_shock} />
          <SensorCard type="light" value={shipment.current_light} />
          <SensorCard type="battery" value={shipment.battery_level} />
          <SensorCard type="connectivity" value={shipment.connectivity_status} />
        </div>

        {/* 3. Recharts Time-Series Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Temp Line Chart */}
          <ChartWrapper title="Temperature Profile (24h)" subtitle="Upper Limit: 8°C | Lower Limit: 2°C">
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={MOCK_SENSOR_HISTORY}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="time" stroke="#94A3B8" fontSize={11} />
                <YAxis domain={[0, 10]} stroke="#94A3B8" fontSize={11} />
                <Tooltip />
                <ReferenceLine y={8} stroke="#EF4444" strokeDasharray="4 4" label={{ value: "Max 8°C", fill: "#EF4444", fontSize: 10 }} />
                <ReferenceLine y={2} stroke="#3B82F6" strokeDasharray="4 4" label={{ value: "Min 2°C", fill: "#3B82F6", fontSize: 10 }} />
                <Line type="monotone" dataKey="temp" stroke="#2C7BE5" strokeWidth={3} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </ChartWrapper>

          {/* Humidity Line Chart */}
          <ChartWrapper title="Relative Humidity (%)" subtitle="Upper Spec: 75% | Lower Spec: 30%">
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={MOCK_SENSOR_HISTORY}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="time" stroke="#94A3B8" fontSize={11} />
                <YAxis domain={[20, 90]} stroke="#94A3B8" fontSize={11} />
                <Tooltip />
                <ReferenceLine y={75} stroke="#F59E0B" strokeDasharray="4 4" />
                <ReferenceLine y={30} stroke="#10B981" strokeDasharray="4 4" />
                <Line type="monotone" dataKey="humidity" stroke="#10B981" strokeWidth={3} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </ChartWrapper>

          {/* Shock Events Bar Chart */}
          <ChartWrapper title="Impact & Vibration (g-force)" subtitle="Threshold Limit: 2.0g">
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={MOCK_SENSOR_HISTORY}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="time" stroke="#94A3B8" fontSize={11} />
                <YAxis domain={[0, 3]} stroke="#94A3B8" fontSize={11} />
                <Tooltip />
                <ReferenceLine y={2.0} stroke="#EF4444" strokeDasharray="4 4" />
                <Bar dataKey="shock" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartWrapper>
        </div>

        {/* 4. Map & Route Polyline Section */}
        <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-sm space-y-3">
          <h3 className="font-bold text-slate-900 text-sm">Consignment Transit Corridor Map</h3>
          <MapWrapper shipments={[shipment]} routePoints={routePolyline} height="360px" />
        </div>

        {/* 5. Journey Timeline & QR Code Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Journey Timeline */}
          <div className="lg:col-span-2 bg-white rounded-xl p-6 border border-slate-200/80 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-900 text-sm">Audit Trail & Telemetry Timeline</h3>
            <div className="relative pl-6 space-y-6 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
              {timelineEvents.map((ev, i) => {
                const Icon = ev.icon;
                return (
                  <div key={i} className="relative flex items-start gap-4">
                    <div className={`absolute -left-6 p-1.5 rounded-full border border-white shadow-sm ${ev.color}`}>
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 flex-1 flex items-center justify-between">
                      <div>
                        <h4 className="text-xs font-bold text-slate-800">{ev.title}</h4>
                        <span className="text-[11px] text-slate-400 font-medium">{ev.time}</span>
                      </div>
                      {ev.alert && <span className="text-[10px] bg-rose-100 text-rose-700 font-extrabold px-2 py-0.5 rounded">ALERT</span>}
                      {ev.warning && <span className="text-[10px] bg-amber-100 text-amber-700 font-extrabold px-2 py-0.5 rounded">WARN</span>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* QR Code Verification Section */}
          <div className="lg:col-span-1">
            <QRPassModal
              shipmentId={shipment.shipment_id}
              productName={shipment.product_name}
              isInline={true}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
