import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import Header from '../components/Header';
import StatusBadge from '../components/StatusBadge';
import { 
  QrCode, 
  Camera, 
  Search, 
  CheckCircle2, 
  AlertTriangle, 
  Eye, 
  ShieldCheck, 
  MapPin, 
  Calendar, 
  Building 
} from 'lucide-react';
import { verifyQR } from '../services/api';

export default function QRVerification() {
  const [searchParams] = useSearchParams();
  const initialShipmentId = searchParams.get('shipment') || 'PHARMA-001';

  const [inputShipmentId, setInputShipmentId] = useState(initialShipmentId);
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState(null);
  const [verificationsHistory, setVerificationsHistory] = useState([
    { shipment_id: 'PHARMA-001', verified_by: 'Inspector R. Kumar', timestamp: '10 mins ago', status: 'SAFE / COMPLIANT' },
    { shipment_id: 'PHARMA-003', verified_by: 'QA Tech S. Nair', timestamp: '1 hour ago', status: 'SAFE / COMPLIANT' },
    { shipment_id: 'PHARMA-002', verified_by: 'Dr. Arjun Sharma', timestamp: '2 hours ago', status: 'INVESTIGATION REQUIRED' }
  ]);

  const handleVerify = async (idToVerify) => {
    const id = idToVerify || inputShipmentId;
    if (!id) return;
    const res = await verifyQR(id);
    setResult(res);

    // Add to history table
    setVerificationsHistory(prev => [
      {
        shipment_id: res.shipment_id,
        verified_by: 'Logged Inspector',
        timestamp: 'Just now',
        status: res.is_compliant ? 'SAFE / COMPLIANT' : 'INVESTIGATION REQUIRED'
      },
      ...prev.slice(0, 4)
    ]);
  };

  useEffect(() => {
    if (initialShipmentId) {
      handleVerify(initialShipmentId);
    }
  }, [initialShipmentId]);

  const simulateCameraScan = () => {
    setScanning(true);
    setTimeout(() => {
      setScanning(false);
      handleVerify('PHARMA-001');
    }, 1500);
  };

  return (
    <div className="flex-1 bg-slate-50 min-h-screen">
      <Header title="QR Inspection & Cold-Chain Chain of Custody Verification" />

      <main className="p-6 space-y-6 max-w-5xl mx-auto">
        {/* Title Header Banner */}
        <div className="bg-[#0A2647] text-white p-6 rounded-2xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-[#2C7BE5] rounded-xl text-white">
              <QrCode className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold">QR Verification - Scan to verify shipment journey</h2>
              <p className="text-xs text-blue-200 mt-0.5">Instant FDA 21 CFR Part 11 cryptographic compliance lookup</p>
            </div>
          </div>
        </div>

        {/* Scan & Manual Verification Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Camera Scanner Simulation */}
          <div className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-sm text-center flex flex-col items-center justify-center space-y-4">
            <div className="w-full max-w-xs h-56 bg-slate-900 rounded-2xl relative overflow-hidden flex flex-col items-center justify-center border-4 border-slate-800">
              {scanning ? (
                <div className="text-white space-y-3">
                  <div className="w-12 h-12 border-4 border-[#2C7BE5] border-t-transparent rounded-full animate-spin mx-auto" />
                  <p className="text-xs font-bold animate-pulse">Scanning Barcode / QR Code...</p>
                </div>
              ) : (
                <div className="text-slate-400 space-y-2">
                  <Camera className="w-10 h-10 mx-auto text-slate-500" />
                  <p className="text-xs font-semibold">Align QR Code inside viewport</p>
                </div>
              )}
              {/* Laser line overlay */}
              <div className="absolute inset-x-0 h-0.5 bg-emerald-400 shadow-[0_0_15px_#10B981] animate-bounce top-1/2" />
            </div>

            <button
              onClick={simulateCameraScan}
              disabled={scanning}
              className="w-full py-3 bg-[#2C7BE5] hover:bg-blue-600 text-white font-bold rounded-xl text-xs transition-all shadow-md flex items-center justify-center gap-2"
            >
              <Camera className="w-4 h-4" />
              <span>{scanning ? 'Reading Camera...' : 'Launch Camera Scanner'}</span>
            </button>
          </div>

          {/* Manual Entry Form */}
          <div className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-sm space-y-4 flex flex-col justify-center">
            <div>
              <h3 className="font-extrabold text-slate-900 text-sm">Manual Consignment Lookup</h3>
              <p className="text-xs text-slate-400 mt-1">Enter consignment serial or barcode manifest ID to run instant audit.</p>
            </div>

            <div className="space-y-3">
              <label className="block text-[11px] font-bold text-slate-500 uppercase">Shipment ID</label>
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={inputShipmentId}
                  onChange={(e) => setInputShipmentId(e.target.value)}
                  placeholder="e.g. PHARMA-001"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 text-sm font-extrabold text-slate-800 rounded-xl border border-slate-200 focus:bg-white focus:border-[#2C7BE5] focus:outline-none"
                />
              </div>
              <button
                onClick={() => handleVerify()}
                className="w-full py-3 bg-[#0A2647] hover:bg-[#2C7BE5] text-white font-bold rounded-xl text-xs transition-all shadow-md"
              >
                Verify Audit Credentials
              </button>
            </div>
          </div>
        </div>

        {/* Verification Result Display */}
        {result && (
          <div className={`p-6 rounded-2xl border shadow-md space-y-6 transition-all ${
            result.is_compliant ? 'bg-emerald-50/70 border-emerald-300' : 'bg-rose-50/70 border-rose-300'
          }`}>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-4 border-slate-200/60">
              <div className="flex items-center gap-3">
                {result.is_compliant ? (
                  <div className="p-3 bg-emerald-500 text-white rounded-xl shadow-md">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>
                ) : (
                  <div className="p-3 bg-rose-500 text-white rounded-xl shadow-md">
                    <AlertTriangle className="w-7 h-7" />
                  </div>
                )}
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-black text-slate-900">{result.shipment_id}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-black uppercase ${
                      result.is_compliant ? 'bg-emerald-200 text-emerald-900' : 'bg-rose-200 text-rose-900 animate-pulse'
                    }`}>
                      {result.is_compliant ? '✅ SAFE / COMPLIANT' : '⚠️ ALERT / INVESTIGATION REQUIRED'}
                    </span>
                  </div>
                  <p className="text-xs font-bold text-slate-700 mt-0.5">{result.product_name}</p>
                </div>
              </div>

              <Link
                to={`/shipments/${result.shipment_id}`}
                className="px-4 py-2 bg-[#0A2647] text-white text-xs font-bold rounded-xl hover:bg-[#2C7BE5] transition-colors self-start md:self-auto flex items-center gap-1.5"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>View Full Telemetry Details</span>
              </Link>
            </div>

            {/* Compliance Check Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2">
                <h4 className="font-extrabold text-slate-900 uppercase">Consignment Journey Summary</h4>
                <div className="space-y-1 text-slate-600">
                  <div><strong>Origin:</strong> {result.origin}</div>
                  <div><strong>Destination:</strong> {result.destination}</div>
                  <div><strong>Verified Timestamp:</strong> {result.verified_at || 'Just now'}</div>
                </div>
              </div>

              <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2">
                <h4 className="font-extrabold text-slate-900 uppercase">Quality Audit Findings</h4>
                <p className={`font-semibold ${result.is_compliant ? 'text-emerald-700' : 'text-rose-700'}`}>
                  {result.compliance_summary}
                </p>
                <div className="flex items-center gap-2 pt-1 text-[11px] text-slate-500">
                  <ShieldCheck className="w-4 h-4 text-blue-600" />
                  <span>Tamper-evident sensor hash matching digital certificate</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Recent Verifications Table */}
        <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm p-5 space-y-4">
          <h3 className="font-extrabold text-slate-900 text-sm">Recent Verifications Log</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200 uppercase">
                <tr>
                  <th className="py-2.5 px-3">Shipment ID</th>
                  <th className="py-2.5 px-3">Verified By</th>
                  <th className="py-2.5 px-3">Timestamp</th>
                  <th className="py-2.5 px-3">Compliance Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {verificationsHistory.map((vh, i) => (
                  <tr key={i} className="hover:bg-slate-50 transition-colors">
                    <td className="py-2.5 px-3 font-extrabold text-[#0A2647]">{vh.shipment_id}</td>
                    <td className="py-2.5 px-3 font-semibold text-slate-700">{vh.verified_by}</td>
                    <td className="py-2.5 px-3 text-slate-400 font-mono">{vh.timestamp}</td>
                    <td className="py-2.5 px-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-black ${
                        vh.status.includes('SAFE') ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                      }`}>
                        {vh.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
