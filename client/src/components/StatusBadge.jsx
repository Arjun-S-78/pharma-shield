import React from 'react';
import { CheckCircle, AlertTriangle, Clock, WifiOff, PackageCheck } from 'lucide-react';

export default function StatusBadge({ status }) {
  let badgeStyle = "bg-blue-50 text-blue-700 border-blue-200";
  let Icon = Clock;

  switch (status?.toLowerCase()) {
    case 'safe':
      badgeStyle = "bg-emerald-50 text-emerald-700 border-emerald-200";
      Icon = CheckCircle;
      break;
    case 'alert':
    case 'critical':
      badgeStyle = "bg-rose-50 text-rose-700 border-rose-200 animate-pulse";
      Icon = AlertTriangle;
      break;
    case 'offline':
      badgeStyle = "bg-amber-50 text-amber-700 border-amber-200";
      Icon = WifiOff;
      break;
    case 'delivered':
      badgeStyle = "bg-purple-50 text-purple-700 border-purple-200";
      Icon = PackageCheck;
      break;
    default:
      badgeStyle = "bg-blue-50 text-blue-700 border-blue-200";
      Icon = Clock;
  }

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${badgeStyle}`}>
      <Icon className="w-3.5 h-3.5" />
      {status}
    </span>
  );
}
