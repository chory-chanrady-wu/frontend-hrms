"use client";
import Swal from "sweetalert2";

import { useParams, useRouter } from "next/navigation";
import { useGetUserById, useDeleteUser } from "@/hooks/user-query";
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  Calendar,
  Pencil,
  Trash2,
  Loader2,
  Shield,
} from "lucide-react";
import Link from "next/link";

export default function UserDetailPage() {
  const params = useParams();
  const router = useRouter();
  const userId = Number(params.id);
  const { data: userResponse, isLoading, isError } = useGetUserById(userId);
  const { mutate: deleteUser, isPending: isDeleting } = useDeleteUser();

  const user: any = userResponse?.data ?? userResponse;

  const handleDelete = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "Are you sure you want to delete this user?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteUser(userId, {
          onSuccess: () => {
            Swal.fire("Deleted!", "User has been deleted.", "success");
            router.push("/dashboard/settings/users");
          },
          onError: (error: any) => {
            Swal.fire(
              "Error",
              error?.message || "Failed to delete user.",
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
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (isError || !user) {
    return (
      <div className="text-center py-16">
        <p className="text-slate-500 dark:text-slate-400">User not found.</p>
        <Link
          href="/dashboard/settings/users"
          className="text-blue-600 hover:underline mt-2 inline-block"
        >
          Back to Users
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard/settings/users"
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition"
          >
            <ArrowLeft className="h-5 w-5 text-slate-600 dark:text-slate-400" />
          </Link>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            User Details
          </h1>
        </div>
        <div className="flex gap-2">
          <Link
            href={`/dashboard/settings/users/${userId}/edit`}
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

      <div className="max-w-2xl space-y-6">
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-full bg-slate-200 dark:bg-slate-600 flex items-center justify-center">
              <User className="h-8 w-8 text-slate-400 dark:text-slate-300" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                {user.fullName || user.username || "N/A"}
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                @{user.username}
              </p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex items-start gap-3">
              <Mail className="h-4 w-4 text-slate-400 mt-0.5" />
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Email
                </p>
                <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                  {user.email || "—"}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Phone className="h-4 w-4 text-slate-400 mt-0.5" />
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Phone
                </p>
                <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                  {user.phoneNumber || "—"}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <User className="h-4 w-4 text-slate-400 mt-0.5" />
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  User ID
                </p>
                <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                  {user.id}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Shield className="h-4 w-4 text-slate-400 mt-0.5" />
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Role
                </p>
                <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                  {user.roleName || "—"}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <User className="h-4 w-4 text-slate-400 mt-0.5" />
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Status
                </p>
                <span
                  className={`inline-flex px-2 py-0.5 text-xs font-semibold rounded-full ${
                    user.status === true
                      ? "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300"
                      : "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300"
                  }`}
                >
                  {user.status === true ? "Active" : "Inactive"}
                </span>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Calendar className="h-4 w-4 text-slate-400 mt-0.5" />
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Created
                </p>
                <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                  {user.createdAt
                    ? new Date(user.createdAt).toLocaleDateString()
                    : "—"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
