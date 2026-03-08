"use client";

import { Mail, Edit, Trash2, Loader2 } from "lucide-react";
import Link from "next/link";
import { useGetAllEmployees, useDeleteEmployee } from "@/hooks/employee-query";
import { useState } from "react";
import type { EmployeeProfile } from "@/lib/types";

export default function EmployeesPage() {
  const { data: employeesResponse, isLoading, error } = useGetAllEmployees();
  const { mutate: deleteEmployee } = useDeleteEmployee();
  const [searchQuery, setSearchQuery] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("All");

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

  // Summary counts
  const totalCount = employeeList.length;
  const activeCount = employeeList.filter((e) => e.status === "active").length;
  const onLeaveCount = employeeList.filter(
    (e) => e.status === "on_leave",
  ).length;
  const inactiveCount = employeeList.filter(
    (e) => e.status === "inactive",
  ).length;

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this employee?")) {
      deleteEmployee(id);
    }
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
          className="bg-gradient-to-r from-[#0C4A6E] to-[#075985] text-white px-4 py-2 rounded-lg font-medium hover:shadow-lg transition-all"
        >
          Add Employee
        </Link>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-6 md:grid-cols-4 mb-6">
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
        <div className="bg-orange-50 dark:bg-orange-900/30 border border-orange-200 dark:border-orange-800 rounded-lg p-6">
          <p className="text-sm font-medium text-orange-600 dark:text-orange-400">
            On Leave
          </p>
          <p className="text-3xl font-bold text-orange-900 dark:text-orange-200 mt-2">
            {onLeaveCount}
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
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-md flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none dark:bg-slate-700 dark:border-slate-600 dark:text-slate-100"
        />
        <select
          value={departmentFilter}
          onChange={(e) => setDepartmentFilter(e.target.value)}
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

      {/* Employees Table */}
      {!error && (
        <div className="bg-white border border-slate-200 rounded-lg overflow-hidden dark:bg-slate-800 dark:border-slate-700">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200 dark:bg-slate-700 dark:border-slate-600">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">
                  Employee
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">
                  Department
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">
                  Position
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
              {filteredEmployees.length > 0 ? (
                filteredEmployees.map((employee) => (
                  <tr
                    key={employee.id}
                    className="hover:bg-slate-50 dark:hover:bg-slate-700"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
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
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                        <Mail className="h-4 w-4" />
                        {employee.email}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-slate-900 dark:text-slate-100">
                        {employee.departmentName}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-slate-600 dark:text-slate-300">
                        {employee.positionName}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          employee.status === "active"
                            ? "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300"
                            : employee.status === "on_leave"
                              ? "bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300"
                              : "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300"
                        }`}
                      >
                        {employee.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-2">
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
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-8 text-center text-sm text-slate-500 dark:text-slate-400"
                  >
                    No employees found
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
