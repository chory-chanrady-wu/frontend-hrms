"use client";

import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Building2,
  Calendar,
  FileText,
  Trash2,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import {
  useGetDepartmentById,
  useDeleteDepartment,
} from "@/hooks/department-query";

export default function DepartmentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const departmentId = Number(params.id);
  const {
    data: response,
    isLoading,
    error,
  } = useGetDepartmentById(departmentId);
  const { mutate: deleteDepartment, isPending: isDeleting } =
    useDeleteDepartment();

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this department?")) {
      deleteDepartment(departmentId, {
        onSuccess: () => router.push("/dashboard/departments"),
      });
    }
  };

  const dept = Array.isArray(response)
    ? response[0]
    : response?.data || response;

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <Link
          href="/dashboard/departments"
          className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition"
        >
          <ArrowLeft className="h-5 w-5 text-slate-600 dark:text-slate-400" />
        </Link>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
          Department Details
        </h1>
      </div>

      {isLoading && (
        <div className="bg-white border border-slate-200 rounded-lg p-6 text-center dark:bg-slate-800 dark:border-slate-700">
          <p className="text-slate-600 dark:text-slate-400">
            Loading department...
          </p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 dark:bg-red-900/20 dark:border-red-800">
          <p className="text-red-600 dark:text-red-400">
            Error loading department.
          </p>
        </div>
      )}

      {!isLoading && !error && dept && (
        <div className="space-y-6">
          {/* Header Card */}
          <div className="bg-white border border-slate-200 rounded-lg p-6 dark:bg-slate-800 dark:border-slate-700">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="p-4 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <Building2 className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                    {dept.name}
                  </h2>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    Department ID: {dept.id}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Link
                  href={`/dashboard/departments/${dept.id}/edit`}
                  className="bg-linear-to-r from-[#0C4A6E] to-[#075985] text-white px-4 py-2 rounded-lg font-medium hover:shadow-lg transition-all text-sm"
                >
                  Edit Department
                </Link>
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-all text-sm flex items-center gap-2 disabled:opacity-50"
                >
                  {isDeleting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}
                  Delete
                </button>
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="grid gap-6 md:grid-cols-2">
            <div className="bg-white border border-slate-200 rounded-lg p-6 dark:bg-slate-800 dark:border-slate-700">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
                <FileText className="h-5 w-5 text-slate-500 dark:text-slate-400" />
                Description
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                {dept.description || "No description provided"}
              </p>
            </div>

            <div className="bg-white border border-slate-200 rounded-lg p-6 dark:bg-slate-800 dark:border-slate-700">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
                <Calendar className="h-5 w-5 text-slate-500 dark:text-slate-400" />
                Information
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600 dark:text-slate-400">
                    Status
                  </span>
                  <span className="font-medium text-green-600 dark:text-green-400">
                    Active
                  </span>
                </div>
                {dept.createdAt && (
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600 dark:text-slate-400">
                      Created
                    </span>
                    <span className="font-medium text-slate-900 dark:text-slate-200">
                      {new Date(dept.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                )}
                {dept.updatedAt && (
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600 dark:text-slate-400">
                      Last Updated
                    </span>
                    <span className="font-medium text-slate-900 dark:text-slate-200">
                      {new Date(dept.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
