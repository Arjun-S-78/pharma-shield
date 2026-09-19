import React, { useState } from 'react';
import { Search, Bell, RefreshCw, CheckCircle, Wifi, ShieldAlert } from 'lucide-react';
import { triggerOfflineSync } from '../services/api';

export default function Header({ title = 'Dashboard' }) {
  const [syncing, setSyncing] = useState(false);
  const [syncMsg, setSyncMsg] = useState(null);

  const handleManualSync = async () => {
    setSyncing(true);
    setSyncMsg('Synchronizing store-and-forward telemetry buffer...');
    const result = await triggerOfflineSync("PHARMA-004", [
      { temperature: 5.1, humidity: 62.0, shock: 0.1, light: 105.0, battery: 44.0, latitude: 9.9252, longitude: 78.1198 }
    ]);
    setTimeout(() => {
      setSyncing(false);
      setSyncMsg(result.message);
      setTimeout(() => setSyncMsg(null), 4000);
    }, 1200);
  };

  return (
    <header className="bg-white border-b border-slate-200/80 px-6 py-4 flex items-center justify-between sticky top-0 z-20 shadow-sm">
      <div className="flex items-center gap-4">
        <h2 className="text-xl font-bold text-slate-900">{title}</h2>
        <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-medium border border-emerald-200">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>System Healthy • FDA 21 CFR Part 11 Compliant</span>
        </div>
      </div>

      {syncMsg && (
        <div className="hidden lg:flex items-center gap-2 bg-blue-50 text-blue-800 text-xs px-3 py-1.5 rounded-lg border border-blue-200 animate-fade-in">
          <CheckCircle className="w-4 h-4 text-blue-600" />
          <span>{syncMsg}</span>
        </div>
      )}

      <div className="flex items-center gap-3">
        {/* Quick Sync Button */}
        <button
          onClick={handleManualSync}
          disabled={syncing}
          className="flex items-center gap-2 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-all"
          title="Force Sync Offline Buffer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${syncing ? 'animate-spin text-[#2C7BE5]' : ''}`} />
          <span className="hidden sm:inline">{syncing ? 'Syncing...' : 'Force Offline Sync'}</span>
        </button>

        {/* Notifications */}
        <div className="relative">
          <button className="p-2.5 text-slate-500 hover:text-slate-900 rounded-xl hover:bg-slate-100 relative transition-colors">
            <Bell className="w-4 h-4" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white" />
          </button>
        </div>

        {/* Global Search Bar */}
        <div className="relative hidden sm:block w-48 lg:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search consignment ID..."
            className="w-full pl-9 pr-3 py-1.5 bg-slate-100 focus:bg-white text-xs text-slate-800 placeholder-slate-400 rounded-xl border border-transparent focus:border-[#2C7BE5] focus:outline-none transition-all"
          />
        </div>
      </div>
    </header>
  );
}
