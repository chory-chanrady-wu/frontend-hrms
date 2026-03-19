"use client";

import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import type { EmployeeProfile } from "@/lib/types";
import { getUser } from "@/lib/auth";
import { hasPermission } from "@/lib/permissions";

const PAGE_SIZE = 7;

const formatDate = (datetime: string) => {
  if (!datetime) return "—";
  return new Date(datetime).toLocaleDateString();
};

const formatTime = (datetime: string) => {
  if (!datetime) return "—";
  return new Date(datetime).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
};

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

  // Get current user and permissions
  let currentUser = null;
  let isAdminOrPerm = false;
  let defaultEmployeeId = "";
  if (typeof window !== "undefined") {
    currentUser = getUser();
    const perms = currentUser?.permissions
      ? Array.isArray(currentUser.permissions)
        ? currentUser.permissions
        : typeof currentUser.permissions === "string"
          ? currentUser.permissions.split(",")
          : []
      : [];
    isAdminOrPerm =
      currentUser?.roleName?.toLowerCase() === "admin" ||
      currentUser?.roleName?.toLowerCase() === "hr" ||
      perms.includes("admin") ||
      perms.includes("attendance:manage") ||
      perms.includes("attendance:all");
  }

  // For non-admins, find the employee whose userId matches currentUser.id
  if (!isAdminOrPerm && currentUser && employees.length > 0) {
    const matchedEmp = employees.find(
      (emp: EmployeeProfile) => emp.userId === currentUser.id,
    );
    if (matchedEmp) {
      defaultEmployeeId = String(matchedEmp.id);
    }
  }

  type Attendance = {
    id: number;
    employeeId: number;
    employeeName?: string;
    checkIn: string;
    checkOut?: string;
    status: string;
  };

  const attendanceListRaw: Attendance[] = Array.isArray(attendance)
    ? attendance
    : Array.isArray(attendance?.data)
      ? attendance.data
      : [];

  // Filter for today's attendance only
  const today = new Date();
  const todayStr = today.toISOString().split("T")[0];
  const attendanceList = attendanceListRaw.filter((record: Attendance) => {
    if (!record.checkIn) return false;
    const checkInDate = new Date(record.checkIn);
    const checkInStr = checkInDate.toISOString().split("T")[0];
    return checkInStr === todayStr;
  });

  const presentCount = attendanceList.filter(
    (r: Attendance) => r.status === "present" || r.status === "Present",
  ).length;
  const absentCount = attendanceList.filter(
    (r: Attendance) => r.status === "absent" || r.status === "Absent",
  ).length;
  const onLeaveCount = attendanceList.filter(
    (r: Attendance) =>
      r.status === "leave" || r.status === "Leave" || r.status === "on_leave",
  ).length;
  const lateCount = attendanceList.filter(
    (r: Attendance) => r.status === "late" || r.status === "Late",
  ).length;

  const [showModal, setShowModal] = useState(false);
  const [editingRecord, setEditingRecord] = useState<Attendance | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [formData, setFormData] = useState({
    employeeId: !isAdminOrPerm && defaultEmployeeId ? defaultEmployeeId : "",
    date: new Date().toISOString().split("T")[0],
    status: "present",
    checkIn: "",
    checkOut: "",
  });

  // Update employeeId if employees load after initial render
  useEffect(() => {
    if (!isAdminOrPerm && currentUser && employees.length > 0) {
      const matchedEmp = employees.find(
        (emp: EmployeeProfile) => emp.userId === currentUser.id,
      );
      if (matchedEmp && formData.employeeId !== String(matchedEmp.id)) {
        setFormData((prev) => ({ ...prev, employeeId: String(matchedEmp.id) }));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [employees]);
  const [markAll, setMarkAll] = useState(false);

  // Filter attendance
  const filteredAttendance = attendanceList.filter((record: Attendance) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      record.employeeName?.toLowerCase().includes(q) ||
      record.status?.toLowerCase().includes(q) ||
      String(record.employeeId).includes(q)
    );
  });

  // Pagination
  const totalPages = Math.ceil(filteredAttendance.length / PAGE_SIZE);
  const paginatedAttendance = filteredAttendance.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  const resetForm = () => {
    setFormData({
      employeeId: !isAdminOrPerm && defaultEmployeeId ? defaultEmployeeId : "",
      date: new Date().toISOString().split("T")[0],
      status: "present",
      checkIn: "",
      checkOut: "",
    });
    setEditingRecord(null);
  };

  const openCreate = () => {
    resetForm();
    setShowModal(true);
  };

  const openEdit = (record: Attendance) => {
    setEditingRecord(record);
    const checkInDate = record.checkIn ? new Date(record.checkIn) : null;
    const checkOutDate = record.checkOut ? new Date(record.checkOut) : null;
    setFormData({
      employeeId: String(record.employeeId),
      date: checkInDate
        ? checkInDate.toISOString().split("T")[0]
        : new Date().toISOString().split("T")[0],
      status: record.status || "present",
      checkIn: checkInDate ? checkInDate.toTimeString().slice(0, 5) : "",
      checkOut: checkOutDate ? checkOutDate.toTimeString().slice(0, 5) : "",
    });
    setShowModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const checkIn = formData.checkIn
      ? `${formData.date}T${formData.checkIn}:00`
      : `${formData.date}T00:00:00`;
    const checkOut = formData.checkOut
      ? `${formData.date}T${formData.checkOut}:00`
      : `${formData.date}T00:00:00`;

    if (markAll) {
      // Batch mark attendance for all employees
      const batch = employees.map((emp: EmployeeProfile) => ({
        employeeId: emp.id,
        checkIn,
        checkOut,
        status: formData.status,
      }));
      // Sequential creation
      let createdCount = 0;
      batch.forEach(
        (payload: {
          employeeId: number;
          checkIn: string;
          checkOut: string;
          status: string;
        }) => {
          createAttendance(payload, {
            onSuccess: () => {
              createdCount++;
              if (createdCount === batch.length) {
                setShowModal(false);
                resetForm();
                setMarkAll(false);
                Swal.fire(
                  "Success",
                  "Attendance marked for all employees.",
                  "success",
                );
              }
            },
            onError: (error: unknown) => {
              const message =
                typeof error === "object" && error && "message" in error
                  ? (error as { message?: string }).message
                  : undefined;
              Swal.fire(
                "Error",
                message || "Failed to mark attendance for all employees.",
                "error",
              );
            },
          });
        },
      );
    } else {
      const payload = {
        employeeId: Number(formData.employeeId),
        checkIn,
        checkOut,
        status: formData.status,
      };
      if (editingRecord) {
        updateAttendance(
          { id: editingRecord.id, attData: payload },
          {
            onSuccess: () => {
              setShowModal(false);
              resetForm();
              Swal.fire(
                "Success",
                "Attendance updated successfully.",
                "success",
              );
            },
            onError: (error: unknown) => {
              const message =
                typeof error === "object" && error && "message" in error
                  ? (error as { message?: string }).message
                  : undefined;
              Swal.fire(
                "Error",
                message || "Failed to update attendance.",
                "error",
              );
            },
          },
        );
      } else {
        createAttendance(payload, {
          onSuccess: () => {
            setShowModal(false);
            resetForm();
            Swal.fire("Success", "Attendance marked successfully.", "success");
          },
          onError: (error: unknown) => {
            const message =
              typeof error === "object" && error && "message" in error
                ? (error as { message?: string }).message
                : undefined;
            Swal.fire(
              "Error",
              message || "Failed to mark attendance.",
              "error",
            );
          },
        });
      }
    }
  };

  const handleDelete = (id: number) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to delete this attendance record?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteAttendance(id, {
          onSuccess: () => {
            setShowModal(false);
            resetForm();
            Swal.fire(
              "Deleted!",
              "Attendance record has been deleted.",
              "success",
            );
          },
          onError: (error: unknown) => {
            const message =
              typeof error === "object" && error && "message" in error
                ? (error as { message?: string }).message
                : undefined;
            Swal.fire(
              "Error",
              message || "Failed to delete attendance record.",
              "error",
            );
          },
        });
      }
    });
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

      {/* Search */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search attendance..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setCurrentPage(1);
          }}
          className="max-w-md w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none dark:bg-slate-700 dark:border-slate-600 dark:text-slate-100"
        />
      </div>

      {/* Attendance Table */}
      {isLoading && (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
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
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">
                  Employee
                </TableHead>
                <TableHead className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">
                  Date
                </TableHead>
                <TableHead className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">
                  Check In
                </TableHead>
                <TableHead className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">
                  Check Out
                </TableHead>
                <TableHead className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">
                  Status
                </TableHead>
                <TableHead className="px-6 py-3 text-right text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedAttendance.length > 0 ? (
                paginatedAttendance.map((record: Attendance) => (
                  <TableRow
                    key={record.id}
                    className="hover:bg-slate-50 dark:hover:bg-slate-700/50"
                  >
                    <TableCell className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-slate-900 dark:text-slate-100">
                        {record.employeeName ||
                          `Employee #${record.employeeId}`}
                      </div>
                    </TableCell>
                    <TableCell className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-slate-600 dark:text-slate-400">
                        {formatDate(record.checkIn)}
                      </div>
                    </TableCell>
                    <TableCell className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-slate-600 dark:text-slate-400">
                        {formatTime(record.checkIn)}
                      </div>
                    </TableCell>
                    <TableCell className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-slate-600 dark:text-slate-400">
                        {formatTime(record.checkOut ?? "")}
                      </div>
                    </TableCell>
                    <TableCell className="px-6 py-4 whitespace-nowrap">
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
                    </TableCell>
                    <TableCell className="px-6 py-4 whitespace-nowrap text-right">
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
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="px-6 py-8 text-center text-sm text-slate-500 dark:text-slate-400"
                  >
                    No attendance records found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          {/* Pagination */}
          {filteredAttendance.length > 0 && (
            <div className="flex items-center justify-between px-6 py-3 border-t border-slate-200 dark:border-slate-700">
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Showing {(currentPage - 1) * PAGE_SIZE + 1}–
                {Math.min(currentPage * PAGE_SIZE, filteredAttendance.length)}{" "}
                of {filteredAttendance.length} records
              </p>
              {totalPages > 1 && (
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1 text-sm rounded-md border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-3 py-1 text-sm rounded-md ${
                          page === currentPage
                            ? "bg-blue-600 text-white"
                            : "border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                        }`}
                      >
                        {page}
                      </button>
                    ),
                  )}
                  <button
                    onClick={() =>
                      setCurrentPage((p) => Math.min(totalPages, p + 1))
                    }
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 text-sm rounded-md border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          )}
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
                  setMarkAll(false);
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
                {/* Only admin/permission can select employee. Others see their own name, dropdown disabled. */}
                {(!markAll || editingRecord) &&
                  (isAdminOrPerm ? (
                    <select
                      value={formData.employeeId}
                      onChange={(e) =>
                        setFormData({ ...formData, employeeId: e.target.value })
                      }
                      required
                      disabled={!!editingRecord}
                      className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 outline-none disabled:bg-slate-100 disabled:dark:bg-slate-700/50 disabled:text-slate-400"
                    >
                      <option value="">Select Employee</option>
                      {employees.map((emp: EmployeeProfile) => (
                        <option key={emp.id} value={emp.id}>
                          {emp.fullName ||
                            emp.username ||
                            `Employee #${emp.id}`}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="text"
                      value={
                        employees.find(
                          (emp: EmployeeProfile) =>
                            String(emp.id) === formData.employeeId,
                        )?.fullName ||
                        currentUser?.fullName ||
                        currentUser?.username ||
                        "Me"
                      }
                      disabled
                      className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-slate-100 dark:bg-slate-700/50 text-slate-900 dark:text-slate-100"
                    />
                  ))}
                {/* Only show mark all toggle for admin/permission */}
                {editingRecord == null && isAdminOrPerm && (
                  <>
                    <button
                      type="button"
                      className="mt-2 px-3 py-1 text-xs rounded bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-200 border border-blue-300 dark:border-blue-700"
                      onClick={() => setMarkAll((v) => !v)}
                    >
                      {markAll
                        ? "Mark for single employee"
                        : "Mark attendance for all employees"}
                    </button>
                    {markAll && (
                      <div className="mt-2 text-xs text-blue-700 dark:text-blue-200">
                        Attendance will be marked for all employees.
                      </div>
                    )}
                  </>
                )}
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
                    value={formData.checkIn}
                    onChange={(e) =>
                      setFormData({ ...formData, checkIn: e.target.value })
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
                    value={formData.checkOut}
                    onChange={(e) =>
                      setFormData({ ...formData, checkOut: e.target.value })
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
