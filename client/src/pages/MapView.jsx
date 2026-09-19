import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import MapWrapper from '../components/MapWrapper';
import { Filter, Layers, Navigation } from 'lucide-react';
import { fetchShipments } from '../services/api';

export default function MapView() {
  const [shipments, setShipments] = useState([]);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    async function load() {
      const data = await fetchShipments();
      setShipments(data);
    }
    load();
  }, []);

  const filtered = shipments.filter(s => filter === 'All' || s.status.toLowerCase() === filter.toLowerCase());

  const sampleRoute = [
    [19.0760, 72.8777],
    [17.3850, 78.4867],
    [12.9716, 77.5946],
    [11.0168, 76.9558]
  ];

  return (
    <div className="flex-1 bg-slate-50 min-h-screen flex flex-col">
      <Header title="Fleet Geographic Intelligence Map" />

      <main className="p-6 flex-1 flex flex-col max-w-7xl mx-auto w-full space-y-4">
        {/* Map Header Overlay Filter */}
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Navigation className="w-5 h-5 text-[#2C7BE5]" />
            <div>
              <h3 className="text-sm font-bold text-slate-900">Live Geo-Location Telemetry</h3>
              <p className="text-xs text-slate-400">Coimbatore Hub Corridor • GPS & LBS Triangulation</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Filter className="w-4 h-4 text-slate-400" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700 rounded-xl px-3 py-2"
            >
              <option value="All">All Status Pins</option>
              <option value="Safe">Safe Only (Green)</option>
              <option value="Alert">Alert Only (Red)</option>
              <option value="Offline">Offline Only (Yellow)</option>
            </select>
          </div>
        </div>

        {/* Full-height Leaflet Map Container */}
        <div className="flex-1 min-h-[550px]">
          <MapWrapper shipments={filtered} routePoints={sampleRoute} height="100%" />
        </div>
      </main>
    </div>
  );
}
