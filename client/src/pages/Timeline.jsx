import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import StatusBadge from '../components/StatusBadge';
import { 
  GitCommit, 
  Package, 
  Truck, 
  MapPin, 
  Wifi, 
  HardDrive, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  ChevronDown, 
  ChevronUp 
} from 'lucide-react';
import { fetchShipments } from '../services/api';

export default function Timeline() {
  const [shipments, setShipments] = useState([]);
  const [selectedId, setSelectedId] = useState('PHARMA-001');
  const [expandedEvent, setExpandedEvent] = useState(null);

  useEffect(() => {
    async function load() {
      const data = await fetchShipments();
      setShipments(data);
    }
    load();
  }, []);

  const currentShipment = shipments.find(s => s.shipment_id === selectedId) || shipments[0] || {
    shipment_id: 'PHARMA-001',
    product_name: 'COVID-19 Vaccine (Pfizer-BioNTech)',
    origin: 'Mumbai Hub',
    destination: 'Coimbatore Medical Center',
    status: 'Safe'
  };

  const timelineEvents = [
    {
      id: 1,
      title: 'Consignment Created & Manifest Registered',
      time: '2026-09-06 08:30 AM',
      icon: Package,
      color: 'text-blue-600 bg-blue-50 border-blue-200',
      details: 'Manufacturer digital signature verified. Temperature logger calibrated to 4.0°C target.'
    },
    {
      id: 2,
      title: 'Departed Primary Cold Storage Warehouse',
      time: '2026-09-06 11:00 AM',
      icon: Truck,
      color: 'text-purple-600 bg-purple-50 border-purple-200',
      details: 'Vehicle reefer unit operational. Sensor handshake established with cellular gateway.'
    },
    {
      id: 3,
      title: 'Checkpoint Waypoint: Bengaluru Distribution Hub',
      time: '2026-09-07 04:15 PM',
      icon: MapPin,
      color: 'text-blue-600 bg-blue-50 border-blue-200',
      details: 'GPS coordinates verified. Ambient temperature 26°C, internal container holding steady at 4.1°C.'
    },
    {
      id: 4,
      title: 'Cellular Signal Lost (Blindspot Zone)',
      time: '2026-09-07 10:40 PM',
      icon: Wifi,
      color: 'text-amber-600 bg-amber-50 border-amber-200',
      details: 'Transponder switched to store-and-forward mode. Telemetry records buffered in non-volatile flash memory.',
      badge: 'OFFLINE BUFFER'
    },
    {
      id: 5,
      title: 'Offline Data Logging (Store-and-Forward)',
      time: '2026-09-07 11:15 PM',
      icon: HardDrive,
      color: 'text-slate-600 bg-slate-100 border-slate-200',
      details: '120 telemetry frames logged locally at 30-second intervals.'
    },
    {
      id: 6,
      title: 'Transitory Impact Acceleration (1.8g Logged)',
      time: '2026-09-08 01:20 AM',
      icon: AlertTriangle,
      color: 'text-rose-600 bg-rose-50 border-rose-200',
      details: 'Axis Z shock impulse detected during road bump. Remained below 2.0g damage threshold.',
      badge: 'SHOCK LOG'
    },
    {
      id: 7,
      title: '5G Connectivity Restored & Batch Sync Completed',
      time: '2026-09-08 02:00 AM',
      icon: CheckCircle2,
      color: 'text-emerald-600 bg-emerald-50 border-emerald-200',
      details: 'Store-and-forward queue flushed to PharmaShield cloud backend. Zero data loss confirmed.'
    },
    {
      id: 8,
      title: 'Final Transit Phase (Approaching Coimbatore)',
      time: '2026-09-08 07:00 AM',
      icon: Clock,
      color: 'text-indigo-600 bg-indigo-50 border-indigo-200',
      details: 'Reefer battery at 82%. Estimated arrival at destination in 4 hours.'
    }
  ];

  return (
    <div className="flex-1 bg-slate-50 min-h-screen">
      <Header title="Consignment Journey Timeline & Audit Log" />

      <main className="p-6 space-y-6 max-w-5xl mx-auto">
        {/* Shipment Selector */}
        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-50 text-[#2C7BE5] rounded-xl border border-blue-200">
              <GitCommit className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Select Consignment Audit</h3>
              <p className="text-xs text-slate-400">View complete historical store-and-forward telemetry sequence</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <select
              value={selectedId}
              onChange={(e) => setSelectedId(e.target.value)}
              className="bg-slate-50 border border-slate-200 text-xs font-extrabold text-slate-800 rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#2C7BE5]"
            >
              {shipments.map(s => (
                <option key={s.shipment_id} value={s.shipment_id}>
                  {s.shipment_id} - {s.product_name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Selected Shipment Summary Card */}
        <div className="bg-[#0A2647] text-white p-6 rounded-2xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xl font-black">{currentShipment.shipment_id}</span>
              <StatusBadge status={currentShipment.status} />
            </div>
            <p className="text-xs text-blue-200 font-medium">{currentShipment.product_name}</p>
            <p className="text-xs text-slate-300 mt-2">
              Route: <strong>{currentShipment.origin}</strong> ➔ <strong>{currentShipment.destination}</strong>
            </p>
          </div>

          <div className="flex items-center gap-4 border-t md:border-t-0 md:border-l pt-3 md:pt-0 md:pl-6 border-slate-700/80 text-xs text-slate-300">
            <div>
              <span className="text-[10px] uppercase font-bold text-blue-300 block">Temperature</span>
              <span className="text-lg font-bold text-white">{currentShipment.current_temp || 4.2}°C</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-blue-300 block">Battery</span>
              <span className="text-lg font-bold text-white">{currentShipment.battery_level || 82}%</span>
            </div>
          </div>
        </div>

        {/* Timeline Events List */}
        <div className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-sm space-y-6">
          <h3 className="font-extrabold text-slate-900 text-base">Interactive Journey Chronology</h3>

          <div className="relative pl-8 space-y-6 before:absolute before:left-4 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
            {timelineEvents.map((ev) => {
              const Icon = ev.icon;
              const isExpanded = expandedEvent === ev.id;

              return (
                <div key={ev.id} className="relative group">
                  {/* Icon Bullet */}
                  <div className={`absolute -left-8 top-1 p-2 rounded-full border shadow-sm ${ev.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>

                  {/* Card Content */}
                  <div className="bg-slate-50 hover:bg-slate-100/80 transition-colors p-4 rounded-xl border border-slate-200/60 cursor-pointer" onClick={() => setExpandedEvent(isExpanded ? null : ev.id)}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-slate-800 text-xs sm:text-sm">{ev.title}</h4>
                        {ev.badge && (
                          <span className="text-[9px] font-black px-2 py-0.5 rounded bg-slate-200 text-slate-700">
                            {ev.badge}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-mono text-slate-400">{ev.time}</span>
                        {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="mt-3 pt-3 border-t border-slate-200 text-xs text-slate-600 space-y-1 animate-fade-in">
                        <p className="font-medium">{ev.details}</p>
                        <p className="text-[11px] text-slate-400">Verified by PharmaShield Transponder Cryptographic Hash #0x8F9A</p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}
