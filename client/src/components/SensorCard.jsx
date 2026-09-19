import React from 'react';
import { Thermometer, Droplets, Zap, Eye, Battery, Wifi, AlertCircle } from 'lucide-react';

export default function SensorCard({ type, value, unit = '', status = 'Normal', range, subtitle }) {
  const getCardProps = () => {
    switch (type) {
      case 'temperature':
        const tempVal = parseFloat(value);
        const isTempOk = tempVal >= 2.0 && tempVal <= 8.0;
        const tempPct = Math.min(Math.max(((tempVal - 0) / (12 - 0)) * 100, 5), 95);
        return {
          title: 'Temperature',
          icon: Thermometer,
          color: isTempOk ? 'text-emerald-600 bg-emerald-50' : 'text-rose-600 bg-rose-50',
          valDisplay: `${value}°C`,
          rangeText: 'Range: 2.0°C - 8.0°C',
          barPct: tempPct,
          barColor: isTempOk ? 'bg-emerald-500' : 'bg-rose-500',
          statusText: isTempOk ? 'Cold Chain Compliant' : 'Excursion Warning'
        };
      case 'humidity':
        const humVal = parseFloat(value);
        const isHumOk = humVal >= 30 && humVal <= 75;
        return {
          title: 'Relative Humidity',
          icon: Droplets,
          color: isHumOk ? 'text-blue-600 bg-blue-50' : 'text-amber-600 bg-amber-50',
          valDisplay: `${value}%`,
          rangeText: 'Safe Range: 30% - 75%',
          barPct: humVal,
          barColor: isHumOk ? 'bg-blue-500' : 'bg-amber-500',
          statusText: isHumOk ? 'Optimal Humidity' : 'Out of Bounds'
        };
      case 'shock':
        const shockVal = parseFloat(value);
        const isShockOk = shockVal < 2.0;
        return {
          title: 'Shock & Vibration',
          icon: Zap,
          color: isShockOk ? 'text-purple-600 bg-purple-50' : 'text-rose-600 bg-rose-50',
          valDisplay: `${value}g`,
          rangeText: 'Threshold Limit: < 2.0g',
          barPct: Math.min((shockVal / 3.0) * 100, 100),
          barColor: isShockOk ? 'bg-purple-500' : 'bg-rose-500',
          statusText: isShockOk ? 'Vibration Nominal' : 'High Impact Logged'
        };
      case 'light':
        const lightVal = parseFloat(value);
        const isTamper = lightVal > 300;
        return {
          title: 'Light & Tamper',
          icon: Eye,
          color: !isTamper ? 'text-emerald-600 bg-emerald-50' : 'text-rose-600 bg-rose-50',
          valDisplay: `${value} lux`,
          rangeText: 'Hatch Seal Integrity',
          barPct: Math.min((lightVal / 500) * 100, 100),
          barColor: !isTamper ? 'bg-emerald-500' : 'bg-rose-500',
          statusText: !isTamper ? 'Hatch Sealed' : 'Tamper Detected!'
        };
      case 'battery':
        const batVal = parseFloat(value);
        return {
          title: 'Transponder Battery',
          icon: Battery,
          color: batVal > 30 ? 'text-emerald-600 bg-emerald-50' : 'text-amber-600 bg-amber-50',
          valDisplay: `${value}%`,
          rangeText: 'Est. 14 Days Remaining',
          barPct: batVal,
          barColor: batVal > 30 ? 'bg-emerald-500' : 'bg-amber-500',
          statusText: batVal > 30 ? 'Battery Healthy' : 'Low Power Mode'
        };
      case 'connectivity':
      default:
        const isOnline = value?.toString().toLowerCase() === 'online';
        return {
          title: 'Connectivity Status',
          icon: Wifi,
          color: isOnline ? 'text-blue-600 bg-blue-50' : 'text-amber-600 bg-amber-50',
          valDisplay: value || 'Online',
          rangeText: isOnline ? '5G LTE Active Handshake' : 'Offline Store-and-Forward',
          barPct: isOnline ? 100 : 25,
          barColor: isOnline ? 'bg-blue-500' : 'bg-amber-500',
          statusText: isOnline ? 'Realtime Stream' : 'Store & Forward Active'
        };
    }
  };

  const props = getCardProps();
  const Icon = props.icon;

  return (
    <div className="bg-white rounded-xl p-4 border border-slate-200/80 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <div className={`p-2 rounded-lg ${props.color}`}>
            <Icon className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">{props.title}</h4>
            <div className="text-lg font-extrabold text-slate-900">{props.valDisplay}</div>
          </div>
        </div>
      </div>

      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mb-2">
        <div 
          className={`h-full transition-all duration-500 ${props.barColor}`} 
          style={{ width: `${props.barPct}%` }}
        />
      </div>

      <div className="flex items-center justify-between text-[11px]">
        <span className="text-slate-400 font-medium">{props.rangeText}</span>
        <span className="font-semibold text-slate-700">{props.statusText}</span>
      </div>
    </div>
  );
}
