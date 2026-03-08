"use client";

import { Check, X, Loader2 } from "lucide-react";
import {
  useGetAllLeaveRequests,
  useUpdateLeaveRequest,
} from "@/hooks/leave-query";

export default function LeaveApprovalsPage() {
  const { data: leaveResponse, isLoading, error } = useGetAllLeaveRequests();
  const { mutate: updateLeaveRequest, isPending } = useUpdateLeaveRequest();

  const allRequests = Array.isArray(leaveResponse)
    ? leaveResponse
    : Array.isArray(leaveResponse?.data)
      ? leaveResponse.data
      : [];

  const pendingRequests = allRequests.filter(
    (r: any) => r.status === "pending" || r.status === "Pending",
  );

  const handleApprove = (request: any) => {
    updateLeaveRequest({
      id: request.id,
      lrData: {
        employeeId: request.employeeId,
        leaveTypeId: request.leaveTypeId,
        startDate: request.startDate,
        endDate: request.endDate,
        reason: request.reason,
        status: "approved",
      },
    });
  };

  const handleReject = (request: any) => {
    updateLeaveRequest({
      id: request.id,
      lrData: {
        employeeId: request.employeeId,
        leaveTypeId: request.leaveTypeId,
        startDate: request.startDate,
        endDate: request.endDate,
        reason: request.reason,
        status: "rejected",
      },
    });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
          Leave Approvals
        </h1>
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <span className="text-slate-600 dark:text-slate-400">
              Pending Requests:
            </span>
            <span className="px-3 py-1 bg-orange-100 dark:bg-orange-900/40 text-orange-800 dark:text-orange-300 rounded-full font-semibold">
              {pendingRequests.length}
            </span>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      ) : error ? (
        <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg p-6">
          <p className="text-red-600 dark:text-red-400">
            Error loading leave requests.
          </p>
        </div>
      ) : (
        <>
          {/* Requests List */}
          <div className="space-y-4">
            {pendingRequests.map((request: any) => (
              <div
                key={request.id}
                className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-3">
                      <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center">
                        <span className="text-lg font-semibold text-blue-600 dark:text-blue-300">
                          #{request.employeeId}
                        </span>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                          Employee #{request.employeeId}
                        </h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          Leave Type #{request.leaveTypeId}
                        </p>
                      </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-3 mb-4">
                      <div>
                        <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                          Duration
                        </p>
                        <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                          {request.startDate} to {request.endDate}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                          Status
                        </p>
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-orange-100 dark:bg-orange-900/40 text-orange-800 dark:text-orange-300">
                          {request.status}
                        </span>
                      </div>
                    </div>

                    {request.reason && (
                      <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-4">
                        <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                          Reason
                        </p>
                        <p className="text-sm text-slate-700 dark:text-slate-300">
                          {request.reason}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col gap-2 ml-6">
                    <button
                      onClick={() => handleApprove(request)}
                      disabled={isPending}
                      className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition disabled:opacity-50"
                    >
                      <Check className="h-4 w-4" />
                      Approve
                    </button>
                    <button
                      onClick={() => handleReject(request)}
                      disabled={isPending}
                      className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-700 transition disabled:opacity-50"
                    >
                      <X className="h-4 w-4" />
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {pendingRequests.length === 0 && (
            <div className="text-center py-12 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg">
              <p className="text-slate-600 dark:text-slate-400">
                No pending leave requests
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
