"use client";
import Swal from "sweetalert2";

import { Shield, Edit, Trash2, Loader2 } from "lucide-react";
import Link from "next/link";
import { useGetAllRoles, useDeleteRole } from "@/hooks/role-query";
import type { RoleInfo } from "@/lib/types";

const ROLE_COLORS: Record<string, { bg: string; text: string }> = {
  ADMIN: { bg: "bg-red-100", text: "text-red-600" },
  HR: { bg: "bg-blue-100", text: "text-blue-600" },
  MANAGER: { bg: "bg-green-100", text: "text-green-600" },
  EMPLOYEE: { bg: "bg-slate-100", text: "text-slate-600" },
  ACCOUNTANT: { bg: "bg-amber-100", text: "text-amber-600" },
};

const DEFAULT_COLOR = { bg: "bg-purple-100", text: "text-purple-600" };

function parsePermissions(permissions: string): string[] {
  try {
    const parsed = JSON.parse(permissions);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export default function RolesPage() {
  const { data: rolesResponse, isLoading, isError } = useGetAllRoles();
  const deleteRole = useDeleteRole();

  const roles: RoleInfo[] = Array.isArray(rolesResponse)
    ? rolesResponse
    : Array.isArray(rolesResponse?.data)
      ? rolesResponse.data
      : [];

  const handleDelete = (id: number) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Are you sure you want to delete this role?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteRole.mutate(id, {
          onSuccess: () => {
            Swal.fire("Deleted!", "Role has been deleted.", "success");
          },
          onError: (error: any) => {
            Swal.fire(
              "Error",
              error?.message || "Failed to delete role.",
              "error",
            );
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

  if (isError) {
    return (
      <div className="text-center py-12 text-red-500">
        Failed to load roles. Please try again later.
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
          Roles & Permissions
        </h1>
        <Link
          href="/dashboard/settings/roles/add"
          className="bg-linear-to-r from-[#0C4A6E] to-[#075985] text-white px-4 py-2 rounded-lg font-medium hover:shadow-lg transition-all"
        >
          Add Role
        </Link>
      </div>

      {roles.length === 0 ? (
        <div className="text-center py-12 text-sm text-slate-500">
          No roles found.
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {roles.map((role) => {
            const color = ROLE_COLORS[role.roleName] || DEFAULT_COLOR;
            const permissions = parsePermissions(role.permissions);

            return (
              <div
                key={role.id}
                className="bg-white border border-slate-200 rounded-lg p-6 hover:shadow-md transition-shadow dark:bg-slate-800 dark:border-slate-700"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-3 ${color.bg} rounded-lg`}>
                      <Shield className={`h-6 w-6 ${color.text}`} />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                        {role.roleName}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Created {new Date(role.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {/* Lock Admin and EMPLOYEE roles: hide edit/delete buttons */}
                    {role.roleName !== "Admin" &&
                      role.roleName !== "EMPLOYEE" && (
                        <>
                          <Link
                            href={`/dashboard/settings/roles/${role.id}/edit`}
                            className="p-2 text-slate-400 hover:text-blue-600 transition dark:text-slate-500 dark:hover:text-blue-400"
                          >
                            <Edit className="h-4 w-4" />
                          </Link>
                          <button
                            onClick={() => handleDelete(role.id)}
                            disabled={deleteRole.isPending}
                            className="p-2 text-slate-400 hover:text-red-600 transition disabled:opacity-50 dark:text-slate-500 dark:hover:text-red-400"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </>
                      )}
                  </div>
                </div>
                {permissions.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {permissions.map((perm) => (
                      <span
                        key={perm}
                        className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300"
                      >
                        {perm}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
