"use client";

import { Building2, Users, Edit, Trash2 } from "lucide-react";
import Link from "next/link";
import {
  useGetAllDepartments,
  useDeleteDepartment,
} from "@/hooks/department-query";

export default function DepartmentsPage() {
  const { data: departments, isLoading, error } = useGetAllDepartments();
  const { mutate: deleteDepartment } = useDeleteDepartment();

  const deptList = departments?.data || [];
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Departments</h1>
        <Link
          href="/dashboard/departments/add"
          className="bg-gradient-to-r from-[#0C4A6E] to-[#075985] text-white px-4 py-2 rounded-lg font-medium hover:shadow-lg transition-all"
        >
          Add Department
        </Link>
      </div>

      {/* Summary */}
      <div className="grid gap-6 md:grid-cols-3 mb-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <p className="text-sm font-medium text-blue-600">Total Departments</p>
          <p className="text-3xl font-bold text-blue-900 mt-2">
            {deptList.length}
          </p>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <p className="text-sm font-medium text-green-600">Active</p>
          <p className="text-3xl font-bold text-green-900 mt-2">
            {deptList.length}
          </p>
        </div>
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
          <p className="text-sm font-medium text-purple-600">Avg per Dept</p>
          <p className="text-3xl font-bold text-purple-900 mt-2">
            {deptList.length > 0
              ? Math.round(deptList.length / deptList.length)
              : 0}
          </p>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="bg-white border border-slate-200 rounded-lg p-6 text-center">
          <p className="text-slate-600">Loading departments...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <p className="text-red-600">
            Error loading departments. Please try again.
          </p>
        </div>
      )}

      {/* Departments Grid */}
      {!isLoading && !error && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {deptList.length > 0 ? (
            deptList.map((dept: any) => (
              <div
                key={dept.id}
                className="bg-white border border-slate-200 rounded-lg p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <Building2 className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="flex gap-2">
                    <Link
                      href={`/dashboard/departments/${dept.id}/edit`}
                      className="p-2 text-slate-400 hover:text-blue-600 transition"
                    >
                      <Edit className="h-4 w-4" />
                    </Link>
                    <button
                      onClick={() => deleteDepartment(dept.id)}
                      className="p-2 text-slate-400 hover:text-red-600 transition"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  {dept.name}
                </h3>
                <p className="text-sm text-slate-600 mb-4">
                  {dept.description}
                </p>
                <div className="pt-4 border-t border-slate-200">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600">Name:</span>
                    <span className="font-medium text-slate-900">
                      {dept.name}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm mt-2">
                    <span className="text-slate-600">Status:</span>
                    <span className="flex items-center gap-1 font-medium text-slate-900">
                      <Users className="h-4 w-4" />
                      Active
                    </span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-8">
              <p className="text-slate-500">No departments found</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
