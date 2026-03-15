"use client";
import Swal from "sweetalert2";

import { useState } from "react";
import { Building2, Users, Edit, Trash2, Search } from "lucide-react";
import Link from "next/link";
import {
  useGetAllDepartments,
  useDeleteDepartment,
} from "@/hooks/department-query";
import { useGetAllEmployees } from "@/hooks/employee-query";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function DepartmentsPage() {
  const { data: response, isLoading, error } = useGetAllDepartments();
  const { data: empResponse } = useGetAllEmployees();
  const { mutate: deleteDepartment } = useDeleteDepartment();
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteConfirm] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 6;

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

  const totalPages = Math.ceil(filteredDepts.length / PAGE_SIZE);
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const paginatedDepts = filteredDepts.slice(
    startIndex,
    startIndex + PAGE_SIZE,
  );

  const handleDelete = (id: number) => {
    if ((employeeCountByDept[id] || 0) > 0) {
      Swal.fire(
        "Error",
        "Cannot delete this department. It still has employees assigned to it.",
        "error",
      );
      return;
    }
    Swal.fire({
      title: "Are you sure?",
      text: "Are you sure you want to delete this department?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteDepartment(id, {
          onSuccess: () => {
            Swal.fire("Deleted!", "Department has been deleted.", "success");
          },
          onError: (error: any) => {
            Swal.fire(
              "Error",
              error?.message || "Failed to delete department.",
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
            {
              deptList.filter((d: any) => (employeeCountByDept[d.id] || 0) > 0)
                .length
            }
          </p>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 dark:bg-red-900/20 dark:border-red-800">
          <p className="text-sm font-medium text-red-600 dark:text-red-400">
            Inactive
          </p>
          <p className="text-3xl font-bold text-red-900 dark:text-red-100 mt-2">
            {
              deptList.filter(
                (d: any) => (employeeCountByDept[d.id] || 0) === 0,
              ).length
            }
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
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
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

      {/* Departments Table (shadcn/ui) */}
      {!isLoading && !error && (
        <div className="bg-white border border-slate-200 rounded-lg overflow-hidden dark:bg-slate-800 dark:border-slate-700">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="px-6 py-3">#</TableHead>
                  <TableHead className="px-6 py-3">Department</TableHead>
                  <TableHead className="px-6 py-3">Description</TableHead>
                  <TableHead className="px-6 py-3">
                    Head of Department
                  </TableHead>
                  <TableHead className="px-6 py-3">Employees</TableHead>
                  <TableHead className="px-6 py-3">Status</TableHead>
                  <TableHead className="px-6 py-3 text-right">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedDepts.length > 0 ? (
                  paginatedDepts.map((dept: any, index: number) => (
                    <TableRow
                      key={dept.id}
                      className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition"
                    >
                      <TableCell className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400">
                        {startIndex + index + 1}
                      </TableCell>
                      <TableCell className="px-6 py-4">
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
                      </TableCell>
                      <TableCell className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400 max-w-xs truncate">
                        {dept.description || "No description"}
                      </TableCell>
                      <TableCell className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                        {dept.headOfDepartmentName || (
                          <span className="text-slate-400 dark:text-slate-500 italic">
                            Not assigned
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="px-6 py-4">
                        <span className="inline-flex items-center gap-1 text-sm font-medium text-slate-900 dark:text-slate-100">
                          <Users className="h-4 w-4 text-slate-400" />
                          {employeeCountByDept[dept.id] || 0}
                        </span>
                      </TableCell>
                      <TableCell className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${
                            (employeeCountByDept[dept.id] || 0) > 0
                              ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                              : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                          }`}
                        >
                          {(employeeCountByDept[dept.id] || 0) > 0
                            ? "Active"
                            : "Inactive"}
                        </span>
                      </TableCell>
                      <TableCell className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/dashboard/departments/${dept.id}/edit`}
                            className="p-2 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition"
                          >
                            <Edit className="h-4 w-4 text-blue-600" />
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
                            <Trash2 className="h-4 w-4 text-red-600" />
                          </button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="px-6 py-8 text-center text-slate-500 dark:text-slate-400"
                    >
                      No departments found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          {/* Pagination */}
          {filteredDepts.length > 0 && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200 dark:border-slate-700">
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Showing {startIndex + 1}-
                {Math.min(startIndex + PAGE_SIZE, filteredDepts.length)} of{" "}
                {filteredDepts.length} departments
              </p>
              {totalPages > 1 && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1 text-sm border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed text-slate-700 dark:text-slate-300"
                  >
                    Previous
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-3 py-1 text-sm border rounded-lg transition ${
                          currentPage === page
                            ? "bg-blue-600 text-white border-blue-600"
                            : "border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700"
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
                    className="px-3 py-1 text-sm border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed text-slate-700 dark:text-slate-300"
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
