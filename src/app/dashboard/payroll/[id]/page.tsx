"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useGetPayrollById } from "@/hooks/payroll-query";
import { useGetAllEmployees } from "@/hooks/employee-query";

import { useParams } from "next/navigation";
import { employeesApi } from "@/lib/api";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";

export default function PayrollDetailPage() {
  const [showPasswordModal, setShowPasswordModal] = useState(true);
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Get current username from localStorage
  const username =
    typeof window !== "undefined" ? localStorage.getItem("username") : "";

  // Password validation handler
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError("");
    setLoading(true);
    try {
      // Get employeeId from localStorage or employee object
      let usernameOrEmail = null;
      if (typeof window !== "undefined") {
        usernameOrEmail = localStorage.getItem("email");
        if (!usernameOrEmail) {
          usernameOrEmail = localStorage.getItem("username");
        }
      }
      if (!usernameOrEmail && employee) {
        usernameOrEmail = employee.email || employee.username;
      }
      if (!usernameOrEmail) {
        setPasswordError("Employee email or username not found.");
        setLoading(false);
        return;
      }
      // Use employeesApi.validatePassword
      const result = await employeesApi.validatePassword(
        usernameOrEmail,
        password,
      );
      if (result === true || result?.valid === true) {
        setShowPasswordModal(false);
      } else {
        setPasswordError("Invalid password. Please try again.");
      }
    } catch (err) {
      setPasswordError("Error validating password. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  const params = useParams();
  const payrollId = Number(params.id);
  const {
    data: payrollResponse,
    isLoading,
    error,
  } = useGetPayrollById(payrollId);
  const { data: employeesResponse } = useGetAllEmployees();

  const payroll = payrollResponse?.data || payrollResponse;
  const employees = Array.isArray(employeesResponse)
    ? employeesResponse
    : Array.isArray(employeesResponse?.data)
      ? employeesResponse.data
      : [];
  const employee = employees.find(
    (e: any) => String(e.id) === String(payroll?.employeeId),
  );

  const monthNames = [
    "",
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

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
          Payroll Details
        </h1>
      </div>

      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      )}

      {error && (
        <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg p-6">
          <p className="text-red-600 dark:text-red-400">
            Error loading payroll details.
          </p>
        </div>
      )}

      {showPasswordModal && (
        <div className="fixed top-1/2 left-1/2 z-50 transform -translate-x-1/2 -translate-y-1/2">
          <div className="bg-white dark:bg-slate-800 rounded-lg p-8 shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4 text-center text-slate-900 dark:text-slate-100">
              Enter Password
            </h2>
            <form onSubmit={handlePasswordSubmit} className="space-y-6">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-8 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                placeholder="Password"
                autoFocus
                disabled={loading}
              />
              {passwordError && (
                <p className="text-red-600 text-sm">{passwordError}</p>
              )}
              <div className="flex gap-3 justify-center">
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:shadow-lg transition-all"
                  disabled={loading}
                >
                  {loading ? "Validating..." : "Submit"}
                </button>
                <button
                  type="button"
                  className="bg-gray-300 dark:bg-slate-700 text-slate-700 dark:text-slate-300 px-6 py-2 rounded-lg font-medium hover:bg-gray-400 dark:hover:bg-slate-600 transition"
                  onClick={() => router.push("/dashboard/payroll")}
                  disabled={loading}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {!isLoading && !error && payroll && !showPasswordModal && (
        <div>
          {/* Summary Card */}
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-6 mb-6">
            <div className="mb-6 flex flex-col items-center justify-center">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2 text-center">
                {monthNames[payroll.month] || payroll.month} {payroll.year}
              </h2>
              <div className="mb-2 flex flex-row items-center gap-20">
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Employee ID:{" "}
                  <span className="font-semibold">
                    EMP-{payroll.employeeId}
                  </span>
                </p>
                {employee && (
                  <>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Full Name:{" "}
                      <span className="font-semibold">
                        {employee.fullName || employee.username}
                      </span>
                    </p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Email:{" "}
                      <span className="font-semibold">{employee.email}</span>
                    </p>
                  </>
                )}
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-4">
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                  Net Salary
                </p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                  $
                  {payroll.netSalary?.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                  Basic Salary
                </p>
                <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                  $
                  {typeof payroll.baseSalary === "number"
                    ? payroll.baseSalary.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })
                    : "0.00"}
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                  Bonus
                </p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                  +${payroll.bonus?.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                  Period
                </p>
                <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                  {monthNames[payroll.month]} {payroll.year}
                </p>
              </div>
            </div>
          </div>

          {/* Breakdown */}
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
              Payment Breakdown
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between py-3 border-b border-slate-200 dark:border-slate-700">
                <span className="text-slate-700 dark:text-slate-300">
                  Basic Salary
                </span>
                <span className="font-semibold text-slate-900 dark:text-slate-100">
                  $
                  {typeof payroll.baseSalary === "number"
                    ? payroll.baseSalary.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })
                    : "0.00"}
                </span>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-slate-200 dark:border-slate-700">
                <span className="text-slate-700 dark:text-slate-300">
                  Bonus
                </span>
                <span className="font-semibold text-green-600 dark:text-green-400">
                  +$
                  {payroll.bonus?.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </span>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-slate-200 dark:border-slate-700">
                <span className="text-slate-700 dark:text-slate-300">
                  Deductions
                </span>
                <span className="font-semibold text-red-600 dark:text-red-400">
                  -$
                  {payroll.deduction?.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </span>
              </div>
              <div className="flex items-center justify-between py-3">
                <span className="font-semibold text-slate-900 dark:text-slate-100">
                  Net Salary
                </span>
                <span className="font-bold text-lg text-green-600 dark:text-green-400">
                  ${payroll.netSalary?.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
