"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { useCreatePayroll } from "@/hooks/payroll-query";
import { useGetAllEmployees } from "@/hooks/employee-query";

export default function GeneratePayrollPage() {
  const router = useRouter();
  const { mutate: createPayroll, isPending } = useCreatePayroll();
  const { data: employeesResponse } = useGetAllEmployees();

  const employees = Array.isArray(employeesResponse)
    ? employeesResponse
    : Array.isArray(employeesResponse?.data)
      ? employeesResponse.data
      : [];

  const [formData, setFormData] = useState({
    employeeId: "",
    month: "",
    year: "",
    basicSalary: "",
    bonus: "",
    deductions: "",
  });

  const basicSalary = Number(formData.basicSalary) || 0;
  const bonus = Number(formData.bonus) || 0;
  const deductions = Number(formData.deductions) || 0;
  const netSalary = basicSalary + bonus - deductions;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createPayroll(
      {
        employeeId: Number(formData.employeeId),
        month: Number(formData.month),
        year: Number(formData.year),
        basicSalary,
        bonus,
        deductions,
        netSalary,
      },
      {
        onSuccess: () => router.push("/dashboard/payroll"),
        onError: (err) =>
          alert("Failed to generate: " + (err as Error).message),
      },
    );
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
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
          href="/dashboard/payroll"
          className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition"
        >
          <ArrowLeft className="h-5 w-5 text-slate-600 dark:text-slate-400" />
        </Link>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
          Generate Payroll
        </h1>
      </div>

      <div className="max-w-3xl">
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="employeeId"
                className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
              >
                Employee *
              </label>
              <select
                id="employeeId"
                name="employeeId"
                value={formData.employeeId}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              >
                <option value="">Select employee</option>
                {employees.map((emp: any) => (
                  <option key={emp.id} value={emp.id}>
                    {emp.fullName || emp.username || `Employee #${emp.id}`}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label
                  htmlFor="month"
                  className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
                >
                  Month *
                </label>
                <select
                  id="month"
                  name="month"
                  value={formData.month}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                >
                  <option value="">Select month</option>
                  <option value="1">January</option>
                  <option value="2">February</option>
                  <option value="3">March</option>
                  <option value="4">April</option>
                  <option value="5">May</option>
                  <option value="6">June</option>
                  <option value="7">July</option>
                  <option value="8">August</option>
                  <option value="9">September</option>
                  <option value="10">October</option>
                  <option value="11">November</option>
                  <option value="12">December</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="year"
                  className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
                >
                  Year *
                </label>
                <select
                  id="year"
                  name="year"
                  value={formData.year}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                >
                  <option value="">Select year</option>
                  <option value="2026">2026</option>
                  <option value="2025">2025</option>
                  <option value="2024">2024</option>
                </select>
              </div>
            </div>

            <div>
              <label
                htmlFor="basicSalary"
                className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
              >
                Basic Salary *
              </label>
              <input
                type="number"
                id="basicSalary"
                name="basicSalary"
                value={formData.basicSalary}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                placeholder="0.00"
              />
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label
                  htmlFor="bonus"
                  className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
                >
                  Bonus
                </label>
                <input
                  type="number"
                  id="bonus"
                  name="bonus"
                  value={formData.bonus}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  placeholder="0.00"
                />
              </div>

              <div>
                <label
                  htmlFor="deductions"
                  className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
                >
                  Deductions
                </label>
                <input
                  type="number"
                  id="deductions"
                  name="deductions"
                  value={formData.deductions}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  placeholder="0.00"
                />
              </div>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 dark:text-blue-200 mb-2">
                Summary
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-blue-700 dark:text-blue-300">
                    Basic Salary:
                  </span>
                  <span className="font-medium text-blue-900 dark:text-blue-200">
                    ${basicSalary.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-700 dark:text-blue-300">
                    Bonus:
                  </span>
                  <span className="font-medium text-green-700 dark:text-green-300">
                    +${bonus.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-700 dark:text-blue-300">
                    Deductions:
                  </span>
                  <span className="font-medium text-red-700 dark:text-red-300">
                    -${deductions.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between border-t border-blue-200 dark:border-blue-700 pt-2">
                  <span className="font-semibold text-blue-900 dark:text-blue-200">
                    Net Salary:
                  </span>
                  <span className="font-bold text-blue-900 dark:text-blue-200">
                    ${netSalary.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                disabled={isPending}
                className="bg-linear-to-r from-[#0C4A6E] to-[#075985] text-white px-6 py-2 rounded-lg font-medium hover:shadow-lg transition-all disabled:opacity-50 flex items-center gap-2"
              >
                {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                Generate Payroll
              </button>
              <Link
                href="/dashboard/payroll"
                className="bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 px-6 py-2 rounded-lg font-medium hover:bg-slate-50 dark:hover:bg-slate-600 transition"
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
