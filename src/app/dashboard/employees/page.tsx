"use client";

import Swal from "sweetalert2";
import { Mail, Edit, Trash2, Loader2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useGetAllEmployees, useDeleteEmployee } from "@/hooks/employee-query";
import { useDeleteUser } from "@/hooks/user-query";
import { useState } from "react";
import type { EmployeeProfile } from "@/lib/types";

const PAGE_SIZE = 6;

export default function EmployeesPage() {
  const { data: employeesResponse, isLoading, error } = useGetAllEmployees();
  const { mutate: deleteEmployee } = useDeleteEmployee();
  const { mutate: deleteUser } = useDeleteUser();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);

  const employeeList: EmployeeProfile[] = Array.isArray(employeesResponse)
    ? employeesResponse
    : Array.isArray(employeesResponse?.data)
      ? employeesResponse.data
      : [];

  // Get unique departments for filter
  const departments = [
    "All",
    ...Array.from(
      new Set(employeeList.map((e) => e.departmentName).filter(Boolean)),
    ),
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
  if (
    userRole.toLowerCase() !== "admin" &&
    userRole.toLowerCase() !== "hr" &&
    userRole.toLowerCase() !== "manager"
  ) {
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
  // Filter employees
  const filteredEmployees = employeeList.filter((emp) => {
    const matchesSearch =
      !searchQuery ||
      emp.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.positionName?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDept =
      departmentFilter === "All" || emp.departmentName === departmentFilter;
    return matchesSearch && matchesDept;
  });

  // Pagination
  const totalPages = Math.ceil(filteredEmployees.length / PAGE_SIZE);
  const paginatedEmployees = filteredEmployees.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  // Summary counts
  const totalCount = employeeList.length;
  const activeCount = employeeList.filter((e) => e.status === true).length;
  const inactiveCount = employeeList.filter((e) => e.status === false).length;

  const handleDelete = (id: number) => {
    // Find the employee to get the userId
    const employee = employeeList.find((e) => e.id === id);
    const userId = employee?.userId;
    // Detect dark mode (using Tailwind's 'dark' class on <html> or <body>)
    const isDark =
      typeof window !== "undefined" &&
      document.documentElement.classList.contains("dark");
    Swal.fire({
      title: "Are you sure?",
      text: "Are you sure you want to delete this employee?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: isDark ? "#ef4444" : "#d33",
      cancelButtonColor: isDark ? "#2563eb" : "#3085d6",
      confirmButtonText: "Yes, delete it!",
      background: isDark ? "#1e293b" : "#fff",
      color: isDark ? "#f1f5f9" : "#1e293b",
      customClass: {
        popup: isDark ? "swal2-dark" : "",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        deleteEmployee(id, {
          onSuccess: () => {
            // Delete the associated user if userId exists
            if (userId) {
              deleteUser(userId, {
                onSuccess: () => {
                  Swal.fire({
                    title: "Deleted!",
                    text: "Employee and user have been deleted.",
                    icon: "success",
                    background: isDark ? "#1e293b" : "#fff",
                    color: isDark ? "#f1f5f9" : "#1e293b",
                    customClass: {
                      popup: isDark ? "swal2-dark" : "",
                    },
                  });
                },
                onError: (error: any) => {
                  Swal.fire({
                    title: "Error",
                    text:
                      "Employee deleted but failed to delete user: " +
                      (error?.message || "Unknown error."),
                    icon: "error",
                    background: isDark ? "#1e293b" : "#fff",
                    color: isDark ? "#f1f5f9" : "#1e293b",
                    customClass: {
                      popup: isDark ? "swal2-dark" : "",
                    },
                  });
                },
              });
            } else {
              Swal.fire({
                title: "Deleted!",
                text: "Employee has been deleted.",
                icon: "success",
                background: isDark ? "#1e293b" : "#fff",
                color: isDark ? "#f1f5f9" : "#1e293b",
                customClass: {
                  popup: isDark ? "swal2-dark" : "",
                },
              });
            }
          },
          onError: (error: any) => {
            Swal.fire({
              title: "Error",
              text: error?.message || "Failed to delete employee.",
              icon: "error",
              background: isDark ? "#1e293b" : "#fff",
              color: isDark ? "#f1f5f9" : "#1e293b",
              customClass: {
                popup: isDark ? "swal2-dark" : "",
              },
            });
          },
        });
      }
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
          Employees
        </h1>
        <Link
          href="/dashboard/employees/add"
          className="bg-linear-to-r from-[#0C4A6E] to-[#075985] text-white px-4 py-2 rounded-lg font-medium hover:shadow-lg transition-all"
        >
          Add Employee
        </Link>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-6 md:grid-cols-3 mb-6">
        <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
          <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
            Total Employees
          </p>
          <p className="text-3xl font-bold text-blue-900 dark:text-blue-200 mt-2">
            {totalCount}
          </p>
        </div>
        <div className="bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-lg p-6">
          <p className="text-sm font-medium text-green-600 dark:text-green-400">
            Active
          </p>
          <p className="text-3xl font-bold text-green-900 dark:text-green-200 mt-2">
            {activeCount}
          </p>
        </div>
        <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg p-6">
          <p className="text-sm font-medium text-red-600 dark:text-red-400">
            Inactive
          </p>
          <p className="text-3xl font-bold text-red-900 dark:text-red-200 mt-2">
            {inactiveCount}
          </p>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="mb-6 flex gap-4">
        <input
          type="text"
          placeholder="Search employees..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setCurrentPage(1);
          }}
          className="max-w-md flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none dark:bg-slate-700 dark:border-slate-600 dark:text-slate-100"
        />
        <select
          value={departmentFilter}
          onChange={(e) => {
            setDepartmentFilter(e.target.value);
            setCurrentPage(1);
          }}
          className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none dark:bg-slate-700 dark:border-slate-600 dark:text-slate-100"
        >
          {departments.map((dept) => (
            <option key={dept} value={dept}>
              {dept === "All" ? "All Departments" : dept}
            </option>
          ))}
        </select>
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <p className="text-red-600">
            Error loading employees. Please try again.
          </p>
        </div>
      )}

      {/* Employees Table (shadcn/ui) */}
      {!error && (
        <div className="bg-white border border-slate-200 rounded-lg overflow-hidden dark:bg-slate-800 dark:border-slate-700">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">
                  Employee
                </TableHead>
                <TableHead className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">
                  Email
                </TableHead>
                <TableHead className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">
                  Department
                </TableHead>
                <TableHead className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">
                  Position
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
              {paginatedEmployees.length > 0 ? (
                paginatedEmployees.map((employee) => (
                  <TableRow
                    key={employee.id}
                    onClick={() =>
                      router.push(`/dashboard/employees/${employee.id}`)
                    }
                    className="hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer"
                  >
                    <TableCell className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        {employee.imageUrl ? (
                          <img
                            src={employee.imageUrl}
                            alt={employee.fullName}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-sm font-semibold text-blue-600">
                            {employee.fullName
                              ?.split(" ")
                              .map((n) => n[0])
                              .join("")
                              .toUpperCase()
                              .slice(0, 2)}
                          </div>
                        )}
                        <div>
                          <div className="text-sm font-medium text-slate-900 dark:text-slate-100">
                            {employee.fullName}
                          </div>
                          <div className="text-xs text-slate-500 dark:text-slate-400">
                            @{employee.username}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                        <Mail className="h-4 w-4" />
                        {employee.email}
                      </div>
                    </TableCell>
                    <TableCell className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-slate-900 dark:text-slate-100">
                        {employee.departmentName}
                      </div>
                    </TableCell>
                    <TableCell className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-slate-600 dark:text-slate-300">
                        {employee.positionName}
                      </div>
                    </TableCell>
                    <TableCell className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          employee.status === true
                            ? "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300"
                            : "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300"
                        }`}
                      >
                        {employee.status === true ? "Active" : "Inactive"}
                      </span>
                    </TableCell>
                    <TableCell className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div
                        className="flex justify-end gap-2"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Link
                          href={`/dashboard/employees/${employee.id}/edit`}
                          className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                          <Edit className="h-4 w-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(employee.id)}
                          className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
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
                    No employees found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-6 py-3 border-t border-slate-200 dark:border-slate-700">
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Showing {(currentPage - 1) * PAGE_SIZE + 1}–
                {Math.min(currentPage * PAGE_SIZE, filteredEmployees.length)} of{" "}
                {filteredEmployees.length} employees
              </p>
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
            </div>
          )}
        </div>
      )}
    </div>
  );
}
