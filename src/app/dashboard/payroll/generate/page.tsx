"use client";
import Swal from "sweetalert2";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { useCreatePayroll } from "@/hooks/payroll-query";
import { useGetAllEmployees } from "@/hooks/employee-query";

export default function GeneratePayrollPage() {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 6 }, (_, i) => currentYear - i);
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
    bonusPercent: "",
    deduction: "",
  });
  // Get user role from localStorage
  let userRole = "";
  const storedUser =
    typeof window !== "undefined" ? localStorage.getItem("user") : null;
  if (storedUser) {
    try {
      const userObj = JSON.parse(storedUser);
      userRole = userObj.role || userObj.roleName || userObj.permission || "";
    } catch {}
  }

  // Only allow admin and hr to view dashboard
  if (userRole.toLowerCase() !== "admin" && userRole.toLowerCase() !== "hr") {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <h1 className="text-2xl font-semibold text-red-600 mb-4">
          Not Authorized
        </h1>
        <p className="text-lg text-gray-600">
          You do not have access to the dashboard.
        </p>
      </div>
    );
  }
  const handleEmployeeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const employeeId = e.target.value;
    setFormData((prev) => ({
      ...prev,
      employeeId,
    }));
  };

  // Always get baseSalary from selected employee, robustly
  const selectedEmp = employees.find(
    (emp: any) => String(emp.id) === formData.employeeId,
  );
  let baseSalary = 0;
  if (selectedEmp) {
    const salary = selectedEmp.salary;
    if (typeof salary === "number" && !isNaN(salary)) {
      baseSalary = salary;
    } else if (
      typeof salary === "string" &&
      salary.trim() !== "" &&
      !isNaN(Number(salary))
    ) {
      baseSalary = Number(salary);
    }
  }
  // Debug log
  if (typeof window !== "undefined") {
    console.log(
      "selectedEmp",
      selectedEmp,
      "salary",
      selectedEmp?.salary,
      "baseSalary",
      baseSalary,
    );
  }
  const bonusPercent = Number(formData.bonusPercent) || 0;
  const bonus = baseSalary * (bonusPercent / 100);
  const deduction = Number(formData.deduction) || 0;
  const netSalary = baseSalary + bonus - deduction;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Defensive: ensure employee is selected
    if (!selectedEmp) {
      Swal.fire("Validation", "Please select an employee.", "warning");
      return;
    }
    createPayroll(
      {
        employeeId: Number(formData.employeeId),
        month: Number(formData.month),
        year: Number(formData.year),
        baseSalary,
        bonus,
        deduction,
        netSalary,
      },
      {
        onSuccess: () => router.push("/dashboard/payroll"),
        onError: (err) =>
          Swal.fire(
            "Error",
            "Failed to generate: " + (err as Error).message,
            "error",
          ),
      },
    );
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
                onChange={handleEmployeeChange}
                required
                className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              >
                <option value="">Select employee</option>
                {employees.map((emp: any) => (
                  <option key={emp.id} value={emp.id}>
                    {emp.fullName || emp.username || `Employee #${emp.id}`}
                    {emp.email ? ` (${emp.email})` : ""}
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
                  {years.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Basic Salary field is hidden from UI */}

            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label
                  htmlFor="bonusPercent"
                  className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
                >
                  Bonus (% of salary)
                </label>
                <input
                  type="number"
                  id="bonusPercent"
                  name="bonusPercent"
                  value={formData.bonusPercent}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  placeholder="Enter bonus %"
                  min="0"
                  max="100"
                />
              </div>

              <div>
                <label
                  htmlFor="deduction"
                  className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
                >
                  Deduction
                </label>
                <input
                  type="number"
                  id="deduction"
                  name="deduction"
                  value={formData.deduction}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  placeholder="0.00"
                />
              </div>
            </div>

            {/* Summary section removed */}

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
