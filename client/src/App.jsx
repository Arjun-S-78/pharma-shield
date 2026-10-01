import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Shipments from './pages/Shipments';
import ShipmentDetails from './pages/ShipmentDetails';
import LiveMonitoring from './pages/LiveMonitoring';
import Alerts from './pages/Alerts';
import MapView from './pages/MapView';
import Timeline from './pages/Timeline';
import Reports from './pages/Reports';
import QRVerification from './pages/QRVerification';
import Settings from './pages/Settings';
import JourneyPass from './pages/JourneyPass';

function LayoutWrapper({ children }) {
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';
  const isPublicJourney = location.pathname.startsWith('/journey') || location.pathname.startsWith('/verify');

  if (isLoginPage || isPublicJourney) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen bg-slate-50 antialiased font-['Plus_Jakarta_Sans',sans-serif]">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        {children}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <LayoutWrapper>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/shipments" element={<Shipments />} />
          <Route path="/shipments/:id" element={<ShipmentDetails />} />
          <Route path="/live-monitoring" element={<LiveMonitoring />} />
          <Route path="/alerts" element={<Alerts />} />
          <Route path="/map" element={<MapView />} />
          <Route path="/timeline" element={<Timeline />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/journey/:id" element={<JourneyPass />} />
          <Route path="/verify/:id" element={<JourneyPass />} />
          <Route path="/qr-verification" element={<QRVerification />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </LayoutWrapper>
    </Router>
  );
}
