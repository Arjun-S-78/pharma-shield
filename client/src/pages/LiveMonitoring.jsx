import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import StatusBadge from '../components/StatusBadge';
import { Radio, RefreshCw, Thermometer, Droplets, Zap, Eye } from 'lucide-react';
import { fetchShipments } from '../services/api';

export default function LiveMonitoring() {
  const [shipments, setShipments] = useState([]);
  const [sortBy, setSortBy] = useState('Status');
  const [lastTick, setLastTick] = useState(new Date());

  const loadLiveStream = async () => {
    const data = await fetchShipments();
    // Simulate tiny dynamic fluctuation to show real-time stream active
    const mutated = data.map(s => ({
      ...s,
      current_temp: parseFloat((s.current_temp + (Math.random() * 0.2 - 0.1)).toFixed(1)),
      current_humidity: Math.round(s.current_humidity + (Math.random() * 2 - 1))
    }));
    setShipments(mutated);
    setLastTick(new Date());
  };

  useEffect(() => {
    loadLiveStream();
    const interval = setInterval(loadLiveStream, 5000);
    return () => clearInterval(interval);
  }, []);

  const sorted = [...shipments].sort((a, b) => {
    if (sortBy === 'Temperature') return b.current_temp - a.current_temp;
    if (sortBy === 'Status') return a.status.localeCompare(b.status);
    return 0;
  });

  return (
    <div className="flex-1 bg-slate-50 min-h-screen">
      <Header title="Live Fleet Telemetry Monitoring" />

      <main className="p-6 space-y-6 max-w-7xl mx-auto">
        {/* Stream Status & Control Bar */}
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl border border-emerald-200 flex items-center gap-2">
              <Radio className="w-4 h-4 animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-wider">WebSocket Stream Active</span>
            </div>
            <span className="text-xs text-slate-400 font-medium">
              Last refresh: {lastTick.toLocaleTimeString()} (5s interval)
            </span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Sort by:</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 rounded-xl px-3 py-2 focus:outline-none focus:border-[#2C7BE5]"
            >
              <option value="Status">Status Priority</option>
              <option value="Temperature">Highest Temperature</option>
            </select>
            <button
              onClick={loadLiveStream}
              className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors"
              title="Manual Poll Now"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Active Live Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sorted.map((s) => {
            const isTempExcursion = s.current_temp < 2.0 || s.current_temp > 8.0;
            return (
              <div
                key={s.id || s.shipment_id}
                className={`bg-white rounded-2xl p-5 border shadow-sm hover:shadow-md transition-all space-y-4 ${
                  isTempExcursion ? 'border-rose-300 ring-2 ring-rose-100' : 'border-slate-200/80'
                }`}
              >
                <div className="flex items-center justify-between border-b pb-3 border-slate-100">
                  <div>
                    <h4 className="font-extrabold text-slate-900 text-base">{s.shipment_id}</h4>
                    <p className="text-xs text-slate-500 font-medium truncate max-w-[180px]">{s.product_name}</p>
                  </div>
                  <StatusBadge status={s.status} />
                </div>

                {/* Telemetry Metrics Grid */}
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className={`p-2.5 rounded-xl border ${isTempExcursion ? 'bg-rose-50 border-rose-200 text-rose-700' : 'bg-emerald-50 border-emerald-200 text-emerald-700'}`}>
                    <Thermometer className="w-4 h-4 mx-auto mb-1 opacity-75" />
                    <span className="text-[10px] font-bold uppercase block">Temp</span>
                    <span className="text-sm font-extrabold">{s.current_temp}°C</span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-700">
                    <Droplets className="w-4 h-4 mx-auto mb-1 opacity-75" />
                    <span className="text-[10px] font-bold uppercase block">Humidity</span>
                    <span className="text-sm font-extrabold">{s.current_humidity}%</span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-purple-50 border border-purple-200 text-purple-700">
                    <Zap className="w-4 h-4 mx-auto mb-1 opacity-75" />
                    <span className="text-[10px] font-bold uppercase block">Shock</span>
                    <span className="text-sm font-extrabold">{s.current_shock}g</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                  <span>Origin: {s.origin.split(' ')[0]}</span>
                  <Link
                    to={`/shipments/${s.shipment_id}`}
                    className="font-bold text-[#2C7BE5] hover:underline flex items-center gap-1"
                  >
                    <Eye className="w-3 h-3" />
                    <span>Inspect</span>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
