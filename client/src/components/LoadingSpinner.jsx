import React from 'react';
import { Loader2 } from 'lucide-react';

export function LoadingSpinner({ label = "Loading live telemetry stream..." }) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-slate-400">
      <Loader2 className="w-8 h-8 animate-spin text-[#2C7BE5] mb-3" />
      <span className="text-xs font-semibold text-slate-500">{label}</span>
    </div>
  );
}

export function EmptyState({ title = "No records found", description = "Try adjusting your filters or search term.", icon: Icon }) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
      {Icon && <Icon className="w-10 h-10 text-slate-300 mb-3" />}
      <h4 className="font-bold text-slate-700 text-sm">{title}</h4>
      <p className="text-xs text-slate-400 max-w-sm mt-1">{description}</p>
    </div>
  );
}
