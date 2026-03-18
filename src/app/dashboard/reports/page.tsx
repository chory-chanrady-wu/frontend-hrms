"use client";

import { FileText, Download, TrendingUp } from "lucide-react";
import Link from "next/link";

import { useGetAllAttendance } from "@/hooks/attendance-query";
import { useGetAllPayroll } from "@/hooks/payroll-query";
import { useGetAllAuditLogs } from "@/hooks/audit-log-query";

export default function ReportsPage() {
  // Fetch attendance, payroll, and audit logs as report categories
  const {
    data: attendanceData,
    isLoading: loadingAttendance,
    error: errorAttendance,
  } = useGetAllAttendance();
  const {
    data: payrollData,
    isLoading: loadingPayroll,
    error: errorPayroll,
  } = useGetAllPayroll();
  const {
    data: auditLogsData,
    isLoading: loadingAudit,
    error: errorAudit,
  } = useGetAllAuditLogs();

  // Build report categories from API
  const reportCategories = [
    {
      id: 1,
      title: "Attendance Reports",
      description: "Daily, weekly, and monthly attendance tracking",
      href: "/dashboard/reports/attendance",
      icon: FileText,
      count: attendanceData?.length || 0,
      loading: loadingAttendance,
      error: errorAttendance,
    },
    {
      id: 2,
      title: "Payroll Reports",
      description: "Salary, bonuses, and deductions summary",
      href: "/dashboard/reports/payroll",
      icon: FileText,
      count: payrollData?.length || 0,
      loading: loadingPayroll,
      error: errorPayroll,
    },
    {
      id: 3,
      title: "Performance Reports",
      description: "Employee performance reviews and ratings",
      href: "/dashboard/reports/performance",
      icon: TrendingUp,
      count: auditLogsData?.length || 0,
      loading: loadingAudit,
      error: errorAudit,
    },
  ];
  // Get user role from localStorage
  let userRole = "";
  const storedUser =
    typeof window !== "undefined" ? localStorage.getItem("user") : null;
  if (storedUser) {
    try {
      const userObj = JSON.parse(storedUser);
      userRole = userObj.role || userObj.roleName || userObj.permission || "";
    } catch {}
  }

  // Only allow admin and hr to view dashboard
  if (userRole.toLowerCase() !== "admin" && userRole.toLowerCase() !== "hr") {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <h1 className="text-2xl font-semibold text-red-600 mb-4">
          Not Authorized
        </h1>
        <p className="text-lg text-gray-600">
          You do not have access to the dashboard.
        </p>
      </div>
    );
  }
  // Example: Recent reports from audit logs
  const recentReports = Array.isArray(auditLogsData)
    ? auditLogsData.slice(0, 3).map((log) => ({
        name: log.action || "Report",
        date: log.createdAt || new Date().toISOString(),
        type: log.tableName || "Performance",
      }))
    : [];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Reports</h1>
        <button className="bg-linear-to-r from-[#0C4A6E] to-[#075985] text-white px-4 py-2 rounded-lg font-medium hover:shadow-lg transition-all flex items-center gap-2">
          <Download className="h-4 w-4" />
          Export All
        </button>
      </div>

      {/* Report Categories */}
      <div className="grid gap-6 md:grid-cols-3 mb-8">
        {reportCategories.map((category) => {
          const Icon = category.icon;
          if (category.loading) {
            return (
              <div
                key={category.id}
                className="bg-white border border-slate-200 rounded-lg p-6 text-center"
              >
                <span className="text-slate-500">Loading...</span>
              </div>
            );
          }
          if (category.error) {
            return (
              <div
                key={category.id}
                className="bg-white border border-slate-200 rounded-lg p-6 text-center"
              >
                <span className="text-red-500">
                  Error loading {category.title}
                </span>
              </div>
            );
          }
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
            {recentReports.length === 0 ? (
              <div className="text-slate-500">No recent reports found.</div>
            ) : (
              recentReports.map((report, index) => (
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
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
