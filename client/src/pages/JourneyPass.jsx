import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle, 
  MapPin, 
  Truck, 
  Calendar, 
  Clock, 
  Thermometer, 
  Droplets, 
  Activity, 
  Eye, 
  Battery, 
  Wifi, 
  HardDrive, 
  Package, 
  Lock, 
  FileText, 
  Printer, 
  Share2, 
  Copy, 
  Check, 
  ExternalLink, 
  QrCode, 
  RefreshCw, 
  ChevronRight,
  Sparkles,
  Info
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, ReferenceLine } from 'recharts';
import MapWrapper from '../components/MapWrapper';
import { fetchShipmentById, fetchShipments } from '../services/api';
import { getPublicJourneyUrl } from '../services/qrConfig';

export default function JourneyPass() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const queryId = searchParams.get('shipment');
  const targetId = id || queryId || 'PHARMA-001';

  const [shipment, setShipment] = useState(null);
  const [allShipments, setAllShipments] = useState([]);
  const [copied, setCopied] = useState(false);
  const [receiptAcknowledged, setReceiptAcknowledged] = useState(false);
  const [activeTab, setActiveTab] = useState('journey'); // 'journey' | 'telemetry' | 'compliance'

  useEffect(() => {
    async function loadData() {
      const data = await fetchShipmentById(targetId);
      setShipment(data);
      const list = await fetchShipments();
      setAllShipments(list);
    }
    loadData();
  }, [targetId]);

  if (!shipment) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-6 text-white text-center">
        <div className="w-12 h-12 border-4 border-[#2C7BE5] border-t-transparent rounded-full animate-spin mb-4" />
        <h2 className="text-lg font-bold">Verifying Consignment Cryptographic Hash...</h2>
        <p className="text-xs text-slate-400 mt-1">Connecting to PharmaShield IoT Cold-Chain Registry</p>
      </div>
    );
  }

  const isSafe = shipment.status === 'Safe' || shipment.status === 'In Transit' || shipment.status === 'Delivered';

  // Specific detailed journey milestones according to the shipment
  const journeyMilestones = [
    {
      id: 1,
      title: 'Batch Release & Cryo-Vault Manifest Signed',
      location: shipment.origin || 'Mumbai Cold Hub (BOM)',
      time: '2026-09-22 06:30 AM',
      icon: Package,
      status: 'completed',
      tag: 'ORIGIN VAULT',
      details: 'Quality assurance released batch under FDA 21 CFR Part 11 electronic signature. Temperature initialized at 3.8°C.'
    },
    {
      id: 2,
      title: 'Dispatched via Reefer Fleet #MH-12-QX-4019',
      location: 'Primary Cold Logistics Exit',
      time: '2026-09-22 09:15 AM',
      icon: Truck,
      status: 'completed',
      tag: 'HANDOVER',
      details: 'Dual-compressor active reefer container verified. PharmaShield IoT sensor node armed with cryptographic tamper seal.'
    },
    {
      id: 3,
      title: 'Corridor Checkpoint: Expressway Automated RFID',
      location: 'Pune-Bengaluru Transit Corridor',
      time: '2026-09-22 03:45 PM',
      icon: MapPin,
      status: 'completed',
      tag: 'CHECKPOINT',
      details: 'Automated highway RFID & GPS handshake. Container internal: 4.1°C, Humidity: 58%, Vibration: 0.12g.'
    },
    {
      id: 4,
      title: 'Cellular Signal Blindspot Encountered',
      location: 'Western Ghats Sector KM-214',
      time: '2026-09-22 09:10 PM',
      icon: Wifi,
      status: 'completed',
      tag: 'OFFLINE EVENT',
      warning: true,
      details: 'Carrier cellular network unavailable. PharmaShield transponder entered autonomous Store-and-Forward buffering mode.'
    },
    {
      id: 5,
      title: 'Local EEPROM Store & Forward Buffering',
      location: 'Autonomous Non-Volatile Flash Logging',
      time: '2026-09-22 09:10 PM - 11:25 PM',
      icon: HardDrive,
      status: 'completed',
      tag: 'STORE & FORWARD',
      details: '142 consecutive telemetry records (temp, humidity, 3-axis accelerometer) securely written to on-board EEPROM ring buffer.'
    },
    {
      id: 6,
      title: shipment.shipment_id === 'PHARMA-002' 
        ? 'Vertical Shock & Temperature Breach Incident' 
        : 'Transit Shock Absorption (1.8g Peak)',
      location: 'Solapur Highway Sector',
      time: '2026-09-23 01:15 AM',
      icon: AlertTriangle,
      status: 'completed',
      tag: shipment.shipment_id === 'PHARMA-002' ? 'CRITICAL EXCURSION' : 'SHOCK DAMPENED',
      alert: shipment.shipment_id === 'PHARMA-002',
      warning: shipment.shipment_id !== 'PHARMA-002',
      details: shipment.shipment_id === 'PHARMA-002'
        ? 'Major bump caused vertical shock of 2.4g and secondary door seal breach. Internal temperature spiked to 9.5°C.'
        : 'Transient shock impulse 1.8g detected during road bridge transition. Remains within safe tolerance threshold (<2.0g).'
    },
    {
      id: 7,
      title: '5G Connectivity Restored & EEPROM Flush',
      location: 'Bengaluru Smart Corridor Gateway',
      time: '2026-09-23 02:40 AM',
      icon: CheckCircle2,
      status: 'completed',
      tag: 'CLOUD SYNC',
      details: 'Store-and-forward queue verified and synced to PharmaShield cloud database. 142/142 packets intact with zero data loss.'
    },
    {
      id: 8,
      title: 'Intermediate Cold Hub Transfer Audit',
      location: 'Regional Depot Hub #3',
      time: '2026-09-23 07:30 AM',
      icon: ShieldCheck,
      status: 'completed',
      tag: 'DEPOT AUDIT',
      details: 'Physical QR tamper seal and cryptographic hash validated by Regional Depot Inspector. Handover manifest approved.'
    },
    {
      id: 9,
      title: shipment.status === 'Delivered' 
        ? 'Final Delivery Receipt Confirmed' 
        : 'Out for Final Delivery & In Transit',
      location: shipment.destination || 'Coimbatore Medical Center',
      time: shipment.status === 'Delivered' ? '2026-09-23 11:45 AM' : 'Estimated: In 1.5 hours',
      icon: Clock,
      status: shipment.status === 'Delivered' ? 'completed' : 'current',
      tag: shipment.status === 'Delivered' ? 'DELIVERED' : 'FINAL LEG',
      details: shipment.status === 'Delivered'
        ? 'Consignment successfully accepted into destination ultracold repository. Custody transferred to Receiving Pharmacist.'
        : 'Vehicle entering municipal medical zone. Destination cold room alerted for reception handshake.'
    }
  ];

  // Route points
  const routePoints = [
    [19.0760, 72.8777], // Mumbai
    [17.3850, 78.4867], // Hyderabad
    [12.9716, 77.5946], // Bengaluru
    [11.0168, 76.9558]  // Coimbatore
  ];

  // Sensor telemetry chart data
  const telemetryData = [
    { time: '00:00', temp: 3.9, humidity: 59, shock: 0.08, safeMin: 2, safeMax: 8 },
    { time: '03:00', temp: 4.1, humidity: 60, shock: 0.12, safeMin: 2, safeMax: 8 },
    { time: '06:00', temp: 4.0, humidity: 62, shock: 0.14, safeMin: 2, safeMax: 8 },
    { time: '09:00', temp: 4.2, humidity: 61, shock: 0.15, safeMin: 2, safeMax: 8 },
    { time: '12:00', temp: shipment.shipment_id === 'PHARMA-002' ? 8.2 : 4.4, humidity: 63, shock: 0.22, safeMin: 2, safeMax: 8 },
    { time: '15:00', temp: shipment.shipment_id === 'PHARMA-002' ? 9.5 : 4.2, humidity: 61, shock: shipment.shipment_id === 'PHARMA-002' ? 2.4 : 0.18, safeMin: 2, safeMax: 8 },
    { time: '18:00', temp: shipment.shipment_id === 'PHARMA-002' ? 9.1 : 4.1, humidity: 60, shock: 0.15, safeMin: 2, safeMax: 8 },
    { time: '21:00', temp: shipment.current_temp || 4.2, humidity: shipment.current_humidity || 61, shock: shipment.current_shock || 0.18, safeMin: 2, safeMax: 8 }
  ];

  const shareUrl = getPublicJourneyUrl(shipment.shipment_id);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 antialiased font-['Plus_Jakarta_Sans',sans-serif] pb-16 selection:bg-[#2C7BE5] selection:text-white">
      {/* Top Mobile Bar */}
      <header className="sticky top-0 z-50 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-gradient-to-tr from-[#2C7BE5] to-blue-400 rounded-xl shadow-md text-white">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-black text-sm tracking-tight text-white">PharmaShield</span>
              <span className="text-[10px] bg-blue-500/20 text-blue-300 font-bold px-1.5 py-0.5 rounded border border-blue-400/30">
                LIVE PASS
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-medium">Chain of Custody & Journey Trace</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={handleCopyLink}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors border border-slate-700 flex items-center gap-1 text-xs font-semibold"
            title="Copy Public Journey Link"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{copied ? 'Copied' : 'Share'}</span>
          </button>

          <button
            onClick={handlePrint}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors border border-slate-700 flex items-center gap-1 text-xs font-semibold"
            title="Print Official Certificate"
          >
            <Printer className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Print</span>
          </button>

          <Link
            to="/dashboard"
            className="px-2.5 py-2 bg-[#2C7BE5] hover:bg-blue-600 text-white rounded-lg text-xs font-bold transition-all shadow-sm flex items-center gap-1"
          >
            <span>Admin</span>
            <ExternalLink className="w-3 h-3" />
          </Link>
        </div>
      </header>

      {/* Main Content Container */}
      <main className="max-w-4xl mx-auto px-4 pt-5 space-y-5">
        {/* Verification Certificate Hero Card */}
        <div className={`p-5 rounded-2xl border backdrop-blur-md shadow-xl transition-all ${
          isSafe 
            ? 'bg-gradient-to-b from-emerald-950/60 to-slate-900 border-emerald-500/40 shadow-emerald-950/20' 
            : 'bg-gradient-to-b from-rose-950/60 to-slate-900 border-rose-500/40 shadow-rose-950/20'
        }`}>
          {/* Status Badge Ribbon */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <span className={`w-3 h-3 rounded-full ${isSafe ? 'bg-emerald-400 animate-ping' : 'bg-rose-500 animate-pulse'}`} />
              <span className={`text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full border ${
                isSafe 
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40' 
                  : 'bg-rose-500/20 text-rose-300 border-rose-400/40'
              }`}>
                {isSafe ? '✅ Verified Cold-Chain Compliant (2°C - 8°C)' : '⚠️ Excursion Incident Detected (Audit Required)'}
              </span>
            </div>

            <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
              <Clock className="w-3 h-3 text-slate-500" />
              <span>Synced {shipment.updated_at || 'Just now'}</span>
            </span>
          </div>

          {/* Consignment Identity Details */}
          <div className="pt-4 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="text-[11px] font-bold tracking-widest text-[#2C7BE5] uppercase">
                  Consignment Pass UID
                </span>
                <div className="flex items-center gap-2 mt-0.5">
                  <h1 className="text-2xl font-black text-white tracking-tight">{shipment.shipment_id}</h1>
                  <span className="px-2 py-0.5 bg-blue-500/10 text-blue-400 text-xs font-bold rounded border border-blue-500/20">
                    IoT Node Active
                  </span>
                </div>
              </div>

              <div className="sm:text-right">
                <span className="text-[10px] text-slate-400 block uppercase font-semibold">FDA 21 CFR Part 11 Cert</span>
                <span className="font-mono text-xs text-emerald-400 font-bold bg-slate-800/80 px-2 py-1 rounded border border-slate-700 inline-block mt-0.5">
                  #SHA-256: 7f8c9b2...4e01
                </span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-2">
              <div className="text-sm font-extrabold text-white flex items-center gap-2">
                <Package className="w-4 h-4 text-[#2C7BE5]" />
                <span>{shipment.product_name}</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2 border-t border-slate-700/50 text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">Batch Number</span>
                  <span className="font-mono font-bold text-slate-200">BN-2026-COV-8941</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">Specification Band</span>
                  <span className="font-bold text-emerald-400">2.0°C - 8.0°C (WHO-PQS)</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">Expiry Date</span>
                  <span className="font-mono text-slate-300 font-semibold">2027-03-31</span>
                </div>
              </div>
            </div>

            {/* Origin & Destination Transit Corridor */}
            <div className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-700/40 flex items-center justify-between text-xs gap-3">
              <div className="flex-1">
                <span className="text-[10px] text-slate-400 uppercase font-semibold flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-emerald-400" /> Origin
                </span>
                <span className="font-bold text-slate-200 block text-sm mt-0.5">{shipment.origin}</span>
                <span className="text-[10px] text-slate-400">Departed Sep 22, 09:15 AM</span>
              </div>

              <div className="flex flex-col items-center justify-center px-2">
                <div className="w-16 sm:w-28 h-0.5 bg-gradient-to-r from-emerald-400 via-blue-400 to-purple-400 relative">
                  <Truck className="w-4 h-4 text-[#2C7BE5] absolute -top-2 left-1/2 -translate-x-1/2 animate-pulse" />
                </div>
                <span className="text-[9px] text-blue-300 font-bold uppercase mt-1">78% Completed</span>
              </div>

              <div className="flex-1 text-right">
                <span className="text-[10px] text-slate-400 uppercase font-semibold flex items-center justify-end gap-1">
                  Destination <MapPin className="w-3 h-3 text-purple-400" />
                </span>
                <span className="font-bold text-slate-200 block text-sm mt-0.5">{shipment.destination}</span>
                <span className="text-[10px] text-slate-400">ETA: In 1.5 Hours</span>
              </div>
            </div>
          </div>
        </div>

        {/* Real-time Environmental Telemetry Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {/* Temperature */}
          <div className="p-3.5 rounded-xl bg-slate-800/70 border border-slate-700 shadow-md flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span className="font-semibold text-[11px] uppercase">Temperature</span>
              <Thermometer className={`w-4 h-4 ${isSafe ? 'text-emerald-400' : 'text-rose-400'}`} />
            </div>
            <div className="mt-2">
              <span className={`text-2xl font-black ${isSafe ? 'text-emerald-400' : 'text-rose-400'}`}>
                {shipment.current_temp || 4.2}°C
              </span>
              <span className="text-[10px] text-slate-400 block font-medium mt-0.5">Target: 2.0°C - 8.0°C</span>
            </div>
          </div>

          {/* Humidity */}
          <div className="p-3.5 rounded-xl bg-slate-800/70 border border-slate-700 shadow-md flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span className="font-semibold text-[11px] uppercase">Humidity</span>
              <Droplets className="w-4 h-4 text-blue-400" />
            </div>
            <div className="mt-2">
              <span className="text-2xl font-black text-blue-400">
                {shipment.current_humidity || 61.0}%
              </span>
              <span className="text-[10px] text-slate-400 block font-medium mt-0.5">Target: &lt; 65% RH</span>
            </div>
          </div>

          {/* Shock / Accelerometer */}
          <div className="p-3.5 rounded-xl bg-slate-800/70 border border-slate-700 shadow-md flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span className="font-semibold text-[11px] uppercase">Shock Impulse</span>
              <Activity className={`w-4 h-4 ${(shipment.current_shock || 0.18) > 2.0 ? 'text-rose-400' : 'text-emerald-400'}`} />
            </div>
            <div className="mt-2">
              <span className={`text-2xl font-black ${(shipment.current_shock || 0.18) > 2.0 ? 'text-rose-400' : 'text-slate-100'}`}>
                {shipment.current_shock || 0.18}g
              </span>
              <span className="text-[10px] text-slate-400 block font-medium mt-0.5">Max Threshold: 2.0g</span>
            </div>
          </div>

          {/* IoT Node Battery & Signal */}
          <div className="p-3.5 rounded-xl bg-slate-800/70 border border-slate-700 shadow-md flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span className="font-semibold text-[11px] uppercase">Battery & Link</span>
              <Battery className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="mt-2">
              <div className="flex items-center gap-1.5">
                <span className="text-2xl font-black text-slate-100">{shipment.battery_level || 82}%</span>
                <span className="text-[10px] px-1.5 py-0.5 bg-emerald-500/20 text-emerald-400 font-bold rounded">5G</span>
              </div>
              <span className="text-[10px] text-slate-400 block font-medium mt-0.5">EEPROM Ring: Synchronized</span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center bg-slate-800/80 p-1 rounded-xl border border-slate-700/80 text-xs font-bold">
          <button
            onClick={() => setActiveTab('journey')}
            className={`flex-1 py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'journey'
                ? 'bg-[#2C7BE5] text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Truck className="w-3.5 h-3.5" />
            <span>Entire Journey ({journeyMilestones.length} Events)</span>
          </button>

          <button
            onClick={() => setActiveTab('telemetry')}
            className={`flex-1 py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'telemetry'
                ? 'bg-[#2C7BE5] text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Thermometer className="w-3.5 h-3.5" />
            <span>Thermal Curve</span>
          </button>

          <button
            onClick={() => setActiveTab('compliance')}
            className={`flex-1 py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'compliance'
                ? 'bg-[#2C7BE5] text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Audit & Sign-off</span>
          </button>
        </div>

        {/* TAB 1: Entire Journey Timeline & Corridor Map */}
        {activeTab === 'journey' && (
          <div className="space-y-5">
            {/* Transit Corridor Map */}
            <div className="bg-slate-800/80 rounded-2xl p-4 border border-slate-700 shadow-md space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#2C7BE5]" />
                  <h3 className="font-bold text-sm text-white">Live Transit Corridor Map</h3>
                </div>
                <span className="text-[11px] text-blue-300 font-mono">Current GPS: 11.0168° N, 76.9558° E</span>
              </div>
              <MapWrapper shipments={[shipment]} routePoints={routePoints} height="280px" />
            </div>

            {/* Complete Milestone Audit Trail */}
            <div className="bg-slate-800/80 rounded-2xl p-5 border border-slate-700 shadow-md space-y-4">
              <div className="flex items-center justify-between border-b border-slate-700/80 pb-3">
                <div>
                  <h3 className="font-extrabold text-sm text-white">Consignment Milestones & Audit Trail</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Chronological end-to-end custody events and sensor telemetry</p>
                </div>
                <span className="text-xs px-2.5 py-1 bg-emerald-500/20 text-emerald-300 font-bold rounded-lg border border-emerald-400/30">
                  {journeyMilestones.length} Events Logged
                </span>
              </div>

              {/* Timeline Items */}
              <div className="relative pl-6 space-y-5 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-700">
                {journeyMilestones.map((m, i) => {
                  const Icon = m.icon;
                  const isCurrent = m.status === 'current';
                  return (
                    <div key={m.id} className="relative flex items-start gap-3">
                      {/* Timeline Dot / Icon */}
                      <div className={`absolute -left-6 p-1.5 rounded-full border shadow-sm ${
                        m.alert
                          ? 'bg-rose-500 text-white border-rose-300'
                          : m.warning
                          ? 'bg-amber-500 text-white border-amber-300'
                          : isCurrent
                          ? 'bg-[#2C7BE5] text-white border-blue-300 animate-pulse'
                          : 'bg-slate-700 text-blue-300 border-slate-600'
                      }`}>
                        <Icon className="w-3.5 h-3.5" />
                      </div>

                      {/* Content Box */}
                      <div className={`flex-1 p-3.5 rounded-xl border transition-all ${
                        isCurrent 
                          ? 'bg-blue-950/40 border-blue-500/50 shadow-md' 
                          : m.alert 
                          ? 'bg-rose-950/30 border-rose-500/40' 
                          : 'bg-slate-850/60 bg-slate-800/40 border-slate-700/60 hover:border-slate-600'
                      }`}>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                          <div className="flex items-center gap-2">
                            <h4 className="text-xs font-bold text-white">{m.title}</h4>
                            <span className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded ${
                              m.alert 
                                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' 
                                : m.warning 
                                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                : isCurrent 
                                ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30 animate-pulse' 
                                : 'bg-slate-700 text-slate-300'
                            }`}>
                              {m.tag}
                            </span>
                          </div>
                          <span className="text-[10px] font-mono text-slate-400">{m.time}</span>
                        </div>

                        <div className="text-[11px] text-slate-400 flex items-center gap-1.5 mb-1.5">
                          <MapPin className="w-3 h-3 text-slate-500" />
                          <span>{m.location}</span>
                        </div>

                        <p className="text-xs text-slate-300 leading-relaxed font-normal bg-slate-900/50 p-2.5 rounded-lg border border-slate-800">
                          {m.details}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: Thermal Curve & Sensor Chart */}
        {activeTab === 'telemetry' && (
          <div className="space-y-5">
            <div className="bg-slate-800/80 rounded-2xl p-5 border border-slate-700 shadow-md space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-700/80 pb-3">
                <div>
                  <h3 className="font-extrabold text-sm text-white">Thermal Excursion Audit Graph</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Continuous core temperature logger readings vs WHO-PQS 2°C - 8°C boundaries</p>
                </div>
                <div className="flex items-center gap-3 text-xs">
                  <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" /> Safe Zone (2-8°C)
                  </span>
                  <span className="flex items-center gap-1.5 text-[#2C7BE5] font-semibold">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#2C7BE5]" /> Actual Temperature
                  </span>
                </div>
              </div>

              {/* Chart Container */}
              <div className="h-64 w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={telemetryData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={isSafe ? "#10B981" : "#EF4444"} stopOpacity={0.4}/>
                        <stop offset="95%" stopColor={isSafe ? "#10B981" : "#EF4444"} stopOpacity={0.0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="time" stroke="#64748B" fontSize={11} tickLine={false} />
                    <YAxis domain={[0, 12]} stroke="#64748B" fontSize={11} unit="°C" tickLine={false} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                      formatter={(val) => [`${val}°C`, 'Core Temp']}
                    />
                    <ReferenceLine y={2} stroke="#10B981" strokeDasharray="3 3" label={{ value: 'Min 2°C', fill: '#10B981', fontSize: 10 }} />
                    <ReferenceLine y={8} stroke="#10B981" strokeDasharray="3 3" label={{ value: 'Max 8°C', fill: '#10B981', fontSize: 10 }} />
                    <Area 
                      type="monotone" 
                      dataKey="temp" 
                      stroke={isSafe ? "#10B981" : "#EF4444"} 
                      strokeWidth={3} 
                      fillOpacity={1} 
                      fill="url(#tempGradient)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 text-center text-xs">
                <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-700/60">
                  <span className="text-[10px] text-slate-400 block uppercase font-semibold">Min Temp Logged</span>
                  <span className="font-extrabold text-sm text-slate-200">3.9°C</span>
                </div>
                <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-700/60">
                  <span className="text-[10px] text-slate-400 block uppercase font-semibold">Max Temp Logged</span>
                  <span className={`font-extrabold text-sm ${isSafe ? 'text-slate-200' : 'text-rose-400'}`}>
                    {shipment.shipment_id === 'PHARMA-002' ? '9.5°C' : '4.4°C'}
                  </span>
                </div>
                <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-700/60">
                  <span className="text-[10px] text-slate-400 block uppercase font-semibold">MKT (Mean Kinetic Temp)</span>
                  <span className="font-extrabold text-sm text-emerald-400">4.12°C</span>
                </div>
                <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-700/60">
                  <span className="text-[10px] text-slate-400 block uppercase font-semibold">Offline Buffered Frames</span>
                  <span className="font-extrabold text-sm text-blue-400">142 Frames</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: Digital Compliance & Custody Handover */}
        {activeTab === 'compliance' && (
          <div className="space-y-5">
            <div className="bg-slate-800/80 rounded-2xl p-5 border border-slate-700 shadow-md space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-700/80 pb-3">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <h3 className="font-extrabold text-sm text-white">FDA 21 CFR Part 11 Electronic Certificate</h3>
              </div>

              <div className="space-y-3 text-xs">
                <div className="p-3 bg-slate-900/70 rounded-xl border border-slate-700/60 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-semibold uppercase">Certificate Serial</span>
                    <span className="font-mono font-bold text-slate-200 text-sm">CERT-FDA-2026-99420</span>
                  </div>
                  <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-300 font-bold rounded-lg border border-emerald-400/30">
                    VALID & SEALED
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="bg-slate-900/70 p-3 rounded-xl border border-slate-700/60 space-y-1">
                    <span className="text-[10px] text-slate-400 block font-semibold uppercase">Cryptographic Signature</span>
                    <span className="font-mono text-[11px] text-slate-300 break-all">
                      SHA256: 4a9f81d3e204b77918a24c5b36e89012fefc2a11b6
                    </span>
                  </div>

                  <div className="bg-slate-900/70 p-3 rounded-xl border border-slate-700/60 space-y-1">
                    <span className="text-[10px] text-slate-400 block font-semibold uppercase">Verified Hardware Logger</span>
                    <span className="font-mono text-[11px] text-emerald-400 font-bold">
                      ESP32-S3-FIRMWARE-V2.4.1 (Hardware Root of Trust)
                    </span>
                  </div>
                </div>

                {/* Handover Signoff */}
                <div className="p-4 bg-slate-900/90 rounded-xl border border-slate-700 space-y-3">
                  <h4 className="font-bold text-white text-xs uppercase flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-blue-400" />
                    <span>Destination Hospital Custody Handover</span>
                  </h4>

                  {receiptAcknowledged ? (
                    <div className="p-3 bg-emerald-500/20 border border-emerald-400/40 rounded-xl flex items-center gap-3">
                      <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
                      <div>
                        <span className="font-extrabold text-emerald-300 text-xs block">
                          Delivery Accepted & Stored in Ultracold Vault
                        </span>
                        <span className="text-[10px] text-slate-300">
                          Digital sign-off timestamp: {new Date().toLocaleTimeString()} by Mobile Receiver
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <p className="text-slate-300 text-xs">
                        By confirming receipt on this mobile device, you verify the physical seal is intact and accept custody into Coimbatore Medical Center cold repository.
                      </p>
                      <button
                        onClick={() => setReceiptAcknowledged(true)}
                        className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold rounded-xl text-xs transition-all shadow-md flex items-center justify-center gap-2"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Acknowledge Delivery & Confirm Cold-Chain Intact</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Quick Switch Consignment Pass */}
        <div className="bg-slate-800/50 rounded-2xl p-4 border border-slate-700/60 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-300 flex items-center gap-1.5">
              <QrCode className="w-3.5 h-3.5 text-[#2C7BE5]" />
              <span>Switch Consignment Pass</span>
            </span>
            <span className="text-[10px] text-slate-400">Tap to inspect other consignments</span>
          </div>

          <div className="flex flex-wrap gap-2">
            {allShipments.map((s) => (
              <Link
                key={s.shipment_id}
                to={`/journey/${s.shipment_id}`}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 border ${
                  s.shipment_id === shipment.shipment_id
                    ? 'bg-[#2C7BE5] text-white border-blue-400 shadow-sm'
                    : 'bg-slate-850 bg-slate-800 text-slate-300 border-slate-700 hover:border-slate-500'
                }`}
              >
                <span>{s.shipment_id}</span>
                <span className={`w-2 h-2 rounded-full ${s.status === 'Safe' ? 'bg-emerald-400' : s.status === 'Alert' ? 'bg-rose-400' : 'bg-amber-400'}`} />
              </Link>
            ))}
          </div>
        </div>

        {/* Mobile Scanned Confirmation Footer */}
        <footer className="text-center pt-2 pb-6 text-slate-500 text-[11px] space-y-1">
          <p className="flex items-center justify-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
            <span>PharmaShield IoT Cold Chain Logistics &bull; WHO-PQS Compliant</span>
          </p>
          <p className="font-mono text-[10px]">Scanned via Mobile Device Camera &bull; Secure Protocol Active</p>
        </footer>
      </main>
    </div>
  );
}
