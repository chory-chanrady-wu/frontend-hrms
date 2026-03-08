"use client";

import { useState } from "react";
import { Building2, Users, Edit, Trash2, Search } from "lucide-react";
import Link from "next/link";
import {
  useGetAllDepartments,
  useDeleteDepartment,
} from "@/hooks/department-query";
import { useGetAllEmployees } from "@/hooks/employee-query";

export default function DepartmentsPage() {
  const { data: response, isLoading, error } = useGetAllDepartments();
  const { data: empResponse } = useGetAllEmployees();
  const { mutate: deleteDepartment } = useDeleteDepartment();
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

  const empList = Array.isArray(empResponse)
    ? empResponse
    : Array.isArray(empResponse?.data)
      ? empResponse.data
      : [];

  const employeeCountByDept = empList.reduce(
    (acc: Record<number, number>, emp: any) => {
      if (emp.departmentId) {
        acc[emp.departmentId] = (acc[emp.departmentId] || 0) + 1;
      }
      return acc;
    },
    {},
  );

  const deptList = Array.isArray(response)
    ? response
    : Array.isArray(response?.data)
      ? response.data
      : [];

  const filteredDepts = deptList.filter(
    (dept: any) =>
      dept.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dept.description?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleDelete = (id: number) => {
    if ((employeeCountByDept[id] || 0) > 0) {
      alert(
        "Cannot delete this department. It still has employees assigned to it.",
      );
      return;
    }
    if (deleteConfirm === id) {
      deleteDepartment(id);
      setDeleteConfirm(null);
    } else {
      setDeleteConfirm(id);
      setTimeout(() => setDeleteConfirm(null), 3000);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
          Departments
        </h1>
        <Link
          href="/dashboard/departments/add"
          className="bg-linear-to-r from-[#0C4A6E] to-[#075985] text-white px-4 py-2 rounded-lg font-medium hover:shadow-lg transition-all"
        >
          Add Department
        </Link>
      </div>

      {/* Summary */}
      <div className="grid gap-6 md:grid-cols-3 mb-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 dark:bg-blue-900/20 dark:border-blue-800">
          <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
            Total Departments
          </p>
          <p className="text-3xl font-bold text-blue-900 dark:text-blue-100 mt-2">
            {deptList.length}
          </p>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 dark:bg-green-900/20 dark:border-green-800">
          <p className="text-sm font-medium text-green-600 dark:text-green-400">
            Active
          </p>
          <p className="text-3xl font-bold text-green-900 dark:text-green-100 mt-2">
            {deptList.length}
          </p>
        </div>
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-6 dark:bg-purple-900/20 dark:border-purple-800">
          <p className="text-sm font-medium text-purple-600 dark:text-purple-400">
            Showing
          </p>
          <p className="text-3xl font-bold text-purple-900 dark:text-purple-100 mt-2">
            {filteredDepts.length}
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search departments..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none dark:bg-slate-800 dark:border-slate-600 dark:text-slate-100"
          />
        </div>
      </div>
      {/* Loading State */}
      {isLoading && (
        <div className="bg-white border border-slate-200 rounded-lg p-6 text-center dark:bg-slate-800 dark:border-slate-700">
          <p className="text-slate-600 dark:text-slate-400">
            Loading departments...
          </p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 dark:bg-red-900/20 dark:border-red-800">
          <p className="text-red-600 dark:text-red-400">
            Error loading departments. Please try again.
          </p>
        </div>
      )}

      {/* Departments Table */}
      {!isLoading && !error && (
        <div className="bg-white border border-slate-200 rounded-lg overflow-hidden dark:bg-slate-800 dark:border-slate-700">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 dark:bg-slate-700/50 dark:border-slate-600">
                  <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    #
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Department
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Employees
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="text-right px-6 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                {filteredDepts.length > 0 ? (
                  filteredDepts.map((dept: any, index: number) => (
                    <tr
                      key={dept.id}
                      className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition"
                    >
                      <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400">
                        {index + 1}
                      </td>
                      <td className="px-6 py-4">
                        <Link
                          href={`/dashboard/departments/${dept.id}`}
                          className="flex items-center gap-3"
                        >
                          <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                            <Building2 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                          </div>
                          <span className="font-medium text-slate-900 dark:text-slate-100 hover:text-blue-600 dark:hover:text-blue-400 transition">
                            {dept.name}
                          </span>
                        </Link>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400 max-w-xs truncate">
                        {dept.description || "No description"}
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1 text-sm font-medium text-slate-900 dark:text-slate-100">
                          <Users className="h-4 w-4 text-slate-400" />
                          {employeeCountByDept[dept.id] || 0}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                          Active
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/dashboard/departments/${dept.id}/edit`}
                            className="p-2 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition"
                          >
                            <Edit className="h-4 w-4" />
                          </Link>
                          <button
                            onClick={() => handleDelete(dept.id)}
                            className={`p-2 transition ${
                              deleteConfirm === dept.id
                                ? "text-red-600"
                                : "text-slate-400 hover:text-red-600 dark:hover:text-red-400"
                            }`}
                            title={
                              deleteConfirm === dept.id
                                ? "Click again to confirm"
                                : "Delete"
                            }
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
                      className="px-6 py-8 text-center text-slate-500 dark:text-slate-400"
                    >
                      No departments found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
