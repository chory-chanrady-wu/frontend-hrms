"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import {
  useGetDepartmentById,
  useUpdateDepartment,
} from "@/hooks/department-query";

export default function EditDepartmentPage() {
  const router = useRouter();
  const params = useParams();
  const departmentId = Number(params.id);
  const { data: response, isLoading } = useGetDepartmentById(departmentId);
  const { mutate: updateDepartment, isPending } = useUpdateDepartment();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  useEffect(() => {
    const dept = Array.isArray(response)
      ? response[0]
      : response?.data || response;
    if (dept) {
      setFormData({
        name: dept.name || "",
        description: dept.description || "",
      });
    }
  }, [response]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateDepartment(
      {
        id: departmentId,
        deptData: { name: formData.name, description: formData.description },
      },
      {
        onSuccess: () => {
          router.push("/dashboard/departments");
        },
      },
    );
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-slate-600 dark:text-slate-400">
          Loading department...
        </p>
      </div>
    );
  }

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
          Edit Department
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
                />
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={isPending}
              className="bg-linear-to-r from-[#0C4A6E] to-[#075985] text-white px-6 py-2 rounded-lg font-medium hover:shadow-lg transition-all disabled:opacity-50"
            >
              {isPending ? "Saving..." : "Save Changes"}
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
