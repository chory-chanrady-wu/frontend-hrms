"use client";

import { Download } from "lucide-react";

export default function PerformanceReportsPage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-900">
          Performance Reports
        </h1>
        <button className="bg-gradient-to-r from-[#0C4A6E] to-[#075985] text-white px-4 py-2 rounded-lg font-medium hover:shadow-lg transition-all flex items-center gap-2">
          <Download className="h-4 w-4" />
          Download
        </button>
      </div>

      <div className="bg-white border border-slate-200 rounded-lg p-6">
        <p className="text-slate-600">
          Performance reports and employee analytics will be displayed here.
        </p>
      </div>
    </div>
  );
}
