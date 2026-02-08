"use client";

import { useParams } from "next/navigation";
import { ArrowLeft, Download } from "lucide-react";
import Link from "next/link";

const payrollDetails = {
  id: "1",
  month: "January 2026",
  period: "2026-01-01 to 2026-01-31",
  totalEmployees: 248,
  totalAmount: "$1,245,800",
  status: "Processed",
  processedDate: "2026-02-01",
  breakdown: [
    { category: "Base Salary", amount: "$1,120,000" },
    { category: "Bonuses", amount: "$85,000" },
    { category: "Allowances", amount: "$65,800" },
    { category: "Tax Deductions", amount: "-$25,000" },
  ],
};

export default function PayrollDetailPage() {
  const params = useParams();

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <Link
          href="/dashboard/payroll"
          className="p-2 hover:bg-slate-100 rounded-lg transition"
        >
          <ArrowLeft className="h-5 w-5 text-slate-600" />
        </Link>
        <h1 className="text-2xl font-bold text-slate-900">Payroll Details</h1>
      </div>

      <div className="max-w-4xl">
        {/* Summary Card */}
        <div className="bg-white border border-slate-200 rounded-lg p-6 mb-6">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-slate-900 mb-2">
                {payrollDetails.month}
              </h2>
              <p className="text-sm text-slate-600">{payrollDetails.period}</p>
            </div>
            <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition">
              <Download className="h-4 w-4" />
              Download Report
            </button>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <div>
              <p className="text-sm text-slate-600 mb-1">Total Employees</p>
              <p className="text-2xl font-bold text-slate-900">
                {payrollDetails.totalEmployees}
              </p>
            </div>
            <div>
              <p className="text-sm text-slate-600 mb-1">Total Amount</p>
              <p className="text-2xl font-bold text-green-600">
                {payrollDetails.totalAmount}
              </p>
            </div>
            <div>
              <p className="text-sm text-slate-600 mb-1">Status</p>
              <span className="inline-flex px-3 py-1 text-sm font-semibold rounded-full bg-green-100 text-green-800">
                {payrollDetails.status}
              </span>
            </div>
          </div>
        </div>

        {/* Breakdown */}
        <div className="bg-white border border-slate-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">
            Payment Breakdown
          </h3>
          <div className="space-y-3">
            {payrollDetails.breakdown.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between py-3 border-b border-slate-200 last:border-0"
              >
                <span className="text-slate-700">{item.category}</span>
                <span
                  className={`font-semibold ${
                    item.amount.startsWith("-")
                      ? "text-red-600"
                      : "text-slate-900"
                  }`}
                >
                  {item.amount}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
