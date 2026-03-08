"use client";

import { DollarSign, Calendar, FileText, Download } from "lucide-react";
import Link from "next/link";
import { useGetAllPayroll, useDeletePayroll } from "@/hooks/payroll-query";
import { useGetAllEmployees } from "@/hooks/employee-query";

export default function PayrollPage() {
  const { data: payroll, isLoading, error } = useGetAllPayroll();
  const { mutate: deletePayroll } = useDeletePayroll();
  const { data: employeesResponse } = useGetAllEmployees();

  const payrollList = Array.isArray(payroll)
    ? payroll
    : Array.isArray(payroll?.data)
      ? payroll.data
      : [];

  const employees = Array.isArray(employeesResponse)
    ? employeesResponse
    : Array.isArray(employeesResponse?.data)
      ? employeesResponse.data
      : [];

  const totalNetSalary = payrollList.reduce(
    (sum: number, r: any) => sum + (r.netSalary || 0),
    0,
  );
  const avgSalary =
    payrollList.length > 0
      ? Math.round(totalNetSalary / payrollList.length)
      : 0;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
          Payroll
        </h1>
        <Link
          href="/dashboard/payroll/generate"
          className="bg-linear-to-r from-[#0C4A6E] to-[#075985] text-white px-4 py-2 rounded-lg font-medium hover:shadow-lg transition-all"
        >
          Generate Payroll
        </Link>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-6 md:grid-cols-4 mb-6">
        <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
                Total Payroll
              </p>
              <p className="text-3xl font-bold text-blue-900 dark:text-blue-200 mt-2">
                ${totalNetSalary.toLocaleString()}
              </p>
            </div>
            <DollarSign className="h-12 w-12 text-blue-600 dark:text-blue-400 opacity-20" />
          </div>
        </div>
        <div className="bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600 dark:text-green-400">
                Avg Salary
              </p>
              <p className="text-3xl font-bold text-green-900 dark:text-green-200 mt-2">
                ${avgSalary.toLocaleString()}
              </p>
            </div>
            <DollarSign className="h-12 w-12 text-green-600 dark:text-green-400 opacity-20" />
          </div>
        </div>
        <div className="bg-purple-50 dark:bg-purple-900/30 border border-purple-200 dark:border-purple-800 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-600 dark:text-purple-400">
                Employees
              </p>
              <p className="text-3xl font-bold text-purple-900 dark:text-purple-200 mt-2">
                {employees.length}
              </p>
            </div>
            <FileText className="h-12 w-12 text-purple-600 dark:text-purple-400 opacity-20" />
          </div>
        </div>
        <div className="bg-orange-50 dark:bg-orange-900/30 border border-orange-200 dark:border-orange-800 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-orange-600 dark:text-orange-400">
                Records
              </p>
              <p className="text-3xl font-bold text-orange-900 dark:text-orange-200 mt-2">
                {payrollList.length}
              </p>
            </div>
            <Calendar className="h-12 w-12 text-orange-600 dark:text-orange-400 opacity-20" />
          </div>
        </div>
      </div>

      {/* Payroll Records */}
      {isLoading && (
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-6 text-center">
          <p className="text-slate-600 dark:text-slate-400">
            Loading payroll...
          </p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg p-6">
          <p className="text-red-600 dark:text-red-400">
            Error loading payroll. Please try again.
          </p>
        </div>
      )}

      {!isLoading && !error && (
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              Payroll History
            </h2>
          </div>
          <table className="w-full">
            <thead className="bg-slate-50 dark:bg-slate-700 border-b border-slate-200 dark:border-slate-600">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Employee ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Month
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Net Salary
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Basic Salary
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Bonus
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
              {payrollList.length > 0 ? (
                payrollList.map((record: any) => (
                  <tr
                    key={record.id}
                    className="hover:bg-slate-50 dark:hover:bg-slate-700/50"
                  >
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-slate-900 dark:text-slate-100">
                        {record.employeeId}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-slate-900 dark:text-slate-100">
                        {record.month}/{record.year}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                        ${record.netSalary?.toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-slate-900 dark:text-slate-100">
                        ${record.basicSalary?.toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-300">
                        ${record.bonus?.toLocaleString()}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-2">
                        <Link
                          href={`/dashboard/payroll/${record.id}`}
                          className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300"
                        >
                          View
                        </Link>
                        <button
                          onClick={() => {
                            if (confirm("Delete this payroll record?")) {
                              deletePayroll(record.id);
                            }
                          }}
                          className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-4 text-center text-slate-500 dark:text-slate-400"
                  >
                    No payroll records found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
