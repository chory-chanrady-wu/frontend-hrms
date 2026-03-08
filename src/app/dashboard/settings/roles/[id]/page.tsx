"use client";

import { useParams, useRouter } from "next/navigation";
import { useGetRoleById, useDeleteRole } from "@/hooks/role-query";
import {
  ArrowLeft,
  Shield,
  Pencil,
  Trash2,
  Loader2,
  CheckCircle,
  XCircle,
} from "lucide-react";
import Link from "next/link";

export default function RoleDetailPage() {
  const params = useParams();
  const router = useRouter();
  const roleId = Number(params.id);
  const { data: roleResponse, isLoading, isError } = useGetRoleById(roleId);
  const { mutate: deleteRole, isPending: isDeleting } = useDeleteRole();

  const role: any = roleResponse?.data ?? roleResponse;

  const handleDelete = () => {
    if (!confirm("Are you sure you want to delete this role?")) return;
    deleteRole(roleId, {
      onSuccess: () => router.push("/dashboard/settings/roles"),
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (isError || !role) {
    return (
      <div className="text-center py-16">
        <p className="text-slate-500 dark:text-slate-400">Role not found.</p>
        <Link
          href="/dashboard/settings/roles"
          className="text-blue-600 hover:underline mt-2 inline-block"
        >
          Back to Roles
        </Link>
      </div>
    );
  }

  let permissions: Record<string, Record<string, boolean>> = {};
  try {
    permissions =
      typeof role.permissions === "string"
        ? JSON.parse(role.permissions)
        : role.permissions || {};
  } catch {
    permissions = {};
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard/settings/roles"
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition"
          >
            <ArrowLeft className="h-5 w-5 text-slate-600 dark:text-slate-400" />
          </Link>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            Role Details
          </h1>
        </div>
        <div className="flex gap-2">
          <Link
            href={`/dashboard/settings/roles/${roleId}/edit`}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition text-sm font-medium"
          >
            <Pencil className="h-4 w-4" /> Edit
          </Link>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition text-sm font-medium disabled:opacity-50"
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

      <div className="space-y-6 max-w-4xl">
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <Shield className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                {role.roleName || "N/A"}
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Role ID: {role.id}
              </p>
            </div>
          </div>
        </div>

        {Object.keys(permissions).length > 0 && (
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
              Permissions
            </h3>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {Object.entries(permissions).map(([module, perms]) => (
                <div
                  key={module}
                  className="border border-slate-200 dark:border-slate-600 rounded-lg p-4"
                >
                  <h4 className="font-medium text-slate-900 dark:text-slate-100 mb-2 capitalize">
                    {module}
                  </h4>
                  <div className="space-y-1">
                    {Object.entries(perms as Record<string, boolean>).map(
                      ([action, enabled]) => (
                        <div
                          key={action}
                          className="flex items-center gap-2 text-sm"
                        >
                          {enabled ? (
                            <CheckCircle className="h-3.5 w-3.5 text-green-500" />
                          ) : (
                            <XCircle className="h-3.5 w-3.5 text-slate-300 dark:text-slate-600" />
                          )}
                          <span
                            className={
                              enabled
                                ? "text-slate-700 dark:text-slate-300"
                                : "text-slate-400 dark:text-slate-500"
                            }
                          >
                            {action}
                          </span>
                        </div>
                      ),
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
