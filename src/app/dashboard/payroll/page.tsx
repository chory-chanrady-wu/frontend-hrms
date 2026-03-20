"use client";

import Link from "next/link";
import { useGetAllPayroll } from "@/hooks/payroll-query";
import { useGetAllEmployees } from "@/hooks/employee-query";
import { useState, useEffect } from "react";
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

  // Get current user employeeId (reactive)
  const [currentEmployeeId, setCurrentEmployeeId] = useState("");
  // Read from localStorage on client only
  useEffect(() => {
    if (typeof window !== "undefined") {
      // Try both keys: 'employeeId' and from user object
      let empId = localStorage.getItem("employeeId");
      if (!empId) {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          try {
            const userObj = JSON.parse(storedUser);
            if (userObj && userObj.employeeId) {
              empId = String(userObj.employeeId);
            }
          } catch {}
        }
      }
      setCurrentEmployeeId(empId || "");
      // Debug log: show current employeeId from localStorage
      // eslint-disable-next-line no-console
      console.log(
        "[Payroll Debug] currentEmployeeId from localStorage:",
        empId,
      );
    }
  }, []);
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
  // Debug log: show all payroll records
  // eslint-disable-next-line no-console
  console.log("[Payroll Debug] payrollList:", payrollList);

  // Filter payroll for current user unless admin
  const isAdmin = userRole.toLowerCase() === "admin";
  const filteredPayroll = isAdmin
    ? payrollList
    : payrollList.filter(
        (r) => String(r.employeeId) === String(currentEmployeeId),
      );
  // Debug log: show filtered payroll for current user
  // eslint-disable-next-line no-console
  console.log("[Payroll Debug] filteredPayroll:", filteredPayroll);

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
                    {isAdmin
                      ? "No payroll records found"
                      : "You have no payroll records yet"}
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
