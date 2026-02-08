"use client";

import { FileText, Download, TrendingUp } from "lucide-react";
import Link from "next/link";

const reportCategories = [
  {
    id: 1,
    title: "Attendance Reports",
    description: "Daily, weekly, and monthly attendance tracking",
    href: "/dashboard/reports/attendance",
    icon: FileText,
    count: 12,
  },
  {
    id: 2,
    title: "Payroll Reports",
    description: "Salary, bonuses, and deductions summary",
    href: "/dashboard/reports/payroll",
    icon: FileText,
    count: 8,
  },
  {
    id: 3,
    title: "Performance Reports",
    description: "Employee performance reviews and ratings",
    href: "/dashboard/reports/performance",
    icon: TrendingUp,
    count: 15,
  },
];

export default function ReportsPage() {
  return (
    <div>
      <div className=" flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Reports</h1>
        <button className="bg-gradient-to-r from-[#0C4A6E] to-[#075985] text-white px-4 py-2 rounded-lg font-medium hover:shadow-lg transition-all flex items-center gap-2">
          <Download className="h-4 w-4" />
          Export All
        </button>
      </div>

      {/* Report Categories */}
      <div className="grid gap-6 md:grid-cols-3 mb-8">
        {reportCategories.map((category) => {
          const Icon = category.icon;
          return (
            <Link
              key={category.id}
              href={category.href}
              className="bg-white border border-slate-200 rounded-lg p-6 hover:shadow-lg transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Icon className="h-6 w-6 text-blue-600" />
                </div>
                <span className="px-3 py-1 bg-slate-100 text-slate-700 text-sm font-medium rounded-full">
                  {category.count} reports
                </span>
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                {category.title}
              </h3>
              <p className="text-sm text-slate-600">{category.description}</p>
            </Link>
          );
        })}
      </div>

      {/* Recent Reports */}
      <div className="bg-white border border-slate-200 rounded-lg">
        <div className="px-6 py-4 border-b border-slate-200">
          <h2 className="text-lg font-semibold text-slate-900">
            Recent Reports
          </h2>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {[
              {
                name: "January 2026 Payroll Report",
                date: "2026-02-01",
                type: "Payroll",
              },
              {
                name: "January 2026 Attendance Summary",
                date: "2026-02-01",
                type: "Attendance",
              },
              {
                name: "Q4 2025 Performance Review",
                date: "2026-01-15",
                type: "Performance",
              },
            ].map((report, index) => (
              <div
                key={index}
                className="flex items-center justify-between py-3 border-b border-slate-200 last:border-0"
              >
                <div>
                  <p className="font-medium text-slate-900">{report.name}</p>
                  <p className="text-sm text-slate-500">
                    Generated on {new Date(report.date).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded">
                    {report.type}
                  </span>
                  <button className="p-2 hover:bg-slate-100 rounded transition">
                    <Download className="h-4 w-4 text-slate-600" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
