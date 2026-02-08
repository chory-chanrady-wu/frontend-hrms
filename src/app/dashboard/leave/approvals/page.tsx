"use client";

import { Check, X } from "lucide-react";

const pendingRequests = [
  {
    id: 1,
    employeeName: "Alice Johnson",
    department: "Marketing",
    leaveType: "Annual Leave",
    startDate: "2026-02-15",
    endDate: "2026-02-18",
    days: 4,
    requestDate: "2026-02-05",
    reason: "Family vacation",
  },
  {
    id: 2,
    employeeName: "Bob Smith",
    department: "Engineering",
    leaveType: "Sick Leave",
    startDate: "2026-02-10",
    endDate: "2026-02-12",
    days: 3,
    requestDate: "2026-02-09",
    reason: "Medical appointment and recovery",
  },
  {
    id: 3,
    employeeName: "Carol Williams",
    department: "Sales",
    leaveType: "Personal Leave",
    startDate: "2026-02-20",
    endDate: "2026-02-21",
    days: 2,
    requestDate: "2026-02-07",
    reason: "Personal matters",
  },
];

export default function LeaveApprovalsPage() {
  const handleApprove = (id: number) => {
    console.log("Approving request:", id);
    // TODO: Implement approval logic
  };

  const handleReject = (id: number) => {
    console.log("Rejecting request:", id);
    // TODO: Implement rejection logic
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Leave Approvals</h1>
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <span className="text-slate-600">Pending Requests:</span>
            <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full font-semibold">
              {pendingRequests.length}
            </span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 flex gap-4">
        <select className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none">
          <option>All Departments</option>
          <option>Engineering</option>
          <option>Marketing</option>
          <option>Sales</option>
          <option>HR</option>
        </select>
        <select className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none">
          <option>All Leave Types</option>
          <option>Annual Leave</option>
          <option>Sick Leave</option>
          <option>Personal Leave</option>
        </select>
      </div>

      {/* Requests List */}
      <div className="space-y-4">
        {pendingRequests.map((request) => (
          <div
            key={request.id}
            className="bg-white border border-slate-200 rounded-lg p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-3">
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                    <span className="text-lg font-semibold text-blue-600">
                      {request.employeeName.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">
                      {request.employeeName}
                    </h3>
                    <p className="text-sm text-slate-600">
                      {request.department}
                    </p>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-3 mb-4">
                  <div>
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">
                      Leave Type
                    </p>
                    <p className="text-sm font-medium text-slate-900">
                      {request.leaveType}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">
                      Duration
                    </p>
                    <p className="text-sm font-medium text-slate-900">
                      {request.startDate} to {request.endDate}
                    </p>
                    <p className="text-xs text-slate-600">
                      {request.days} days
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">
                      Requested On
                    </p>
                    <p className="text-sm font-medium text-slate-900">
                      {new Date(request.requestDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="bg-slate-50 rounded-lg p-4">
                  <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">
                    Reason
                  </p>
                  <p className="text-sm text-slate-700">{request.reason}</p>
                </div>
              </div>

              <div className="flex flex-col gap-2 ml-6">
                <button
                  onClick={() => handleApprove(request.id)}
                  className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition"
                >
                  <Check className="h-4 w-4" />
                  Approve
                </button>
                <button
                  onClick={() => handleReject(request.id)}
                  className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-700 transition"
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
        <div className="text-center py-12 bg-white border border-slate-200 rounded-lg">
          <p className="text-slate-600">No pending leave requests</p>
        </div>
      )}
    </div>
  );
}
