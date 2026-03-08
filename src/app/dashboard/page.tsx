"use client";

import "../../styles/globals.css";
import { Users, CheckCircle, Clock, Calendar, Loader2 } from "lucide-react";
import { useGetAllEmployees } from "@/hooks/employee-query";
import { useGetAllAttendance } from "@/hooks/attendance-query";
import { useGetAllLeaveRequests } from "@/hooks/leave-query";

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

  // Recent leave requests as activity
  const recentLeaves = [...leaveRequests]
    .sort(
      (a: any, b: any) =>
        new Date(b.createdAt || b.startDate).getTime() -
        new Date(a.createdAt || a.startDate).getTime(),
    )
    .slice(0, 5);

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

          {/* Recent Activity */}
          <div className="mt-8">
            <h2 className="text-lg font-semibold text-gray-600 dark:text-slate-100 mb-4">
              Recent Leave Requests
            </h2>
            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg">
              <div className="space-y-0">
                {recentLeaves.length > 0 ? (
                  recentLeaves.map((leave: any, index: number) => (
                    <div
                      key={leave.id || index}
                      className={`flex items-center justify-between px-6 py-4 ${index > 0 ? "border-t border-slate-200 dark:border-slate-700" : ""}`}
                    >
                      <div>
                        <p className="font-medium text-slate-900 dark:text-slate-100">
                          Employee #{leave.employeeId} — Leave Request
                        </p>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                          {leave.startDate} to {leave.endDate}{" "}
                          {leave.reason ? `• ${leave.reason}` : ""}
                        </p>
                      </div>
                      <span
                        className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                          leave.status === "approved" ||
                          leave.status === "Approved"
                            ? "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300"
                            : leave.status === "rejected" ||
                                leave.status === "Rejected"
                              ? "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300"
                              : "bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300"
                        }`}
                      >
                        {leave.status}
                      </span>
                    </div>
                  ))
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
