"use client";

import { useState } from "react";
import { Calendar, Clock, FileText, Trash2 } from "lucide-react";
import Link from "next/link";
import {
  useGetAllLeaveRequests,
  useDeleteLeaveRequest,
} from "@/hooks/leave-query";

export default function LeavePage() {
  const { data: leaveResponse, isLoading, error } = useGetAllLeaveRequests();
  const { mutate: deleteLeaveRequest } = useDeleteLeaveRequest();
  const [statusFilter, setStatusFilter] = useState("all");

  const leaveRequests = Array.isArray(leaveResponse)
    ? leaveResponse
    : Array.isArray(leaveResponse?.data)
      ? leaveResponse.data
      : [];

  const totalRequests = leaveRequests.length;
  const approvedCount = leaveRequests.filter(
    (l: any) => l.status === "approved" || l.status === "Approved",
  ).length;
  const pendingCount = leaveRequests.filter(
    (l: any) => l.status === "pending" || l.status === "Pending",
  ).length;
  const rejectedCount = leaveRequests.filter(
    (l: any) => l.status === "rejected" || l.status === "Rejected",
  ).length;

  const filteredRequests =
    statusFilter === "all"
      ? leaveRequests
      : leaveRequests.filter(
          (l: any) => l.status?.toLowerCase() === statusFilter,
        );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
          My Requests
        </h1>
        <div className="flex gap-3">
          <Link
            href="/dashboard/leave/approvals"
            className="bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 px-4 py-2 rounded-lg font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition flex items-center gap-2"
          >
            <FileText className="h-4 w-4" />
            Approvals
          </Link>
          <Link
            href="/dashboard/leave/apply"
            className="bg-linear-to-r from-[#0C4A6E] to-[#075985] text-white px-4 py-2 rounded-lg font-medium hover:shadow-lg transition-all"
          >
            Apply for Leave
          </Link>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-6 md:grid-cols-4 mb-6">
        <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
          <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
            Total Requests
          </p>
          <p className="text-3xl font-bold text-blue-900 dark:text-blue-200 mt-2">
            {totalRequests}
          </p>
        </div>
        <div className="bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-lg p-6">
          <p className="text-sm font-medium text-green-600 dark:text-green-400">
            Approved
          </p>
          <p className="text-3xl font-bold text-green-900 dark:text-green-200 mt-2">
            {approvedCount}
          </p>
        </div>
        <div className="bg-orange-50 dark:bg-orange-900/30 border border-orange-200 dark:border-orange-800 rounded-lg p-6">
          <p className="text-sm font-medium text-orange-600 dark:text-orange-400">
            Pending
          </p>
          <p className="text-3xl font-bold text-orange-900 dark:text-orange-200 mt-2">
            {pendingCount}
          </p>
        </div>
        <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg p-6">
          <p className="text-sm font-medium text-red-600 dark:text-red-400">
            Rejected
          </p>
          <p className="text-3xl font-bold text-red-900 dark:text-red-200 mt-2">
            {rejectedCount}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 flex items-center gap-3">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {/* Requests Table */}
      {isLoading ? (
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-6 text-center">
          <p className="text-slate-600 dark:text-slate-400">
            Loading leave requests...
          </p>
        </div>
      ) : error ? (
        <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg p-6">
          <p className="text-red-600 dark:text-red-400">
            Error loading leave requests.
          </p>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-50 dark:bg-slate-700 border-b border-slate-200 dark:border-slate-600">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Employee ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Duration
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Reason
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
              {filteredRequests.length > 0 ? (
                filteredRequests.map((request: any) => (
                  <tr
                    key={request.id}
                    className="hover:bg-slate-50 dark:hover:bg-slate-700/50"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-slate-900 dark:text-slate-100">
                        #{request.employeeId}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-slate-900 dark:text-slate-100">
                        {request.startDate} — {request.endDate}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-slate-600 dark:text-slate-400 max-w-md truncate">
                        {request.reason || "—"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                          request.status === "approved" ||
                          request.status === "Approved"
                            ? "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300"
                            : request.status === "rejected" ||
                                request.status === "Rejected"
                              ? "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300"
                              : "bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300"
                        }`}
                      >
                        {request.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <button
                        onClick={() => {
                          if (
                            confirm(
                              "Are you sure you want to delete this leave request?",
                            )
                          ) {
                            deleteLeaveRequest(request.id);
                          }
                        }}
                        className="p-1.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-8 text-center text-slate-500 dark:text-slate-400"
                  >
                    No leave requests found
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
