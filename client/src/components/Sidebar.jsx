import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  Radio, 
  AlertTriangle, 
  Map, 
  GitCommit, 
  FileText, 
  QrCode, 
  Settings, 
  Shield, 
  LogOut 
} from 'lucide-react';

const NAV_ITEMS = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { name: 'Shipments', path: '/shipments', icon: Package },
  { name: 'Live Monitoring', path: '/live-monitoring', icon: Radio, badge: 'LIVE' },
  { name: 'Alerts', path: '/alerts', icon: AlertTriangle, badge: '4' },
  { name: 'Map View', path: '/map', icon: Map },
  { name: 'Journey Timeline', path: '/timeline', icon: GitCommit },
  { name: 'Compliance Reports', path: '/reports', icon: FileText },
  { name: 'QR Verification', path: '/qr-verification', icon: QrCode },
  { name: 'System Settings', path: '/settings', icon: Settings },
];

export default function Sidebar() {
  return (
    <aside className="w-64 bg-[#0A2647] text-slate-300 flex flex-col min-h-screen border-r border-slate-800 shadow-xl shrink-0">
      {/* Brand Header */}
      <div className="p-5 flex items-center gap-3 border-b border-slate-800/80">
        <div className="p-2.5 bg-gradient-to-tr from-[#2C7BE5] to-blue-400 rounded-xl shadow-lg shadow-blue-500/20 text-white">
          <Shield className="w-6 h-6" />
        </div>
        <div>
          <h1 className="font-extrabold text-lg text-white tracking-tight leading-none">PharmaShield</h1>
          <p className="text-[11px] text-blue-300 font-medium tracking-wide uppercase mt-1">IoT Cold Chain Trace</p>
        </div>
      </div>

      {/* Store & Forward Indicator Banner */}
      <div className="mx-4 mt-4 p-3 rounded-xl bg-blue-950/60 border border-blue-800/50 flex items-center gap-2.5 text-xs text-blue-200">
        <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping shrink-0" />
        <div className="leading-tight">
          <span className="font-bold text-white block">Store & Forward Active</span>
          <span className="text-[10px] text-slate-400">Auto-sync on re-connect</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all group ${
                  isActive
                    ? 'bg-[#2C7BE5] text-white shadow-md shadow-blue-600/30'
                    : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                }`
              }
            >
              <div className="flex items-center gap-3">
                <Icon className="w-4 h-4 text-slate-400 group-hover:text-white transition-colors" />
                <span>{item.name}</span>
              </div>
              {item.badge && (
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  item.badge === 'LIVE' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
                }`}>
                  {item.badge}
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* User Profile & Logout */}
      <div className="p-4 border-t border-slate-800/80 bg-slate-950/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#2C7BE5] text-white font-bold flex items-center justify-center text-sm shadow-inner">
              AD
            </div>
            <div className="leading-tight">
              <span className="text-xs font-bold text-white block">Dr. Arjun Sharma</span>
              <span className="text-[10px] text-slate-400">Lead QA Controller</span>
            </div>
          </div>
          <NavLink to="/login" className="p-2 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-slate-800 transition-colors" title="Logout">
            <LogOut className="w-4 h-4" />
          </NavLink>
        </div>
      </div>
    </aside>
  );
}
