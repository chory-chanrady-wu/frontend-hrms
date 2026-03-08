"use client";

import { useParams } from "next/navigation";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { useGetPayrollById } from "@/hooks/payroll-query";

export default function PayrollDetailPage() {
  const params = useParams();
  const payrollId = Number(params.id);
  const {
    data: payrollResponse,
    isLoading,
    error,
  } = useGetPayrollById(payrollId);

  const payroll = payrollResponse?.data || payrollResponse;

  const monthNames = [
    "",
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <Link
          href="/dashboard/payroll"
          className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition"
        >
          <ArrowLeft className="h-5 w-5 text-slate-600 dark:text-slate-400" />
        </Link>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
          Payroll Details
        </h1>
      </div>

      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      )}

      {error && (
        <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg p-6">
          <p className="text-red-600 dark:text-red-400">
            Error loading payroll details.
          </p>
        </div>
      )}

      {!isLoading && !error && payroll && (
        <div className="max-w-4xl">
          {/* Summary Card */}
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-6 mb-6">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">
                  {monthNames[payroll.month] || payroll.month} {payroll.year}
                </h2>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Employee #{payroll.employeeId}
                </p>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                  Net Salary
                </p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                  ${payroll.netSalary?.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                  Basic Salary
                </p>
                <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                  ${payroll.basicSalary?.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                  Period
                </p>
                <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                  {monthNames[payroll.month]} {payroll.year}
                </p>
              </div>
            </div>
          </div>

          {/* Breakdown */}
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
              Payment Breakdown
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between py-3 border-b border-slate-200 dark:border-slate-700">
                <span className="text-slate-700 dark:text-slate-300">
                  Basic Salary
                </span>
                <span className="font-semibold text-slate-900 dark:text-slate-100">
                  ${payroll.basicSalary?.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-slate-200 dark:border-slate-700">
                <span className="text-slate-700 dark:text-slate-300">
                  Bonus
                </span>
                <span className="font-semibold text-green-600 dark:text-green-400">
                  +${payroll.bonus?.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-slate-200 dark:border-slate-700">
                <span className="text-slate-700 dark:text-slate-300">
                  Deductions
                </span>
                <span className="font-semibold text-red-600 dark:text-red-400">
                  -${payroll.deductions?.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between py-3">
                <span className="font-semibold text-slate-900 dark:text-slate-100">
                  Net Salary
                </span>
                <span className="font-bold text-lg text-green-600 dark:text-green-400">
                  ${payroll.netSalary?.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
