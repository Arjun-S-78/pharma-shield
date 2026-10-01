import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import StatusBadge from '../components/StatusBadge';
import { Search, Filter, Eye, ChevronLeft, ChevronRight, Download, Plus, QrCode } from 'lucide-react';
import { fetchShipments } from '../services/api';
import QRPassModal from '../components/QRPassModal';

export default function Shipments() {
  const [shipments, setShipments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedQrShipment, setSelectedQrShipment] = useState(null);
  const itemsPerPage = 10;

  useEffect(() => {
    async function load() {
      const data = await fetchShipments();
      setShipments(data);
    }
    load();
  }, []);

  const filtered = shipments.filter(s => {
    const matchesSearch = s.shipment_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          s.product_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || s.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filtered.length / itemsPerPage) || 1;
  const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="flex-1 bg-slate-50 min-h-screen">
      <Header title="Pharmaceutical Consignment Directory" />

      <main className="p-6 space-y-6 max-w-7xl mx-auto">
        {/* Filter and Action Bar */}
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-1 items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search shipment ID, product name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-50 text-xs text-slate-800 rounded-xl border border-slate-200 focus:bg-white focus:border-[#2C7BE5] focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-slate-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 rounded-xl px-3 py-2 focus:outline-none focus:border-[#2C7BE5]"
              >
                <option value="All">All Statuses</option>
                <option value="Safe">Safe</option>
                <option value="In Transit">In Transit</option>
                <option value="Alert">Alert</option>
                <option value="Offline">Offline</option>
                <option value="Delivered">Delivered</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto justify-end">
            <button className="flex items-center gap-2 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all">
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>
            <button 
              onClick={() => alert("Shipment Registration Modal: Connect barcode reader or enter consignment manifest.")}
              className="flex items-center gap-2 px-3 py-2 bg-[#0A2647] hover:bg-[#2C7BE5] text-white rounded-xl text-xs font-bold transition-all shadow-md"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Shipment</span>
            </button>
          </div>
        </div>

        {/* Shipments Table */}
        <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200 uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Shipment ID</th>
                  <th className="py-3 px-4">Product Name</th>
                  <th className="py-3 px-4">Origin</th>
                  <th className="py-3 px-4">Destination</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Temperature</th>
                  <th className="py-3 px-4">Humidity</th>
                  <th className="py-3 px-4">Last Sync</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {paginated.map((s) => (
                  <tr key={s.id || s.shipment_id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-extrabold text-[#0A2647]">{s.shipment_id}</td>
                    <td className="py-3.5 px-4 font-semibold text-slate-800">{s.product_name}</td>
                    <td className="py-3.5 px-4 text-slate-500">{s.origin}</td>
                    <td className="py-3.5 px-4 text-slate-500">{s.destination}</td>
                    <td className="py-3.5 px-4">
                      <StatusBadge status={s.status} />
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-800">{s.current_temp}°C</td>
                    <td className="py-3.5 px-4 font-mono text-slate-600">{s.current_humidity}%</td>
                    <td className="py-3.5 px-4 text-slate-400">{s.updated_at || "Just now"}</td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="inline-flex items-center gap-2">
                        <button
                          onClick={() => setSelectedQrShipment(s)}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-blue-50 text-[#2C7BE5] hover:bg-[#2C7BE5] hover:text-white font-bold rounded-lg transition-all border border-blue-200"
                          title="Generate scannable QR Pass for mobile"
                        >
                          <QrCode className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">QR Pass</span>
                        </button>
                        <Link
                          to={`/shipments/${s.shipment_id}`}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#2C7BE5]/10 text-[#2C7BE5] hover:bg-[#2C7BE5] hover:text-white font-bold rounded-lg transition-all"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View Details</span>
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Footer */}
          <div className="px-4 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium">
              Showing page {currentPage} of {totalPages} ({filtered.length} total consignments)
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

      {/* Scannable Mobile QR Pass Modal */}
      {selectedQrShipment && (
        <QRPassModal
          isOpen={!!selectedQrShipment}
          onClose={() => setSelectedQrShipment(null)}
          shipmentId={selectedQrShipment.shipment_id}
          productName={selectedQrShipment.product_name}
        />
      )}
    </div>
  );
}
