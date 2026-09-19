import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Lock, Mail, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('admin@pharmashield.io');
  const [password, setPassword] = useState('admin123');
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigate('/dashboard');
    }, 800);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A2647] via-[#0D3461] to-[#144272] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Decorative Rings */}
      <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-blue-400/10 blur-3xl pointer-events-none" />

      <div className="w-full max-w-md bg-white/95 backdrop-blur-xl rounded-2xl p-8 shadow-2xl border border-white/20 z-10">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex p-3 bg-gradient-to-tr from-[#0A2647] to-[#2C7BE5] text-white rounded-2xl shadow-xl shadow-blue-900/30 mb-3">
            <Shield className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">PharmaShield</h1>
          <p className="text-xs text-slate-500 font-medium mt-1">IoT Consignment Traceability & Cold Chain Platform</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Email or Username</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="operator@pharmashield.io"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 text-sm text-slate-800 rounded-xl border border-slate-200 focus:bg-white focus:border-[#2C7BE5] focus:ring-2 focus:ring-blue-100 focus:outline-none transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 text-sm text-slate-800 rounded-xl border border-slate-200 focus:bg-white focus:border-[#2C7BE5] focus:ring-2 focus:ring-blue-100 focus:outline-none transition-all"
              />
            </div>
          </div>

          <div className="flex items-center justify-between text-xs">
            <label className="flex items-center gap-2 text-slate-600 cursor-pointer">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="rounded border-slate-300 text-[#2C7BE5] focus:ring-blue-400"
              />
              <span>Remember this device</span>
            </label>
            <a href="#forgot" onClick={(e) => { e.preventDefault(); alert("Contact system administrator for password resets."); }} className="text-[#2C7BE5] font-semibold hover:underline">Forgot password?</a>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#0A2647] hover:bg-[#2C7BE5] text-white font-bold rounded-xl shadow-lg shadow-blue-900/20 hover:shadow-blue-500/30 flex items-center justify-center gap-2 transition-all duration-300"
          >
            {loading ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <span>Sign In to Control Center</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Demo Credentials hint */}
        <div className="mt-6 p-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
          <p className="text-xs text-slate-500 font-medium">
            Demo Credentials: <span className="font-bold text-slate-800">admin / admin123</span>
          </p>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center text-[11px] text-slate-400 space-y-1">
          <p>© 2026 PharmaShield IoT. Store-and-Forward Architectural Core.</p>
          <div className="flex justify-center gap-3 font-medium">
            <span className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-emerald-500" /> FDA 21 CFR Part 11</span>
            <span className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-emerald-500" /> WHO GDP Compliant</span>
          </div>
        </div>
      </div>
    </div>
  );
}
