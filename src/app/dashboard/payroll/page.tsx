"use client";

import { DollarSign, Calendar } from "lucide-react";
import Link from "next/link";
import { useGetAllPayroll } from "@/hooks/payroll-query";
import { useGetAllEmployees } from "@/hooks/employee-query";
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { EmployeeProfile } from "@/lib/types";

export default function PayrollPage() {
  // Get user role from localStorage
  let userRole = "";
  if (typeof window !== "undefined") {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const userObj = JSON.parse(storedUser);
        if (typeof userObj === "object" && userObj !== null) {
          if ("role" in userObj && typeof userObj.role === "string") {
            userRole = userObj.role;
          } else if (
            "roleName" in userObj &&
            typeof userObj.roleName === "string"
          ) {
            userRole = userObj.roleName;
          } else if (
            "permission" in userObj &&
            typeof userObj.permission === "string"
          ) {
            userRole = userObj.permission;
          }
        }
      } catch {}
    }
  }
  // Year-based pagination
  const [selectedYear, setSelectedYear] = useState<number | null>(null);

  // Get current user employeeId
  let currentEmployeeId = "";
  if (typeof window !== "undefined") {
    currentEmployeeId = localStorage.getItem("employeeId") || "";
  }
  const { data: payroll, isLoading, error } = useGetAllPayroll();
  const { data: employeesResponse } = useGetAllEmployees();

  type PayrollRecord = {
    id: number;
    employeeId: number;
    month: number;
    year: number;
    baseSalary: number;
    bonus: number;
    deduction: number;
    netSalary: number;
  };
  const payrollList: PayrollRecord[] = Array.isArray(payroll)
    ? payroll
    : Array.isArray(payroll?.data)
      ? payroll.data
      : [];

  // Filter payroll for current user
  const filteredPayroll = payrollList.filter(
    (r) => String(r.employeeId) === currentEmployeeId,
  );

  // Sort by year and month descending
  const sortedPayroll = [...filteredPayroll].sort((a, b) => {
    if (a.year !== b.year) return b.year - a.year;
    return b.month - a.month;
  });

  // Extract unique years (descending)
  const years = Array.from(new Set(sortedPayroll.map((r) => r.year))).sort(
    (a, b) => b - a,
  );
  // Set default selectedYear to most recent year
  if (selectedYear === null && years.length > 0) {
    setSelectedYear(years[0]);
  }

  // Filter payroll by selected year
  const yearPayroll = selectedYear
    ? sortedPayroll.filter((r) => r.year === selectedYear)
    : sortedPayroll;

  const employees: EmployeeProfile[] = Array.isArray(employeesResponse)
    ? employeesResponse
    : Array.isArray(employeesResponse?.data)
      ? employeesResponse.data
      : [];

  // Show summary for current user only (for selected year)
  const totalNetSalary = yearPayroll.reduce(
    (sum: number, r) => sum + (r.netSalary || 0),
    0,
  );
  const avgSalary =
    yearPayroll.length > 0
      ? Math.round(
          yearPayroll.reduce((sum: number, r) => sum + (r.netSalary || 0), 0) /
            yearPayroll.length,
        )
      : 0;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
          Payroll
        </h1>
        {userRole.toLowerCase() === "admin" && (
          <Link
            href="/dashboard/payroll/generate"
            className="bg-linear-to-r from-[#0C4A6E] to-[#075985] text-white px-4 py-2 rounded-lg font-medium hover:shadow-lg transition-all"
          >
            Generate Payroll
          </Link>
        )}
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
        <>
          {/* Year Pagination */}
          <div className="flex gap-2 mb-4">
            {years.map((year) => (
              <button
                key={year}
                onClick={() => setSelectedYear(year)}
                className={`px-4 py-2 rounded-md font-medium border transition-all ${
                  year === selectedYear
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-600"
                }`}
              >
                {year}
              </button>
            ))}
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee ID</TableHead>
                <TableHead>Full Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Month</TableHead>
                <TableHead>Year</TableHead>
                <TableHead>View</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {yearPayroll.length > 0 ? (
                yearPayroll.map((record) => {
                  const emp = employees.find(
                    (e) => String(e.id) === String(record.employeeId),
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
                    <TableRow key={record.id}>
                      <TableCell>{`EMP-${record.employeeId}`}</TableCell>
                      <TableCell>
                        {emp?.fullName || emp?.username || "—"}
                      </TableCell>
                      <TableCell>{emp?.email || "—"}</TableCell>
                      <TableCell>{monthName}</TableCell>
                      <TableCell>{record.year || "—"}</TableCell>
                      <TableCell>
                        <Link
                          href={`/dashboard/payroll/${record.id}`}
                          className="text-blue-600 hover:underline text-sm font-medium"
                        >
                          View
                        </Link>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center text-slate-500 dark:text-slate-400"
                  >
                    No payroll records found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </>
      )}

      {/* Pagination Controls removed: now year-based */}
    </div>
  );
}
