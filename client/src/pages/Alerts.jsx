import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import StatsCard from '../components/StatsCard';
import StatusBadge from '../components/StatusBadge';
import ChartWrapper from '../components/ChartWrapper';
import { 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Search, 
  Filter, 
  Check, 
  ShieldAlert, 
  ChevronLeft, 
  ChevronRight, 
  Thermometer, 
  Zap, 
  Eye, 
  Wifi 
} from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { fetchAlerts } from '../services/api';

const GENERATED_20_ALERTS = [
  { id: 1, timestamp: '14:32:10', type: 'Temperature Excursion', shipment_id: 'PHARMA-002', severity: 'Critical', message: 'Temp spiked to 9.5°C (Threshold range 2-8°C)', status: 'Active' },
  { id: 2, timestamp: '14:15:00', type: 'Shock Event', shipment_id: 'PHARMA-002', severity: 'High', message: 'Impact acceleration 2.4g registered on container frame', status: 'Active' },
  { id: 3, timestamp: '13:58:44', type: 'Tamper Detected', shipment_id: 'PHARMA-002', severity: 'Critical', message: 'Light sensor illuminated at 450 lux indicating cover breach', status: 'Active' },
  { id: 4, timestamp: '12:10:05', type: 'Network Lost', shipment_id: 'PHARMA-004', severity: 'Medium', message: 'Cellular disconnect. Switching transponder to local store-and-forward EEPROM queue', status: 'Acknowledged' },
  { id: 5, timestamp: '10:45:22', type: 'Humidity Excursion', shipment_id: 'PHARMA-003', severity: 'Low', message: 'Relative humidity reading 78% (Upper boundary limit 75%)', status: 'Resolved' },
  { id: 6, timestamp: '09:20:18', type: 'Temperature Excursion', shipment_id: 'PHARMA-001', severity: 'High', message: 'Temperature drop to 1.8°C near refrigeration fan', status: 'Resolved' },
  { id: 7, timestamp: '08:05:00', type: 'Shock Event', shipment_id: 'PHARMA-003', severity: 'Medium', message: 'Road vibration surge 1.9g detected', status: 'Acknowledged' },
  { id: 8, timestamp: '07:12:30', type: 'Network Lost', shipment_id: 'PHARMA-005', severity: 'Low', message: 'Brief signal dropout in tunnel segment (3 mins)', status: 'Resolved' },
  { id: 9, timestamp: '06:30:11', type: 'Tamper Detected', shipment_id: 'PHARMA-001', severity: 'High', message: 'Door microswitch state toggled temporarily', status: 'Resolved' },
  { id: 10, timestamp: '05:14:02', type: 'Humidity Excursion', shipment_id: 'PHARMA-004', severity: 'Medium', message: 'Moisture accumulation 76%', status: 'Acknowledged' },
  { id: 11, timestamp: '04:00:55', type: 'Temperature Excursion', shipment_id: 'PHARMA-002', severity: 'Critical', message: 'Thermal lag excursion 8.9°C', status: 'Active' },
  { id: 12, timestamp: '03:12:40', type: 'Shock Event', shipment_id: 'PHARMA-004', severity: 'High', message: 'Heavy brake deceleration shock 2.1g', status: 'Resolved' },
  { id: 13, timestamp: '02:05:19', type: 'Network Lost', shipment_id: 'PHARMA-002', severity: 'Medium', message: 'Network lost during interstate border transit', status: 'Resolved' },
  { id: 14, timestamp: '01:30:00', type: 'Temperature Excursion', shipment_id: 'PHARMA-005', severity: 'Low', message: 'Minor temperature flutter 7.9°C', status: 'Resolved' },
  { id: 15, timestamp: '00:45:12', type: 'Shock Event', shipment_id: 'PHARMA-001', severity: 'Low', message: 'Minor loading shock 1.2g', status: 'Resolved' },
  { id: 16, timestamp: 'Yesterday 23:10', type: 'Tamper Detected', shipment_id: 'PHARMA-003', severity: 'High', message: 'Unexpected light exposure 320 lux', status: 'Resolved' },
  { id: 17, timestamp: 'Yesterday 21:04', type: 'Humidity Excursion', shipment_id: 'PHARMA-001', severity: 'Low', message: 'Humidity drop to 28%', status: 'Resolved' },
  { id: 18, timestamp: 'Yesterday 19:30', type: 'Network Lost', shipment_id: 'PHARMA-003', severity: 'Medium', message: 'Handshake timeout logged', status: 'Resolved' },
  { id: 19, timestamp: 'Yesterday 18:15', type: 'Temperature Excursion', shipment_id: 'PHARMA-004', severity: 'High', message: 'Pre-chill chamber warmth 8.4°C', status: 'Resolved' },
  { id: 20, timestamp: 'Yesterday 16:00', type: 'Shock Event', shipment_id: 'PHARMA-005', severity: 'Medium', message: 'Pallet handling impact 1.8g', status: 'Resolved' }
];

export default function Alerts() {
  const [alertsList, setAlertsList] = useState(GENERATED_20_ALERTS);
  const [typeFilter, setTypeFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const handleUpdateStatus = (id, newStatus) => {
    setAlertsList(prev => prev.map(a => a.id === id ? { ...a, status: newStatus } : a));
  };

  const filtered = alertsList.filter(a => {
    const matchesType = typeFilter === 'All' || a.type.toLowerCase().includes(typeFilter.toLowerCase());
    const matchesStatus = statusFilter === 'All' || a.status.toLowerCase() === statusFilter.toLowerCase();
    const matchesSearch = a.shipment_id.toLowerCase().includes(search.toLowerCase()) || a.message.toLowerCase().includes(search.toLowerCase());
    return matchesType && matchesStatus && matchesSearch;
  });

  const totalPages = Math.ceil(filtered.length / itemsPerPage) || 1;
  const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const pieData = [
    { name: 'Temperature', value: 7, color: '#EF4444' },
    { name: 'Shock', value: 5, color: '#8B5CF6' },
    { name: 'Tamper', value: 3, color: '#F59E0B' },
    { name: 'Network', value: 5, color: '#2C7BE5' }
  ];

  return (
    <div className="flex-1 bg-slate-50 min-h-screen">
      <Header title="Anomaly & Excursion Alert Management" />

      <main className="p-6 space-y-6 max-w-7xl mx-auto">
        {/* Alert Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard title="Total Alerts Logged" value={alertsList.length} icon={AlertTriangle} color="red" subtitle="Lifetime Consignment Audit" />
          <StatsCard title="Critical Severity" value={alertsList.filter(a => a.severity === 'Critical').length} icon={ShieldAlert} color="red" subtitle="Immediate QA Inspection Required" />
          <StatsCard title="Resolved Alerts" value={alertsList.filter(a => a.status === 'Resolved').length} icon={CheckCircle2} color="green" subtitle="Audited & Closed" />
          <StatsCard title="Avg Response Time" value="14.2 min" icon={Clock} color="purple" subtitle="SLA Compliance Target < 20 min" />
        </div>

        {/* Filter Bar & Pie Chart Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-900 text-sm">Filter Anomaly Records</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Alert Type</label>
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 rounded-xl p-2.5"
                >
                  <option value="All">All Types</option>
                  <option value="Temperature">Temperature Excursion</option>
                  <option value="Shock">Shock Event</option>
                  <option value="Tamper">Tamper Detected</option>
                  <option value="Network">Network Lost</option>
                  <option value="Humidity">Humidity Excursion</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Status</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 rounded-xl p-2.5"
                >
                  <option value="All">All Statuses</option>
                  <option value="Active">Active</option>
                  <option value="Acknowledged">Acknowledged</option>
                  <option value="Resolved">Resolved</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Search ID / Msg</label>
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    placeholder="Search..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 bg-slate-50 text-xs rounded-xl border border-slate-200"
                  />
                </div>
              </div>
            </div>
          </div>

          <ChartWrapper title="Alerts Breakdown by Category">
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={45} outerRadius={65} dataKey="value">
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </ChartWrapper>
        </div>

        {/* Alerts Table */}
        <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200 uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-4">Alert Type</th>
                  <th className="py-3 px-4">Shipment ID</th>
                  <th className="py-3 px-4">Severity</th>
                  <th className="py-3 px-4">Message</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {paginated.map((a) => {
                  const severityBadge = 
                    a.severity === 'Critical' ? 'bg-rose-100 text-rose-800' :
                    a.severity === 'High' ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800';

                  return (
                    <tr key={a.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4 font-mono text-slate-500">{a.timestamp}</td>
                      <td className="py-3.5 px-4 font-semibold text-slate-800 flex items-center gap-2">
                        <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
                        <span>{a.type}</span>
                      </td>
                      <td className="py-3.5 px-4 font-bold text-[#2C7BE5]">
                        <Link to={`/shipments/${a.shipment_id}`}>{a.shipment_id}</Link>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${severityBadge}`}>
                          {a.severity}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 max-w-xs truncate">{a.message}</td>
                      <td className="py-3.5 px-4">
                        <StatusBadge status={a.status} />
                      </td>
                      <td className="py-3.5 px-4 text-right space-x-2">
                        {a.status === 'Active' && (
                          <button
                            onClick={() => handleUpdateStatus(a.id, 'Acknowledged')}
                            className="px-2.5 py-1 bg-amber-50 text-amber-700 font-bold rounded-lg text-[11px] border border-amber-200 hover:bg-amber-100 transition-colors"
                          >
                            Ack
                          </button>
                        )}
                        {a.status !== 'Resolved' && (
                          <button
                            onClick={() => handleUpdateStatus(a.id, 'Resolved')}
                            className="px-2.5 py-1 bg-emerald-50 text-emerald-700 font-bold rounded-lg text-[11px] border border-emerald-200 hover:bg-emerald-100 transition-colors"
                          >
                            Resolve
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="px-4 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium">
              Showing page {currentPage} of {totalPages} ({filtered.length} total alerts)
            </span>
            <div className="flex items-center gap-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-50 transition-colors"
              >
                <ChevronLeft className="w-4 h-4 text-slate-600" />
              </button>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-50 transition-colors"
              >
                <ChevronRight className="w-4 h-4 text-slate-600" />
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
