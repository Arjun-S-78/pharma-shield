import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import StatsCard from '../components/StatsCard';
import SensorCard from '../components/SensorCard';
import MapWrapper from '../components/MapWrapper';
import StatusBadge from '../components/StatusBadge';
import { Package, CheckCircle2, AlertTriangle, WifiOff, Eye, ArrowRight } from 'lucide-react';
import { fetchDashboardStats, fetchShipments, fetchAlerts } from '../services/api';

export default function Dashboard() {
  const [stats, setStats] = useState({
    active_shipments: 24,
    safe_shipments: 18,
    alert_shipments: 4,
    offline_shipments: 2
  });
  const [shipments, setShipments] = useState([]);
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    async function loadData() {
      const sData = await fetchDashboardStats();
      const shData = await fetchShipments();
      const alData = await fetchAlerts();
      setStats(sData);
      setShipments(shData);
      setAlerts(alData.slice(0, 5));
    }
    loadData();
  }, []);

  return (
    <div className="flex-1 bg-slate-50 min-h-screen">
      <Header title="Consignment Executive Dashboard" />

      <main className="p-6 space-y-6 max-w-7xl mx-auto">
        {/* 1. Stats Cards Row (4 cards) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Active Shipments"
            value={stats.active_shipments}
            icon={Package}
            color="blue"
            subtitle="Cold Chain In-Transit"
          />
          <StatsCard
            title="Safe Shipments"
            value={stats.safe_shipments}
            icon={CheckCircle2}
            color="green"
            subtitle="Within 2.0°C - 8.0°C"
          />
          <StatsCard
            title="Alert Shipments"
            value={stats.alert_shipments}
            icon={AlertTriangle}
            color="red"
            subtitle="Excursions / Tamper"
          />
          <StatsCard
            title="Offline Shipments"
            value={stats.offline_shipments}
            icon={WifiOff}
            color="yellow"
            subtitle="Store & Forward Mode"
          />
        </div>

        {/* 2. Sensor Metrics Cards (6 cards in grid) */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Live Sensor Telemetry (Active Fleet)</h3>
            <span className="text-xs text-blue-600 font-semibold">Auto-refreshing 5s</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <SensorCard type="temperature" value="4.2" />
            <SensorCard type="humidity" value="61" />
            <SensorCard type="shock" value="0.18" />
            <SensorCard type="light" value="120" />
            <SensorCard type="battery" value="82" />
            <SensorCard type="connectivity" value="Online" />
          </div>
        </div>

        {/* 3. Live Map Section (Coimbatore centered) */}
        <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Real-time Geographical Tracking</h3>
              <p className="text-xs text-slate-400">Centered at Coimbatore Hub (11.0168, 76.9558) with active markers</p>
            </div>
            <Link to="/map" className="text-xs font-bold text-[#2C7BE5] hover:underline flex items-center gap-1">
              <span>Full Screen Map</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <MapWrapper shipments={shipments} height="340px" />
        </div>

        {/* 4. Tables Row (Recent Alerts & Active Shipments) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Alerts Table */}
          <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-sm flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-500" />
                <span>Recent Excursion Alerts</span>
              </h3>
              <Link to="/alerts" className="text-xs font-semibold text-[#2C7BE5] hover:underline">
                View All
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 font-bold border-y border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3">Time</th>
                    <th className="py-2.5 px-3">Type</th>
                    <th className="py-2.5 px-3">Shipment</th>
                    <th className="py-2.5 px-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {alerts.map((a) => (
                    <tr key={a.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-2.5 px-3 font-mono text-slate-500">{a.timestamp || "14:32"}</td>
                      <td className="py-2.5 px-3 font-semibold text-slate-800">{a.type}</td>
                      <td className="py-2.5 px-3 font-bold text-[#2C7BE5]">
                        <Link to={`/shipments/${a.shipment_id}`}>{a.shipment_id}</Link>
                      </td>
                      <td className="py-2.5 px-3">
                        <StatusBadge status={a.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Active Shipments Table */}
          <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-sm flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Package className="w-4 h-4 text-[#2C7BE5]" />
                <span>Active Consignments</span>
              </h3>
              <Link to="/shipments" className="text-xs font-semibold text-[#2C7BE5] hover:underline">
                View All
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 font-bold border-y border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3">Shipment ID</th>
                    <th className="py-2.5 px-3">Product</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {shipments.slice(0, 5).map((s) => (
                    <tr key={s.id || s.shipment_id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-2.5 px-3 font-bold text-[#0A2647]">{s.shipment_id}</td>
                      <td className="py-2.5 px-3 font-medium text-slate-700 truncate max-w-[140px]">{s.product_name}</td>
                      <td className="py-2.5 px-3">
                        <StatusBadge status={s.status} />
                      </td>
                      <td className="py-2.5 px-3">
                        <Link
                          to={`/shipments/${s.shipment_id}`}
                          className="inline-flex items-center gap-1 text-[11px] font-bold text-[#2C7BE5] hover:bg-blue-50 px-2 py-1 rounded-lg transition-colors"
                        >
                          <Eye className="w-3 h-3" />
                          <span>Details</span>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
