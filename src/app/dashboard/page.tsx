"use client";

import "../../styles/globals.css";
import {
  Users,
  CheckCircle,
  Clock,
  Calendar,
  Loader2,
  LogIn,
  LogOut,
  TrendingUp,
  AlertCircle,
} from "lucide-react";
import { useGetAllEmployees } from "@/hooks/employee-query";
import { useGetAllAttendance } from "@/hooks/attendance-query";
import { useGetAllLeaveRequests } from "@/hooks/leave-query";

function formatDate(datetime: string) {
  if (!datetime) return "—";
  const d = new Date(datetime);
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function formatTime(datetime: string) {
  if (!datetime) return "—";
  const d = new Date(datetime);
  return d.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

export default function DashboardPage() {
  const { data: employeesResponse, isLoading: loadingEmp } =
    useGetAllEmployees();
  const { data: attendanceResponse, isLoading: loadingAtt } =
    useGetAllAttendance();
  const { data: leaveResponse, isLoading: loadingLeave } =
    useGetAllLeaveRequests();

  const employees = Array.isArray(employeesResponse)
    ? employeesResponse
    : Array.isArray(employeesResponse?.data)
      ? employeesResponse.data
      : [];

  const attendanceList = Array.isArray(attendanceResponse)
    ? attendanceResponse
    : Array.isArray(attendanceResponse?.data)
      ? attendanceResponse.data
      : [];

  const leaveRequests = Array.isArray(leaveResponse)
    ? leaveResponse
    : Array.isArray(leaveResponse?.data)
      ? leaveResponse.data
      : [];

  // Build employee ID → name map
  const employeeMap: Record<number, string> = {};
  employees.forEach((emp: any) => {
    employeeMap[emp.id] = emp.fullName || emp.username || `Employee #${emp.id}`;
  });

  const totalEmployees = employees.length;
  const presentToday = attendanceList.filter(
    (a: any) => a.status === "present" || a.status === "Present",
  ).length;
  const pendingRequests = leaveRequests.filter(
    (l: any) => l.status === "pending" || l.status === "Pending",
  ).length;
  const onLeave = leaveRequests.filter(
    (l: any) => l.status === "approved" || l.status === "Approved",
  ).length;

  const isLoading = loadingEmp || loadingAtt || loadingLeave;

  // Recent attendance (latest 5)
  const recentAttendance = [...attendanceList]
    .sort(
      (a: any, b: any) =>
        new Date(b.checkIn).getTime() - new Date(a.checkIn).getTime(),
    )
    .slice(0, 5);

  // Recent leave requests (latest 5)
  const recentLeaves = [...leaveRequests]
    .sort(
      (a: any, b: any) =>
        new Date(b.createdAt || b.startDate).getTime() -
        new Date(a.createdAt || a.startDate).getTime(),
    )
    .slice(0, 5);

  const getStatusBadge = (status: string) => {
    const s = status?.toLowerCase();
    if (s === "present")
      return "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300";
    if (s === "absent")
      return "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300";
    if (s === "late")
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300";
    return "bg-gray-100 text-gray-800 dark:bg-gray-900/40 dark:text-gray-300";
  };

  const getLeaveBadge = (status: string) => {
    const s = status?.toLowerCase();
    if (s === "approved")
      return "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300";
    if (s === "rejected")
      return "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300";
    return "bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300";
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-600 dark:text-slate-100 mb-6">
        Dashboard
      </h1>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      ) : (
        <>
          {/* Stats Cards */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-lg bg-blue-50 dark:bg-blue-900/30 p-6 border border-blue-100 dark:border-blue-800">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
                    Total Employees
                  </p>
                  <p className="mt-2 text-3xl font-bold text-blue-900 dark:text-blue-200">
                    {totalEmployees}
                  </p>
                </div>
                <Users className="h-10 w-10 text-blue-600 dark:text-blue-400 opacity-30" />
              </div>
            </div>

            <div className="rounded-lg bg-green-50 dark:bg-green-900/30 p-6 border border-green-100 dark:border-green-800">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-600 dark:text-green-400">
                    Present Today
                  </p>
                  <p className="mt-2 text-3xl font-bold text-green-900 dark:text-green-200">
                    {presentToday}
                  </p>
                </div>
                <CheckCircle className="h-10 w-10 text-green-600 dark:text-green-400 opacity-30" />
              </div>
            </div>

            <div className="rounded-lg bg-orange-50 dark:bg-orange-900/30 p-6 border border-orange-100 dark:border-orange-800">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-orange-600 dark:text-orange-400">
                    Pending Requests
                  </p>
                  <p className="mt-2 text-3xl font-bold text-orange-900 dark:text-orange-200">
                    {pendingRequests}
                  </p>
                </div>
                <Clock className="h-10 w-10 text-orange-600 dark:text-orange-400 opacity-30" />
              </div>
            </div>

            <div className="rounded-lg bg-purple-50 dark:bg-purple-900/30 p-6 border border-purple-100 dark:border-purple-800">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-600 dark:text-purple-400">
                    On Leave
                  </p>
                  <p className="mt-2 text-3xl font-bold text-purple-900 dark:text-purple-200">
                    {onLeave}
                  </p>
                </div>
                <Calendar className="h-10 w-10 text-purple-600 dark:text-purple-400 opacity-30" />
              </div>
            </div>
          </div>

          {/* Recent Activity - Two columns */}
          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            {/* Recent Attendance */}
            <div>
              <h2 className="text-lg font-semibold text-gray-600 dark:text-slate-100 mb-4 flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Recent Attendance
              </h2>
              <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden">
                {recentAttendance.length > 0 ? (
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
                        <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">
                          Employee
                        </th>
                        <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">
                          Date
                        </th>
                        <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">
                          Check In
                        </th>
                        <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentAttendance.map((att: any, index: number) => (
                        <tr
                          key={att.id || index}
                          className="border-b last:border-b-0 border-slate-200 dark:border-slate-700"
                        >
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <div className="h-7 w-7 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center">
                                <span className="text-xs font-semibold text-blue-700 dark:text-blue-300">
                                  {(att.employeeName || "?")
                                    .charAt(0)
                                    .toUpperCase()}
                                </span>
                              </div>
                              <span className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate max-w-30">
                                {att.employeeName || `#${att.employeeId}`}
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-300">
                            {formatDate(att.checkIn)}
                          </td>
                          <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-300">
                            <span className="flex items-center gap-1">
                              <LogIn className="h-3 w-3 text-green-500" />
                              {formatTime(att.checkIn)}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <span
                              className={`inline-flex px-2 py-0.5 text-xs font-semibold rounded-full ${getStatusBadge(att.status)}`}
                            >
                              {att.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="px-6 py-8 text-center text-slate-500 dark:text-slate-400">
                    No attendance records
                  </div>
                )}
              </div>
            </div>

            {/* Recent Leave Requests */}
            <div>
              <h2 className="text-lg font-semibold text-gray-600 dark:text-slate-100 mb-4 flex items-center gap-2">
                <AlertCircle className="h-5 w-5" />
                Recent Leave Requests
              </h2>
              <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden">
                {recentLeaves.length > 0 ? (
                  <div className="space-y-0">
                    {recentLeaves.map((leave: any, index: number) => (
                      <div
                        key={leave.id || index}
                        className={`flex items-center justify-between px-4 py-4 ${index > 0 ? "border-t border-slate-200 dark:border-slate-700" : ""}`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="h-8 w-8 rounded-full bg-purple-100 dark:bg-purple-900/40 flex items-center justify-center shrink-0">
                            <Calendar className="h-4 w-4 text-purple-600 dark:text-purple-300" />
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium text-sm text-slate-900 dark:text-slate-100 truncate">
                              {leave.employeeName ||
                                employeeMap[leave.employeeId] ||
                                `Employee #${leave.employeeId}`}
                            </p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                              {formatDate(leave.startDate)} —{" "}
                              {formatDate(leave.endDate)}
                              {leave.reason ? ` • ${leave.reason}` : ""}
                            </p>
                          </div>
                        </div>
                        <span
                          className={`inline-flex px-2.5 py-0.5 text-xs font-semibold rounded-full shrink-0 ${getLeaveBadge(leave.status)}`}
                        >
                          {leave.status}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="px-6 py-8 text-center text-slate-500 dark:text-slate-400">
                    No recent leave requests
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
