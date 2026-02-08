"use client";

import { Calendar, Clock, FileText } from "lucide-react";
import Link from "next/link";

const myLeaveRequests = [
  {
    id: 1,
    type: "Annual Leave Request",
    startDate: "2026-02-11",
    endDate: "2026-02-12",
    days: 1.5,
    status: "Pending Approval",
    requestedBy: "Myself",
    requestDate: "2026-02-03",
    reason:
      "Dear Management, I would like to request leave for 1.5 day from 11-February-2026 (afternoon) to 12-Februar...",
  },
  {
    id: 2,
    type: "Annual Leave Request",
    startDate: "2026-02-17",
    endDate: "2026-02-17",
    days: 1,
    status: "Pending Approval",
    requestedBy: "Myself",
    requestDate: "2026-02-03",
    reason:
      "Dear Management, I would like to request leave for one day on 17-February-2026. Request I have to go to...",
  },
];

export default function LeavePage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-900">My Requests</h1>
        <div className="flex gap-3">
          <Link
            href="/dashboard/leave/approvals"
            className="bg-white border border-slate-300 text-slate-700 px-4 py-2 rounded-lg font-medium hover:bg-slate-50 transition flex items-center gap-2"
          >
            <FileText className="h-4 w-4" />
            Approvals
          </Link>
          <Link
            href="/dashboard/leave/apply"
            className="bg-gradient-to-r from-[#0C4A6E] to-[#075985] text-white px-4 py-2 rounded-lg font-medium hover:shadow-lg transition-all"
          >
            Apply for Leave
          </Link>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-6 md:grid-cols-4 mb-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <p className="text-sm font-medium text-blue-600">
            Total Leave Balance
          </p>
          <p className="text-3xl font-bold text-blue-900 mt-2">18 days</p>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <p className="text-sm font-medium text-green-600">Used</p>
          <p className="text-3xl font-bold text-green-900 mt-2">7 days</p>
        </div>
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
          <p className="text-sm font-medium text-orange-600">Pending</p>
          <p className="text-3xl font-bold text-orange-900 mt-2">2.5 days</p>
        </div>
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
          <p className="text-sm font-medium text-purple-600">Remaining</p>
          <p className="text-3xl font-bold text-purple-900 mt-2">10.5 days</p>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-white border border-slate-300 rounded-lg font-medium text-slate-700 hover:bg-slate-50 transition">
            Filter
          </button>
          <select className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none">
            <option>All Status</option>
            <option>Pending</option>
            <option>Approved</option>
            <option>Rejected</option>
          </select>
        </div>
        <button className="px-4 py-2 bg-gradient-to-r from-[#0C4A6E] to-[#075985] text-white rounded-lg font-medium hover:shadow-lg transition-all">
          Action
        </button>
      </div>

      {/* Requests Table */}
      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Request Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Requested By
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Remark
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Approval
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {myLeaveRequests.map((request) => (
              <tr key={request.id} className="hover:bg-slate-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-slate-900">
                    {request.requestDate}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-slate-900">
                    {request.type}
                  </div>
                  <div className="text-xs text-slate-500">
                    {request.startDate} - {request.endDate}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-slate-900">
                    {request.requestedBy}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-slate-600 max-w-md truncate">
                    {request.reason}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex px-3 py-1 text-xs font-semibold rounded-full bg-orange-100 text-orange-800">
                    {request.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
