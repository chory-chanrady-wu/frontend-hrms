"use client";

import Swal from "sweetalert2";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useCreateDepartment } from "@/hooks/department-query";
import { useGetAllUsers } from "@/hooks/user-query";

export default function AddDepartmentPage() {
  const router = useRouter();
  const { mutate: createDepartment, isPending } = useCreateDepartment();
  const { data: userResponse } = useGetAllUsers();

  const userList = Array.isArray(userResponse)
    ? userResponse
    : Array.isArray(userResponse?.data)
      ? userResponse.data
      : [];

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    headOfDepartmentId: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createDepartment(
      {
        name: formData.name,
        description: formData.description,
        headOfDepartmentId: formData.headOfDepartmentId
          ? Number(formData.headOfDepartmentId)
          : null,
      },
      {
        onSuccess: () => {
          const isDark =
            typeof window !== "undefined" &&
            document.documentElement.classList.contains("dark");
          Swal.fire({
            title: "Success!",
            text: "Department created successfully.",
            icon: "success",
            background: isDark ? "#1e293b" : "#fff",
            color: isDark ? "#f1f5f9" : "#1e293b",
            customClass: {
              popup: isDark ? "swal2-dark" : "",
            },
          }).then(() => {
            router.push("/dashboard/departments");
          });
        },
      },
    );
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

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
          Add New Department
        </h1>
      </div>

      <div className="max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-lg p-6 dark:bg-slate-800 dark:border-slate-700">
            <div className="space-y-6">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
                >
                  Department Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none dark:bg-slate-700 dark:border-slate-600 dark:text-slate-100"
                  placeholder="e.g., Engineering"
                />
              </div>

              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
                >
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none dark:bg-slate-700 dark:border-slate-600 dark:text-slate-100"
                  placeholder="Brief description of the department"
                />
              </div>

              <div>
                <label
                  htmlFor="headOfDepartmentId"
                  className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
                >
                  Head of Department
                </label>
                <select
                  id="headOfDepartmentId"
                  name="headOfDepartmentId"
                  value={formData.headOfDepartmentId}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none dark:bg-slate-700 dark:border-slate-600 dark:text-slate-100"
                >
                  <option value="">Select Head of Department (optional)</option>
                  {userList.map((user: any) => (
                    <option key={user.id} value={user.id}>
                      {user.fullName || user.username} — {user.email}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={isPending}
              className="bg-linear-to-r from-[#0C4A6E] to-[#075985] text-white px-6 py-2 rounded-lg font-medium hover:shadow-lg transition-all disabled:opacity-50"
            >
              {isPending ? "Creating..." : "Create Department"}
            </button>
            <Link
              href="/dashboard/departments"
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
