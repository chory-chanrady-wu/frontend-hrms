"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { useGetRoleById, useUpdateRole } from "@/hooks/role-query";
import type { RoleInfo } from "@/lib/types";

const PERMISSION_ACTIONS = ["read", "write", "update", "delete"] as const;

const PERMISSION_MODULES = [
  { module: "employees", label: "Employees" },
  { module: "departments", label: "Departments" },
  { module: "attendance", label: "Attendance" },
  { module: "leave", label: "Leave" },
  { module: "payroll", label: "Payroll" },
  { module: "performance", label: "Performance" },
  { module: "recruitment", label: "Recruitment" },
  { module: "training", label: "Training" },
  { module: "reports", label: "Reports" },
  { module: "announcements", label: "Announcements" },
  { module: "users", label: "Users" },
  { module: "roles", label: "Roles" },
];

function permKey(module: string, action: string) {
  return `${module}:${action}`;
}

function parsePermissions(permissions: string): string[] {
  try {
    const parsed = JSON.parse(permissions);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export default function EditRolePage() {
  const router = useRouter();
  const params = useParams();
  const roleId = Number(params.id);

  const { data: roleResponse, isLoading, isError } = useGetRoleById(roleId);
  const updateRole = useUpdateRole();

  const role = (roleResponse?.data ?? roleResponse) as RoleInfo | undefined;

  const [roleName, setRoleName] = useState("");
  const [selectedPermissions, setSelectedPermissions] = useState<Set<string>>(
    new Set(),
  );
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (role && !initialized) {
      setRoleName(role.roleName);
      setSelectedPermissions(new Set(parsePermissions(role.permissions)));
      setInitialized(true);
    }
  }, [role, initialized]);

  const toggle = (key: string) => {
    setSelectedPermissions((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const toggleModule = (module: string) => {
    const keys = PERMISSION_ACTIONS.map((a) => permKey(module, a));
    const allSelected = keys.every((k) => selectedPermissions.has(k));
    setSelectedPermissions((prev) => {
      const next = new Set(prev);
      keys.forEach((k) => (allSelected ? next.delete(k) : next.add(k)));
      return next;
    });
  };

  const toggleAction = (action: string) => {
    const keys = PERMISSION_MODULES.map((m) => permKey(m.module, action));
    const allSelected = keys.every((k) => selectedPermissions.has(k));
    setSelectedPermissions((prev) => {
      const next = new Set(prev);
      keys.forEach((k) => (allSelected ? next.delete(k) : next.add(k)));
      return next;
    });
  };

  const toggleAll = () => {
    const allKeys = PERMISSION_MODULES.flatMap((m) =>
      PERMISSION_ACTIONS.map((a) => permKey(m.module, a)),
    );
    const allSelected = allKeys.every((k) => selectedPermissions.has(k));
    setSelectedPermissions(new Set(allSelected ? [] : allKeys));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateRole.mutate(
      {
        id: roleId,
        roleData: {
          roleName,
          permissions: JSON.stringify(Array.from(selectedPermissions)),
        },
      },
      {
        onSuccess: () => {
          router.push("/dashboard/settings/roles");
        },
      },
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
      </div>
    );
  }

  if (isError || !role) {
    return (
      <div className="text-center py-12 text-red-500">
        Failed to load role. Please try again later.
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <Link
          href="/dashboard/settings/roles"
          className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition"
        >
          <ArrowLeft className="h-5 w-5 text-slate-600 dark:text-slate-400" />
        </Link>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
          Edit Role
        </h1>
      </div>

      <div className="max-w-4xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="max-w-md">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Role Name *
            </label>
            <input
              type="text"
              value={roleName}
              onChange={(e) => setRoleName(e.target.value)}
              required
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none dark:bg-slate-700 dark:border-slate-600 dark:text-slate-100"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
              Permissions
            </label>
            <div className="bg-white border border-slate-200 rounded-lg overflow-hidden dark:bg-slate-800 dark:border-slate-700">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200 dark:bg-slate-700 dark:border-slate-600">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={
                            PERMISSION_MODULES.flatMap((m) =>
                              PERMISSION_ACTIONS.map((a) =>
                                permKey(m.module, a),
                              ),
                            ).every((k) => selectedPermissions.has(k)) &&
                            selectedPermissions.size > 0
                          }
                          onChange={toggleAll}
                          className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                        />
                        Module
                      </label>
                    </th>
                    {PERMISSION_ACTIONS.map((action) => (
                      <th
                        key={action}
                        className="px-4 py-3 text-center text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider"
                      >
                        <label className="flex flex-col items-center gap-1 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={
                              PERMISSION_MODULES.every((m) =>
                                selectedPermissions.has(
                                  permKey(m.module, action),
                                ),
                              ) && selectedPermissions.size > 0
                            }
                            onChange={() => toggleAction(action)}
                            className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                          />
                          {action}
                        </label>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                  {PERMISSION_MODULES.map((mod) => {
                    const moduleKeys = PERMISSION_ACTIONS.map((a) =>
                      permKey(mod.module, a),
                    );
                    const allChecked = moduleKeys.every((k) =>
                      selectedPermissions.has(k),
                    );
                    return (
                      <tr
                        key={mod.module}
                        className="hover:bg-slate-50 dark:hover:bg-slate-700"
                      >
                        <td className="px-4 py-3">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={allChecked}
                              onChange={() => toggleModule(mod.module)}
                              className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                              {mod.label}
                            </span>
                          </label>
                        </td>
                        {PERMISSION_ACTIONS.map((action) => {
                          const key = permKey(mod.module, action);
                          return (
                            <td key={action} className="px-4 py-3 text-center">
                              <input
                                type="checkbox"
                                checked={selectedPermissions.has(key)}
                                onChange={() => toggle(key)}
                                className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                              />
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {updateRole.isError && (
            <p className="text-sm text-red-500">
              Failed to update role. Please try again.
            </p>
          )}

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={updateRole.isPending}
              className="bg-linear-to-r from-[#0C4A6E] to-[#075985] text-white px-6 py-2 rounded-lg font-medium hover:shadow-lg transition-all disabled:opacity-50"
            >
              {updateRole.isPending ? "Saving..." : "Save Changes"}
            </button>
            <Link
              href="/dashboard/settings/roles"
              className="bg-white border border-slate-300 text-slate-700 px-6 py-2 rounded-lg font-medium hover:bg-slate-50 transition dark:bg-slate-700 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-600"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
