"use client";

import { User, Mail, Shield, Edit, Trash2, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useGetAllUsers, useDeleteUser } from "@/hooks/user-query";
import { UserInfo } from "@/lib/types";

export default function UsersPage() {
  const router = useRouter();
  const { data: usersResponse, isLoading, isError } = useGetAllUsers();
  const deleteUser = useDeleteUser();

  const users: UserInfo[] = Array.isArray(usersResponse)
    ? usersResponse
    : Array.isArray(usersResponse?.data)
      ? usersResponse.data
      : [];

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this user?")) {
      deleteUser.mutate(id);
    }
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
        Failed to load users. Please try again later.
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
          User Management
        </h1>
      </div>

      {/* Users Table */}
      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden dark:bg-slate-800 dark:border-slate-700">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-200 dark:bg-slate-700 dark:border-slate-600">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider dark:text-slate-300">
                User
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider dark:text-slate-300">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider dark:text-slate-300">
                Role
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider dark:text-slate-300">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider dark:text-slate-300">
                Created At
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider dark:text-slate-300">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
            {users.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-6 py-8 text-center text-sm text-slate-500"
                >
                  No users found.
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr
                  key={user.id}
                  onClick={() =>
                    router.push(`/dashboard/settings/users/${user.id}`)
                  }
                  className="hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-sm font-semibold text-blue-600">
                        {user.fullName
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()
                          .slice(0, 2)}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-slate-900 dark:text-slate-100">
                          {user.fullName}
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">
                          @{user.username}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                      <Mail className="h-4 w-4" />
                      {user.email}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                      <Shield className="h-4 w-4" />
                      {user.roleName}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        user.status === false
                          ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                          : "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                      }`}
                    >
                      {user.status ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-slate-600 dark:text-slate-300">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div
                      className="flex justify-end gap-2"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Link
                        href={`/dashboard/settings/users/${user.id}/edit`}
                        className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                      >
                        <Edit className="h-4 w-4" />
                      </Link>
                      <button
                        onClick={() => handleDelete(user.id)}
                        disabled={deleteUser.isPending}
                        className="text-red-600 hover:text-red-900 disabled:opacity-50 dark:text-red-400 dark:hover:text-red-300"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
