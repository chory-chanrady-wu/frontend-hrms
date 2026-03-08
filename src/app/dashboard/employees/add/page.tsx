"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { useCreateEmployee } from "@/hooks/employee-query";
import { useGetAllDepartments } from "@/hooks/department-query";
import { useGetAllUsers } from "@/hooks/user-query";

export default function AddEmployeePage() {
  const router = useRouter();
  const { mutate: createEmployee, isPending } = useCreateEmployee();
  const { data: deptResponse } = useGetAllDepartments();
  const { data: usersResponse } = useGetAllUsers();

  const departments = Array.isArray(deptResponse)
    ? deptResponse
    : Array.isArray(deptResponse?.data)
      ? deptResponse.data
      : [];

  const users = Array.isArray(usersResponse)
    ? usersResponse
    : Array.isArray(usersResponse?.data)
      ? usersResponse.data
      : [];

  const [formData, setFormData] = useState({
    userId: "",
    departmentId: "",
    jobTitle: "",
    employmentType: "full-time",
    salary: "",
    hireDate: "",
    status: "active",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createEmployee(
      {
        userId: Number(formData.userId),
        departmentId: Number(formData.departmentId),
        jobTitle: formData.jobTitle,
        employmentType: formData.employmentType,
        salary: Number(formData.salary),
        hireDate: formData.hireDate,
        status: formData.status,
      },
      {
        onSuccess: () => router.push("/dashboard/employees"),
        onError: (err) => alert("Failed to create: " + (err as Error).message),
      },
    );
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
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
          href="/dashboard/employees"
          className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition"
        >
          <ArrowLeft className="h-5 w-5 text-slate-600 dark:text-slate-400" />
        </Link>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
          Add New Employee
        </h1>
      </div>

      <div className="max-w-4xl">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* User & Department */}
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
              Employee Information
            </h2>
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  User Account *
                </label>
                <select
                  name="userId"
                  value={formData.userId}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                >
                  <option value="">Select User</option>
                  {users.map((user: any) => (
                    <option key={user.id} value={user.id}>
                      {user.fullName || user.username} ({user.email})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Department *
                </label>
                <select
                  name="departmentId"
                  value={formData.departmentId}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                >
                  <option value="">Select Department</option>
                  {departments.map((dept: any) => (
                    <option key={dept.id} value={dept.id}>
                      {dept.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Job Title *
                </label>
                <input
                  type="text"
                  name="jobTitle"
                  value={formData.jobTitle}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  placeholder="e.g. Software Engineer"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Employment Type *
                </label>
                <select
                  name="employmentType"
                  value={formData.employmentType}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                >
                  <option value="full-time">Full-time</option>
                  <option value="part-time">Part-time</option>
                  <option value="contract">Contract</option>
                  <option value="intern">Intern</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Hire Date *
                </label>
                <input
                  type="date"
                  name="hireDate"
                  value={formData.hireDate}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Salary *
                </label>
                <input
                  type="number"
                  name="salary"
                  value={formData.salary}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  placeholder="0.00"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="on_leave">On Leave</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={isPending}
              className="bg-linear-to-r from-[#0C4A6E] to-[#075985] text-white px-6 py-2 rounded-lg font-medium hover:shadow-lg transition-all disabled:opacity-50 flex items-center gap-2"
            >
              {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
              Create Employee
            </button>
            <Link
              href="/dashboard/employees"
              className="bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 px-6 py-2 rounded-lg font-medium hover:bg-slate-50 dark:hover:bg-slate-600 transition"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
