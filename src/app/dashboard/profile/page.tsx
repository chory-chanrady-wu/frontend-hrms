"use client";

import { useEffect, useState } from "react";
import { useGetEmployeeById, useGetAllEmployees } from "@/hooks/employee-query";
import { useGetUserByUsername } from "@/hooks/user-query";
import type { EmployeeProfile } from "@/lib/types";
import {
  User,
  Mail,
  Phone,
  Calendar,
  Building2,
  Briefcase,
} from "lucide-react";

export default function ProfilePage() {
  const [employeeId, setEmployeeId] = useState<number | null>(null);
  const [username, setUsername] = useState<string>("");

  useEffect(() => {
    const storedEmployeeId = localStorage.getItem("employeeId");
    const storedUserId = localStorage.getItem("userId");

    // Try employeeId first (always numeric)
    const empId = Number(storedEmployeeId);
    if (!Number.isNaN(empId) && empId > 0) {
      setEmployeeId(empId);
      return;
    }

    // Try userId — could be numeric or a username string
    const userIdNum = Number(storedUserId);
    if (!Number.isNaN(userIdNum) && userIdNum > 0) {
      setEmployeeId(userIdNum);
      return;
    }

    // userId is a username string (e.g. "seed.admin") — resolve via API
    if (storedUserId) {
      setUsername(storedUserId);
      return;
    }

    // Fallback: decode JWT
    const token =
      localStorage.getItem("accessToken") || localStorage.getItem("token");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        const jwtId = Number(
          payload.employeeId || payload.userId || payload.sub,
        );
        if (!Number.isNaN(jwtId) && jwtId > 0) {
          setEmployeeId(jwtId);
          return;
        }
        if (payload.sub && typeof payload.sub === "string") {
          setUsername(payload.sub);
        }
      } catch {
        // ignore decode errors
      }
    }
  }, []);

  // Step 1: Resolve username → numeric user ID via users API
  const { data: userResponse, isLoading: isLoadingUser } =
    useGetUserByUsername(username);

  // Step 2: Get all employees to find the one matching this user's ID
  const { data: allEmployeesResponse, isLoading: isLoadingAll } =
    useGetAllEmployees();

  // Step 3: Once we have the user's numeric ID, find their employee record
  useEffect(() => {
    if (!username || employeeId) return;

    // Handle both wrapped { data: {...} } and flat response shapes
    const userData = userResponse?.data ?? userResponse;
    const numericUserId = userData?.id;
    const employeesRaw = allEmployeesResponse?.data ?? allEmployeesResponse;
    const employees = Array.isArray(employeesRaw) ? employeesRaw : null;

    if (numericUserId && employees) {
      // Find employee whose userId matches the user's numeric id
      const match = (employees as EmployeeProfile[]).find(
        (emp) => emp.userId === numericUserId,
      );
      if (match) {
        setEmployeeId(match.id);
        return;
      }
      // Fallback: try matching by username directly
      const matchByName = (employees as EmployeeProfile[]).find(
        (emp) => emp.username === username,
      );
      if (matchByName) {
        setEmployeeId(matchByName.id);
        return;
      }
      // Last resort: use the user's numeric ID as employee ID
      setEmployeeId(numericUserId);
    }
  }, [username, employeeId, userResponse, allEmployeesResponse]);

  // Fetch single employee by resolved ID
  const {
    data: employeeResponse,
    isLoading: isLoadingEmployee,
    isError,
  } = useGetEmployeeById(employeeId ?? 0);

  // Handle both wrapped { data: {...} } and flat response shapes
  const employee = (employeeResponse?.data ?? employeeResponse) as
    | EmployeeProfile
    | undefined;
  const isResolving = username && !employeeId;
  const isLoading =
    (isResolving ? isLoadingUser || isLoadingAll : false) || isLoadingEmployee;

  if (!employeeId && !username) {
    return (
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
        <p className="text-amber-700">
          Employee ID not found. Please login again.
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="bg-white border border-slate-200 rounded-lg p-6 text-center">
        <p className="text-slate-600">Loading profile...</p>
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
        <p className="text-amber-700">Profile data not found.</p>
      </div>
    );
  }

  const employeeCode = `EMP-${String(employee.id).padStart(4, "0")}`;
  const joinDate = employee.hireDate
    ? new Date(employee.hireDate).toLocaleDateString()
    : "N/A";
  const statusLabel = employee.status
    ? employee.status.charAt(0).toUpperCase() + employee.status.slice(1)
    : "Unknown";

  if (isError) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <p className="text-red-600">Error loading profile. Please try again.</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-6">
        My Profile
      </h1>

      <div className="max-w-full">
        {/* Profile Header */}
        <div className="bg-white border border-slate-200 rounded-lg p-8 mb-6 dark:bg-slate-800 dark:border-slate-700">
          <div className="flex items-start gap-6">
            <div className="w-24 h-24 rounded-full bg-linear-to-br from-blue-500 to-blue-700 flex items-center justify-center">
              {employee.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={employee.imageUrl}
                  alt={employee.fullName}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <span className="text-3xl font-bold text-white">
                  {employee.fullName?.charAt(0) || "U"}
                </span>
              )}
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                {employee.fullName}
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-400 mb-2">
                {employee.positionName}
              </p>
              <div className="mb-4 flex flex-wrap gap-2">
                <span className="inline-flex px-3 py-1 text-xs font-semibold rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                  {employee.employmentType}
                </span>
                <span className="inline-flex px-3 py-1 text-xs font-semibold rounded-full bg-green-50 text-green-700 border border-green-200">
                  {statusLabel}
                </span>
              </div>
              <div className="flex gap-4">
                <button className="bg-linear-to-r from-[#0C4A6E] to-[#075985] text-white px-4 py-2 rounded-lg font-medium hover:shadow-lg transition-all">
                  Edit Profile
                </button>
                <button className="bg-white border border-slate-300 text-slate-700 px-4 py-2 rounded-lg font-medium hover:bg-slate-50 transition dark:bg-slate-700 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-600">
                  Change Password
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Details */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Personal Information */}
          <div className="bg-white border border-slate-200 rounded-lg p-6 dark:bg-slate-800 dark:border-slate-700">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
              Personal Information
            </h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-slate-400 dark:text-slate-500" />
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Email
                  </p>
                  <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                    {employee.email}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-slate-400 dark:text-slate-500" />
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Username
                  </p>
                  <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                    {employee.username || "N/A"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <User className="h-5 w-5 text-slate-400 dark:text-slate-500" />
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Employee ID
                  </p>
                  <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                    {employeeCode}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Employment Information */}
          <div className="bg-white border border-slate-200 rounded-lg p-6 dark:bg-slate-800 dark:border-slate-700">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
              Employment Information
            </h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Building2 className="h-5 w-5 text-slate-400 dark:text-slate-500" />
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Department
                  </p>
                  <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                    {employee.departmentName}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Briefcase className="h-5 w-5 text-slate-400 dark:text-slate-500" />
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Position
                  </p>
                  <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                    {employee.positionName}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-slate-400 dark:text-slate-500" />
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Join Date
                  </p>
                  <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                    {joinDate}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Briefcase className="h-5 w-5 text-slate-400 dark:text-slate-500" />
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Salary
                  </p>
                  <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                    ${employee.salary.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Leave Balance */}
        <div className="bg-white border border-slate-200 rounded-lg p-6 mt-6 dark:bg-slate-800 dark:border-slate-700">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
            Leave Balance
          </h3>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="bg-blue-50 dark:bg-blue-900/30 rounded-lg p-4">
              <p className="text-sm text-blue-600 dark:text-blue-400">
                Annual Leave
              </p>
              <p className="text-2xl font-bold text-blue-900 dark:text-blue-200 mt-1">
                18 days
              </p>
            </div>
            <div className="bg-green-50 dark:bg-green-900/30 rounded-lg p-4">
              <p className="text-sm text-green-600 dark:text-green-400">
                Sick Leave
              </p>
              <p className="text-2xl font-bold text-green-900 dark:text-green-200 mt-1">
                10 days
              </p>
            </div>
            <div className="bg-purple-50 dark:bg-purple-900/30 rounded-lg p-4">
              <p className="text-sm text-purple-600 dark:text-purple-400">
                Personal Leave
              </p>
              <p className="text-2xl font-bold text-purple-900 dark:text-purple-200 mt-1">
                5 days
              </p>
            </div>
            <div className="bg-orange-50 dark:bg-orange-900/30 rounded-lg p-4">
              <p className="text-sm text-orange-600 dark:text-orange-400">
                Used
              </p>
              <p className="text-2xl font-bold text-orange-900 dark:text-orange-200 mt-1">
                7 days
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
