"use client";

import { DollarSign, Calendar, FileText } from "lucide-react";
import Link from "next/link";
import { useGetAllPayroll, useDeletePayroll } from "@/hooks/payroll-query";
import { useGetAllEmployees } from "@/hooks/employee-query";
import { useState } from "react";

export default function PayrollPage() {
  // Pagination
  const PAGE_SIZE = 7;
  const [currentPage, setCurrentPage] = useState(1);

  // Get current user employeeId
  let currentEmployeeId = "";
  if (typeof window !== "undefined") {
    currentEmployeeId = localStorage.getItem("employeeId") || "";
  }
  const { data: payroll, isLoading, error } = useGetAllPayroll();
  const { mutate: deletePayroll } = useDeletePayroll();
  const { data: employeesResponse } = useGetAllEmployees();

  const payrollList = Array.isArray(payroll)
    ? payroll
    : Array.isArray(payroll?.data)
      ? payroll.data
      : [];

  // Filter payroll for current user
  const filteredPayroll = payrollList.filter(
    (r: any) => String(r.employeeId) === currentEmployeeId,
  );

  // Paginate
  const totalPages = Math.ceil(filteredPayroll.length / PAGE_SIZE);
  const paginatedPayroll = filteredPayroll.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  const employees = Array.isArray(employeesResponse)
    ? employeesResponse
    : Array.isArray(employeesResponse?.data)
      ? employeesResponse.data
      : [];

  // Show summary for current user only
  const totalNetSalary = filteredPayroll.reduce(
    (sum: number, r: any) => sum + (r.netSalary || 0),
    0,
  );
  const avgSalary =
    filteredPayroll.length > 0
      ? Math.round(
          filteredPayroll.reduce(
            (sum: number, r: any) => sum + (r.netSalary || 0),
            0,
          ) / filteredPayroll.length,
        )
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
                {filteredPayroll.length}
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
                  Full Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Month
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Year
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  View
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
              {paginatedPayroll.length > 0 ? (
                paginatedPayroll.map((record: any) => {
                  const emp = employees.find(
                    (e: any) => String(e.id) === String(record.employeeId),
                  );
                  const monthNames = [
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
                  const monthIndex = Number(record.month) - 1;
                  const monthName =
                    monthIndex >= 0 && monthIndex < 12
                      ? monthNames[monthIndex]
                      : "—";
                  return (
                    <tr
                      key={record.id}
                      className="hover:bg-slate-50 dark:hover:bg-slate-700/50"
                    >
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-slate-900 dark:text-slate-100">
                          {`EMP-${record.employeeId}`}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-slate-900 dark:text-slate-100">
                          {emp?.fullName || emp?.username || "—"}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-slate-900 dark:text-slate-100">
                          {emp?.email || "—"}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-slate-900 dark:text-slate-100">
                          {monthName}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-slate-900 dark:text-slate-100">
                          {record.year || "—"}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <Link
                          href={`/dashboard/payroll/${record.id}`}
                          className="text-blue-600 hover:underline text-sm font-medium"
                        >
                          View
                        </Link>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-4 text-center text-slate-500 dark:text-slate-400"
                  >
                    No payroll records found
                  </td>
                </tr>
              )}
            </tbody>
            {/* Pagination Controls */}
            {filteredPayroll.length > 0 && (
              <tfoot>
                <tr>
                  <td colSpan={6} className="px-6 py-4">
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        Showing {(currentPage - 1) * PAGE_SIZE + 1}–
                        {Math.min(
                          currentPage * PAGE_SIZE,
                          filteredPayroll.length,
                        )}{" "}
                        of {filteredPayroll.length} records
                      </p>
                      {totalPages > 1 && (
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() =>
                              setCurrentPage((p: number) => Math.max(1, p - 1))
                            }
                            disabled={currentPage === 1}
                            className="px-3 py-1 text-sm rounded-md border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed"
                          >
                            Previous
                          </button>
                          {Array.from(
                            { length: totalPages },
                            (_, i) => i + 1,
                          ).map((page) => (
                            <button
                              key={page}
                              onClick={() => setCurrentPage(page)}
                              className={`px-3 py-1 text-sm rounded-md ${
                                page === currentPage
                                  ? "bg-blue-600 text-white"
                                  : "border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                              }`}
                            >
                              {page}
                            </button>
                          ))}
                          <button
                            onClick={() =>
                              setCurrentPage((p: number) =>
                                Math.min(totalPages, p + 1),
                              )
                            }
                            disabled={currentPage === totalPages}
                            className="px-3 py-1 text-sm rounded-md border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed"
                          >
                            Next
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      )}
    </div>
  );
}
