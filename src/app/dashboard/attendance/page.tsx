"use client";

import { useState } from "react";
import {
  Clock,
  Calendar,
  CheckCircle,
  XCircle,
  X,
  Loader2,
  Trash2,
  Pencil,
} from "lucide-react";
import {
  useGetAllAttendance,
  useCreateAttendance,
  useUpdateAttendance,
  useDeleteAttendance,
} from "@/hooks/attendance-query";
import { useGetAllEmployees } from "@/hooks/employee-query";

export default function AttendancePage() {
  const { data: attendance, isLoading, error } = useGetAllAttendance();
  const { mutate: createAttendance, isPending: isCreating } =
    useCreateAttendance();
  const { mutate: updateAttendance, isPending: isUpdating } =
    useUpdateAttendance();
  const { mutate: deleteAttendance } = useDeleteAttendance();
  const { data: empResponse } = useGetAllEmployees();

  const employees = Array.isArray(empResponse)
    ? empResponse
    : Array.isArray(empResponse?.data)
      ? empResponse.data
      : [];

  const attendanceList = Array.isArray(attendance)
    ? attendance
    : Array.isArray(attendance?.data)
      ? attendance.data
      : [];

  const presentCount = attendanceList.filter(
    (r: any) => r.status === "present" || r.status === "Present",
  ).length;
  const absentCount = attendanceList.filter(
    (r: any) => r.status === "absent" || r.status === "Absent",
  ).length;
  const onLeaveCount = attendanceList.filter(
    (r: any) =>
      r.status === "leave" || r.status === "Leave" || r.status === "on_leave",
  ).length;
  const lateCount = attendanceList.filter(
    (r: any) => r.status === "late" || r.status === "Late",
  ).length;

  const [showModal, setShowModal] = useState(false);
  const [editingRecord, setEditingRecord] = useState<any>(null);
  const [formData, setFormData] = useState({
    employeeId: "",
    date: new Date().toISOString().split("T")[0],
    status: "present",
    checkInTime: "",
    checkOutTime: "",
  });

  const resetForm = () => {
    setFormData({
      employeeId: "",
      date: new Date().toISOString().split("T")[0],
      status: "present",
      checkInTime: "",
      checkOutTime: "",
    });
    setEditingRecord(null);
  };

  const openCreate = () => {
    resetForm();
    setShowModal(true);
  };

  const openEdit = (record: any) => {
    setEditingRecord(record);
    setFormData({
      employeeId: String(record.employeeId),
      date: record.date?.split("T")[0] || record.date || "",
      status: record.status || "present",
      checkInTime: record.checkInTime || "",
      checkOutTime: record.checkOutTime || "",
    });
    setShowModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      employeeId: Number(formData.employeeId),
      date: formData.date,
      status: formData.status,
      checkInTime: formData.checkInTime,
      checkOutTime: formData.checkOutTime,
    };

    if (editingRecord) {
      updateAttendance(
        { id: editingRecord.id, attData: payload },
        {
          onSuccess: () => {
            setShowModal(false);
            resetForm();
          },
        },
      );
    } else {
      createAttendance(payload, {
        onSuccess: () => {
          setShowModal(false);
          resetForm();
        },
      });
    }
  };

  const handleDelete = (id: number) => {
    if (!confirm("Are you sure you want to delete this attendance record?"))
      return;
    deleteAttendance(id);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
          Attendance
        </h1>
        <div className="flex gap-3">
          <button
            onClick={openCreate}
            className="bg-linear-to-r from-[#0C4A6E] to-[#075985] text-white px-4 py-2 rounded-lg font-medium hover:shadow-lg transition-all"
          >
            Mark Attendance
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-6 md:grid-cols-4 mb-6">
        <div className="bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600 dark:text-green-400">
                Present Today
              </p>
              <p className="text-3xl font-bold text-green-900 dark:text-green-200 mt-2">
                {presentCount}
              </p>
            </div>
            <CheckCircle className="h-12 w-12 text-green-600 dark:text-green-400 opacity-20" />
          </div>
        </div>

        <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-red-600 dark:text-red-400">
                Absent
              </p>
              <p className="text-3xl font-bold text-red-900 dark:text-red-200 mt-2">
                {absentCount}
              </p>
            </div>
            <XCircle className="h-12 w-12 text-red-600 dark:text-red-400 opacity-20" />
          </div>
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
                On Leave
              </p>
              <p className="text-3xl font-bold text-blue-900 dark:text-blue-200 mt-2">
                {onLeaveCount}
              </p>
            </div>
            <Calendar className="h-12 w-12 text-blue-600 dark:text-blue-400 opacity-20" />
          </div>
        </div>

        <div className="bg-orange-50 dark:bg-orange-900/30 border border-orange-200 dark:border-orange-800 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-orange-600 dark:text-orange-400">
                Late
              </p>
              <p className="text-3xl font-bold text-orange-900 dark:text-orange-200 mt-2">
                {lateCount}
              </p>
            </div>
            <Clock className="h-12 w-12 text-orange-600 dark:text-orange-400 opacity-20" />
          </div>
        </div>
      </div>

      {/* Attendance Table */}
      {isLoading && (
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-6 text-center">
          <p className="text-slate-600 dark:text-slate-400">
            Loading attendance...
          </p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg p-6">
          <p className="text-red-600 dark:text-red-400">
            Error loading attendance. Please try again.
          </p>
        </div>
      )}

      {!isLoading && !error && (
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-50 dark:bg-slate-700 border-b border-slate-200 dark:border-slate-600">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Employee ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Check In
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Check Out
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
              {attendanceList.length > 0 ? (
                attendanceList.map((record: any) => (
                  <tr
                    key={record.id}
                    className="hover:bg-slate-50 dark:hover:bg-slate-700/50"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-slate-900 dark:text-slate-100">
                        {record.employeeId}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-slate-600 dark:text-slate-400">
                        {record.date}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-slate-600 dark:text-slate-400">
                        {record.checkInTime}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-slate-600 dark:text-slate-400">
                        {record.checkOutTime}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          record.status === "present" ||
                          record.status === "Present"
                            ? "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300"
                            : record.status === "late" ||
                                record.status === "Late"
                              ? "bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300"
                              : "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300"
                        }`}
                      >
                        {record.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => openEdit(record)}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(record.id)}
                          className="p-1.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-4 text-center text-slate-500 dark:text-slate-400"
                  >
                    No attendance records found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Create / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-slate-800 rounded-lg p-6 w-full max-w-md mx-4 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                {editingRecord ? "Edit Attendance" : "Mark Attendance"}
              </h2>
              <button
                onClick={() => {
                  setShowModal(false);
                  resetForm();
                }}
                className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded"
              >
                <X className="h-5 w-5 text-slate-500" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Employee *
                </label>
                <select
                  value={formData.employeeId}
                  onChange={(e) =>
                    setFormData({ ...formData, employeeId: e.target.value })
                  }
                  required
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="">Select Employee</option>
                  {employees.map((emp: any) => (
                    <option key={emp.id} value={emp.id}>
                      {emp.fullName || emp.username || `Employee #${emp.id}`}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Date *
                </label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) =>
                    setFormData({ ...formData, date: e.target.value })
                  }
                  required
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Status *
                </label>
                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value })
                  }
                  required
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="present">Present</option>
                  <option value="absent">Absent</option>
                  <option value="late">Late</option>
                  <option value="leave">On Leave</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Check In
                  </label>
                  <input
                    type="time"
                    value={formData.checkInTime}
                    onChange={(e) =>
                      setFormData({ ...formData, checkInTime: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Check Out
                  </label>
                  <input
                    type="time"
                    value={formData.checkOutTime}
                    onChange={(e) =>
                      setFormData({ ...formData, checkOutTime: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={isCreating || isUpdating}
                  className="flex-1 bg-linear-to-r from-[#0C4A6E] to-[#075985] text-white px-4 py-2 rounded-lg font-medium hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {(isCreating || isUpdating) && (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  )}
                  {editingRecord ? "Update" : "Save"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  className="px-4 py-2 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
