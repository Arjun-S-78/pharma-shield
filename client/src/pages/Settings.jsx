import React, { useState } from 'react';
import Header from '../components/Header';
import { User, Bell, Key, Activity, CheckCircle2, Shield, Save, Copy } from 'lucide-react';

export default function Settings() {
  const [name, setName] = useState('Dr. Arjun Sharma');
  const [email, setEmail] = useState('admin@pharmashield.io');
  const [role, setRole] = useState('Lead QA Controller');
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [smsNotifs, setSmsNotifs] = useState(true);
  const [apiKey, setApiKey] = useState('ps_live_8943f9a72c91048b610023ff');
  const [saved, setSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const regenerateKey = () => {
    const newKey = 'ps_live_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    setApiKey(newKey);
  };

  return (
    <div className="flex-1 bg-slate-50 min-h-screen">
      <Header title="System Configuration & User Settings" />

      <main className="p-6 space-y-6 max-w-5xl mx-auto">
        {saved && (
          <div className="p-4 bg-emerald-50 text-emerald-800 rounded-xl border border-emerald-200 text-xs font-bold flex items-center gap-2 animate-fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Settings successfully updated across PharmaShield node cluster.</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-6">
          {/* 1. Profile Settings */}
          <div className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-sm space-y-4">
            <div className="flex items-center gap-3 border-b pb-3 border-slate-100">
              <div className="p-2 bg-blue-50 text-[#2C7BE5] rounded-lg">
                <User className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-sm">QA Controller Profile</h3>
                <p className="text-xs text-slate-400">Manage operator identity and role permissions</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800 rounded-xl p-2.5"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800 rounded-xl p-2.5"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Assigned Role</label>
                <input
                  type="text"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800 rounded-xl p-2.5"
                />
              </div>
            </div>
          </div>

          {/* 2. Notification Preferences */}
          <div className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-sm space-y-4">
            <div className="flex items-center gap-3 border-b pb-3 border-slate-100">
              <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
                <Bell className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Automated Alert Dispatch Rules</h3>
                <p className="text-xs text-slate-400">Configure instant push notifications for temperature excursions</p>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100 cursor-pointer">
                <div>
                  <span className="font-bold text-slate-800 block">Critical Email Dispatch</span>
                  <span className="text-slate-400 text-[11px]">Receive instant SMTP email when temperature breaches 8°C or falls below 2°C</span>
                </div>
                <input
                  type="checkbox"
                  checked={emailNotifs}
                  onChange={(e) => setEmailNotifs(e.target.checked)}
                  className="w-4 h-4 text-[#2C7BE5] rounded"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100 cursor-pointer">
                <div>
                  <span className="font-bold text-slate-800 block">SMS Gateway Alerts</span>
                  <span className="text-slate-400 text-[11px]">Send SMS alerts to QA duty officer on tamper or shock impact &gt; 2.0g</span>
                </div>
                <input
                  type="checkbox"
                  checked={smsNotifs}
                  onChange={(e) => setSmsNotifs(e.target.checked)}
                  className="w-4 h-4 text-[#2C7BE5] rounded"
                />
              </label>
            </div>
          </div>

          {/* 3. API Key Management */}
          <div className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-sm space-y-4">
            <div className="flex items-center gap-3 border-b pb-3 border-slate-100">
              <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
                <Key className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Transponder Ingestion API Credentials</h3>
                <p className="text-xs text-slate-400">Use this token for store-and-forward edge devices</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={apiKey}
                className="flex-1 bg-slate-100 font-mono text-xs text-slate-800 rounded-xl p-3 border border-slate-200"
              />
              <button
                type="button"
                onClick={() => navigator.clipboard.writeText(apiKey)}
                className="px-3 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors"
                title="Copy API Key"
              >
                <Copy className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={regenerateKey}
                className="px-3.5 py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold transition-colors"
              >
                Rotate Key
              </button>
            </div>
          </div>

          {/* 4. System Status & Health */}
          <div className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-sm space-y-4">
            <div className="flex items-center gap-3 border-b pb-3 border-slate-100">
              <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                <Activity className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Edge Gateway & System Health Diagnostics</h3>
                <p className="text-xs text-slate-400">Backend connectivity status</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-slate-400 block">FastAPI Server</span>
                <span className="font-bold text-emerald-600">Online (0ms latency)</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-slate-400 block">Database Sync</span>
                <span className="font-bold text-emerald-600">PostgreSQL / SQLite Ready</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-slate-400 block">Store & Forward Buffer</span>
                <span className="font-bold text-blue-600">0 Pending Batches</span>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-6 py-3 bg-[#0A2647] hover:bg-[#2C7BE5] text-white font-bold text-xs rounded-xl shadow-lg transition-all flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>Save System Settings</span>
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
