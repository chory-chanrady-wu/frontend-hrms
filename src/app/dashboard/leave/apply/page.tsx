"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Calendar, Loader2 } from "lucide-react";
import Link from "next/link";
import {
  useCreateLeaveRequest,
  useGetAllLeaveTypes,
} from "@/hooks/leave-query";
import { useGetAllEmployees } from "@/hooks/employee-query";

export default function ApplyLeavePage() {
  const router = useRouter();
  const { mutate: createLeaveRequest, isPending } = useCreateLeaveRequest();
  const { data: leaveTypesResponse } = useGetAllLeaveTypes();
  const { data: employeesResponse } = useGetAllEmployees();

  const leaveTypes = Array.isArray(leaveTypesResponse)
    ? leaveTypesResponse
    : Array.isArray(leaveTypesResponse?.data)
      ? leaveTypesResponse.data
      : [];

  const employees = Array.isArray(employeesResponse)
    ? employeesResponse
    : Array.isArray(employeesResponse?.data)
      ? employeesResponse.data
      : [];

  const [formData, setFormData] = useState({
    employeeId: "",
    leaveTypeId: "",
    startDate: "",
    endDate: "",
    reason: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createLeaveRequest(
      {
        employeeId: Number(formData.employeeId),
        leaveTypeId: Number(formData.leaveTypeId),
        startDate: formData.startDate,
        endDate: formData.endDate,
        reason: formData.reason,
        status: "pending",
      },
      {
        onSuccess: () => router.push("/dashboard/leave"),
        onError: (err) => alert("Failed to submit: " + (err as Error).message),
      },
    );
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <Link
          href="/dashboard/leave"
          className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition"
        >
          <ArrowLeft className="h-5 w-5 text-slate-600 dark:text-slate-400" />
        </Link>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
          Apply for Leave
        </h1>
      </div>

      <div className="max-w-3xl">
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="employeeId"
                className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
              >
                Employee *
              </label>
              <select
                id="employeeId"
                name="employeeId"
                value={formData.employeeId}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              >
                <option value="">Select employee</option>
                {employees.map((emp: any) => (
                  <option key={emp.id} value={emp.id}>
                    {emp.fullName || emp.username || `Employee #${emp.id}`}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="leaveTypeId"
                className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
              >
                Leave Type *
              </label>
              <select
                id="leaveTypeId"
                name="leaveTypeId"
                value={formData.leaveTypeId}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              >
                <option value="">Select leave type</option>
                {leaveTypes.map((lt: any) => (
                  <option key={lt.id} value={lt.id}>
                    {lt.name} ({lt.daysAllowed} days)
                  </option>
                ))}
              </select>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label
                  htmlFor="startDate"
                  className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
                >
                  Start Date *
                </label>
                <div className="relative">
                  <input
                    type="date"
                    id="startDate"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="endDate"
                  className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
                >
                  End Date *
                </label>
                <div className="relative">
                  <input
                    type="date"
                    id="endDate"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                </div>
              </div>
            </div>

            <div>
              <label
                htmlFor="reason"
                className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
              >
                Reason *
              </label>
              <textarea
                id="reason"
                name="reason"
                value={formData.reason}
                onChange={handleChange}
                required
                rows={5}
                className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                placeholder="Please provide a reason for your leave request..."
              />
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <p className="text-sm text-blue-900 dark:text-blue-200">
                Your request will be reviewed by your manager and HR department.
              </p>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                disabled={isPending}
                className="bg-linear-to-r from-[#0C4A6E] to-[#075985] text-white px-6 py-2 rounded-lg font-medium hover:shadow-lg transition-all disabled:opacity-50 flex items-center gap-2"
              >
                {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                Submit Request
              </button>
              <Link
                href="/dashboard/leave"
                className="bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 px-6 py-2 rounded-lg font-medium hover:bg-slate-50 dark:hover:bg-slate-600 transition"
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
