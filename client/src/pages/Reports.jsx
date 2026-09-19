import React, { useState } from 'react';
import Header from '../components/Header';
import { 
  FileText, 
  Calendar, 
  Download, 
  CheckCircle2, 
  AlertTriangle, 
  Thermometer, 
  Zap, 
  Eye, 
  Wifi, 
  Printer 
} from 'lucide-react';

export default function Reports() {
  const [startDate, setStartDate] = useState('2026-09-01');
  const [endDate, setEndDate] = useState('2026-09-08');
  const [reportGenerated, setReportGenerated] = useState(true);

  const handleGenerate = (e) => {
    e.preventDefault();
    setReportGenerated(true);
  };

  return (
    <div className="flex-1 bg-slate-50 min-h-screen">
      <Header title="Regulatory Compliance & Audit Reports" />

      <main className="p-6 space-y-6 max-w-5xl mx-auto print:p-0 print:bg-white">
        {/* Date Range Selector & Action Bar */}
        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm print:hidden">
          <form onSubmit={handleGenerate} className="flex flex-col md:flex-row items-end justify-between gap-4">
            <div className="flex flex-wrap items-center gap-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Start Date</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 rounded-xl px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">End Date</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 rounded-xl px-3 py-2"
                />
              </div>

              <button
                type="submit"
                className="px-4 py-2 bg-[#2C7BE5] hover:bg-blue-600 text-white text-xs font-bold rounded-xl shadow-md transition-all"
              >
                Generate Audit Report
              </button>
            </div>

            <button
              type="button"
              onClick={() => window.print()}
              className="flex items-center gap-2 px-4 py-2 bg-[#0A2647] hover:bg-[#2C7BE5] text-white text-xs font-bold rounded-xl shadow-md transition-all"
            >
              <Printer className="w-4 h-4" />
              <span>Export as PDF / Print</span>
            </button>
          </form>
        </div>

        {/* Printable Report Document Body */}
        {reportGenerated && (
          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-8 print:shadow-none print:border-none">
            {/* Report Header */}
            <div className="flex items-center justify-between border-b pb-6 border-slate-200">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="p-2 bg-[#0A2647] text-white rounded-lg font-black text-sm">PS</span>
                  <h1 className="text-2xl font-black text-[#0A2647] tracking-tight">PharmaShield Quality Report</h1>
                </div>
                <p className="text-xs text-slate-500 font-medium">FDA 21 CFR Part 11 & WHO Good Distribution Practice (GDP) Certificate</p>
              </div>

              <div className="text-right text-xs text-slate-500 space-y-1">
                <div><strong>Audit Period:</strong> {startDate} to {endDate}</div>
                <div><strong>Report ID:</strong> REP-2026-0908-04</div>
                <div className="text-emerald-600 font-extrabold flex items-center justify-end gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> CERTIFIED AUDIT PASSED
                </div>
              </div>
            </div>

            {/* Section 1: Shipment Summary */}
            <div className="space-y-3">
              <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider border-l-4 border-[#2C7BE5] pl-3">
                1. Shipment Executive Summary
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100 text-xs">
                <div><span className="text-slate-400 block">Total Consignments</span><strong className="text-base text-slate-900">24 Shipments</strong></div>
                <div><span className="text-slate-400 block">Cold-Chain Compliance</span><strong className="text-base text-emerald-600">98.4%</strong></div>
                <div><span className="text-slate-400 block">Excursions Logged</span><strong className="text-base text-rose-600">4 Events</strong></div>
                <div><span className="text-slate-400 block">Data Completeness</span><strong className="text-base text-blue-600">100.0% (Store-Forward)</strong></div>
              </div>
            </div>

            {/* Section 2: Temperature Compliance */}
            <div className="space-y-3">
              <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider border-l-4 border-emerald-500 pl-3">
                2. Temperature Compliance Analysis (2°C - 8°C Target)
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                98.4% of temperature telemetry samples remained strictly within the 2.0°C to 8.0°C cold-chain specification band. 
                Single thermal lag incident logged on <strong>PHARMA-002</strong> (9.5°C peak for 12 minutes) during loading dock transition.
              </p>
              <div className="bg-emerald-50/50 p-3.5 rounded-xl border border-emerald-200/60 flex items-center justify-between text-xs text-emerald-900">
                <span className="flex items-center gap-2 font-bold">
                  <Thermometer className="w-4 h-4 text-emerald-600" />
                  Mean Fleet Kinetic Temperature (MKT): 4.12°C
                </span>
                <span className="font-semibold text-emerald-700">Variance: ±0.3°C</span>
              </div>
            </div>

            {/* Section 3: Shock & Vibration Events */}
            <div className="space-y-3">
              <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider border-l-4 border-purple-500 pl-3">
                3. Shock & Vibration Incidents
              </h3>
              <p className="text-xs text-slate-600">
                Total 2 shock acceleration impulses registered above 1.5g threshold. 
                Maximum g-force impulse recorded was <strong>2.4g</strong> on PHARMA-002. Package integrity inspected and cleared.
              </p>
            </div>

            {/* Section 4: Tamper Incidents */}
            <div className="space-y-3">
              <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider border-l-4 border-amber-500 pl-3">
                4. Light Exposure & Hatch Tamper Log
              </h3>
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 flex items-center justify-between">
                <span className="font-bold flex items-center gap-2">
                  <Eye className="w-4 h-4 text-amber-600" />
                  1 Light Exposure Alert logged on PHARMA-002 (450 lux)
                </span>
                <span className="text-[11px] bg-amber-200 text-amber-800 font-extrabold px-2 py-0.5 rounded">INVESTIGATED</span>
              </div>
            </div>

            {/* Section 5: Network Connectivity & Store-and-Forward Sync */}
            <div className="space-y-3">
              <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider border-l-4 border-blue-500 pl-3">
                5. Network Connectivity & Offline Store-and-Forward Performance
              </h3>
              <p className="text-xs text-slate-600">
                Transponder cellular disconnects occurred for 2 active consignments (PHARMA-004 and PHARMA-002). 
                The offline store-and-forward architecture successfully buffered 100% of telemetry frames locally and synchronized upon network reconnection without any packet loss.
              </p>
            </div>

            {/* Signatures Footer */}
            <div className="border-t pt-8 border-slate-200 grid grid-cols-2 gap-8 text-xs">
              <div>
                <p className="text-slate-400 font-bold uppercase mb-8">Quality Assurance Controller</p>
                <div className="border-b border-slate-300 w-48 mb-1" />
                <p className="font-bold text-slate-800">Dr. Arjun Sharma, Ph.D.</p>
                <p className="text-[11px] text-slate-400">Head of Cold Chain Quality</p>
              </div>

              <div className="text-right">
                <p className="text-slate-400 font-bold uppercase mb-8">Cryptographic Signature</p>
                <p className="font-mono text-[10px] text-slate-500">SHA-256: 9f8a7b6c5d4e3f2a1b0c9d8e7f6a5b4c</p>
                <p className="text-[11px] text-slate-400 mt-1">Generated automatically by PharmaShield Cloud API</p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
