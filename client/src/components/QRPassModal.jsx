import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { 
  QrCode, 
  Smartphone, 
  Copy, 
  Check, 
  ExternalLink, 
  Settings, 
  Wifi, 
  X, 
  ShieldCheck, 
  Info,
  CheckCircle2,
  RefreshCw
} from 'lucide-react';
import { 
  getPublicJourneyUrl, 
  getConfiguredHost, 
  setConfiguredHost, 
  resetConfiguredHost 
} from '../services/qrConfig';

export default function QRPassModal({ 
  shipmentId = 'PHARMA-001', 
  productName = 'COVID-19 Vaccine', 
  isOpen = false, 
  onClose = () => {},
  isInline = false
}) {
  const [hostInput, setHostInput] = useState(getConfiguredHost());
  const [showConfig, setShowConfig] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showPhoneSimulator, setShowPhoneSimulator] = useState(false);
  const [currentUrl, setCurrentUrl] = useState(getPublicJourneyUrl(shipmentId));

  useEffect(() => {
    setCurrentUrl(getPublicJourneyUrl(shipmentId));
  }, [shipmentId, hostInput]);

  const handleSaveHost = (newHost) => {
    setConfiguredHost(newHost);
    setHostInput(getConfiguredHost());
    setCurrentUrl(getPublicJourneyUrl(shipmentId));
    setShowConfig(false);
  };

  const handleResetHost = () => {
    resetConfiguredHost();
    setHostInput(getConfiguredHost());
    setCurrentUrl(getPublicJourneyUrl(shipmentId));
    setShowConfig(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(currentUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const content = (
    <div className="space-y-4">
      {/* Header Info */}
      <div className="text-center space-y-1">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-[#2C7BE5] rounded-full text-xs font-bold border border-blue-200">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Mobile Cold-Chain Consignment Pass</span>
        </div>
        <h3 className="text-base font-extrabold text-slate-900 mt-1">{shipmentId} &bull; {productName}</h3>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">
          Scan with any mobile phone camera to automatically display the complete journey, GPS route & telemetry.
        </p>
      </div>

      {/* QR Code Container */}
      <div className="flex flex-col items-center justify-center p-5 bg-white rounded-2xl border-2 border-dashed border-blue-200 shadow-sm relative group">
        <div className="p-3 bg-white rounded-xl shadow-md border border-slate-200">
          <QRCodeSVG 
            value={currentUrl} 
            size={180} 
            level="H" 
            includeMargin={true}
            imageSettings={{
              src: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%232C7BE5'%3E%3Cpath d='M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z'/%3E%3C/svg%3E",
              x: undefined,
              y: undefined,
              height: 28,
              width: 28,
              excavate: true,
            }}
          />
        </div>

        <div className="mt-3 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
            Active Scannable Link
          </span>
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs space-y-1.5">
        <div className="font-extrabold text-slate-800 flex items-center gap-1.5">
          <Smartphone className="w-4 h-4 text-[#2C7BE5]" />
          <span>How to scan from your mobile phone:</span>
        </div>
        <ol className="list-decimal list-inside text-slate-600 space-y-0.5 pl-1 text-[11px]">
          <li>Ensure your phone is connected to the same Wi-Fi network.</li>
          <li>Open your phone's default camera app (iOS or Android).</li>
          <li>Point camera at this QR code & tap the yellow notification link.</li>
        </ol>
      </div>

      {/* Target Host & Link Details */}
      <div className="bg-blue-50/60 p-3 rounded-xl border border-blue-100 space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-slate-700 flex items-center gap-1 text-[11px]">
            <Wifi className="w-3.5 h-3.5 text-[#2C7BE5]" />
            <span>Target Host / Network IP:</span>
          </span>
          <button
            onClick={() => setShowConfig(!showConfig)}
            className="text-[10px] text-[#2C7BE5] font-bold hover:underline flex items-center gap-1"
          >
            <Settings className="w-3 h-3" />
            <span>{showConfig ? 'Close' : 'Change Wi-Fi IP'}</span>
          </button>
        </div>

        {showConfig ? (
          <div className="space-y-2 pt-1 border-t border-blue-200/60">
            <p className="text-[10px] text-slate-500">
              Enter your computer's local network IP (e.g. <code>10.24.247.46:3000</code>) or public ngrok URL:
            </p>
            <div className="flex gap-2">
              <input
                type="text"
                value={hostInput}
                onChange={(e) => setHostInput(e.target.value)}
                placeholder="10.24.247.46:3000"
                className="flex-1 px-2.5 py-1.5 text-xs bg-white rounded-lg border border-slate-300 font-mono focus:outline-none focus:border-[#2C7BE5]"
              />
              <button
                onClick={() => handleSaveHost(hostInput)}
                className="px-3 py-1.5 bg-[#2C7BE5] text-white text-xs font-bold rounded-lg hover:bg-blue-600 transition-colors"
              >
                Apply
              </button>
              <button
                onClick={handleResetHost}
                className="px-2 py-1.5 bg-slate-200 text-slate-700 text-xs font-bold rounded-lg hover:bg-slate-300 transition-colors"
                title="Reset to default"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between gap-2">
            <span className="font-mono text-[11px] font-bold text-slate-800 truncate" title={currentUrl}>
              {currentUrl}
            </span>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-3 gap-2">
        <button
          onClick={handleCopy}
          className="py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5 border border-slate-200"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-600" />}
          <span>{copied ? 'Copied!' : 'Copy Link'}</span>
        </button>

        <a
          href={currentUrl}
          target="_blank"
          rel="noreferrer"
          className="py-2.5 px-3 bg-blue-50 hover:bg-blue-100 text-[#2C7BE5] font-bold rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5 border border-blue-200"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          <span>Open Link</span>
        </a>

        <button
          onClick={() => setShowPhoneSimulator(!showPhoneSimulator)}
          className="py-2.5 px-3 bg-[#0A2647] hover:bg-[#2C7BE5] text-white font-bold rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5 shadow-sm"
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span>{showPhoneSimulator ? 'Hide Phone' : 'Phone Preview'}</span>
        </button>
      </div>

      {/* Phone Simulator Preview */}
      {showPhoneSimulator && (
        <div className="pt-3 border-t border-slate-200 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-800 flex items-center gap-1.5">
              <Smartphone className="w-4 h-4 text-[#2C7BE5]" />
              <span>Mobile Phone Live Journey Simulation</span>
            </span>
            <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              Interactive
            </span>
          </div>

          <div className="w-full max-w-[360px] mx-auto bg-slate-900 rounded-[32px] p-3 border-4 border-slate-800 shadow-2xl overflow-hidden">
            {/* Phone Notch */}
            <div className="w-32 h-4 bg-slate-800 rounded-b-xl mx-auto mb-2 flex items-center justify-center">
              <div className="w-3 h-3 rounded-full bg-slate-900 mr-2" />
              <div className="w-8 h-1 rounded-full bg-slate-900" />
            </div>

            {/* Embedded Mobile View */}
            <div className="rounded-[20px] overflow-hidden bg-slate-900 h-[480px]">
              <iframe
                src={`/journey/${shipmentId}`}
                title="Mobile Consignment Journey"
                className="w-full h-full border-0"
              />
            </div>

            {/* Phone Bottom Home Bar */}
            <div className="w-28 h-1 bg-slate-700 rounded-full mx-auto mt-2" />
          </div>
        </div>
      )}
    </div>
  );

  if (isInline) {
    return (
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm">
        {content}
      </div>
    );
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-md w-full p-6 relative my-8">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {content}
      </div>
    </div>
  );
}
