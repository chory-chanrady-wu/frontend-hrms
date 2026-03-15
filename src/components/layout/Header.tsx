"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Bell, LogOut, User, Sun, Moon, Monitor } from "lucide-react";
import { logout } from "@/lib/auth";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useGetUserByUsername } from "@/hooks/user-query";
import { useGetAllEmployees } from "@/hooks/employee-query";
import type { EmployeeProfile } from "@/lib/types";
import { useTheme } from "@/src/components/ThemeProvider";

export default function Header() {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { theme, setTheme } = useTheme();

  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("User");
  const [employeeId, setEmployeeId] = useState<number | null>(null);

  useEffect(() => {
    const storedUsername = localStorage.getItem("userId") || "";
    const storedFullName = localStorage.getItem("fullName") || "";
    setUsername(storedUsername);
    if (storedFullName) setDisplayName(storedFullName);

    const empId = Number(localStorage.getItem("employeeId"));
    if (!Number.isNaN(empId) && empId > 0) {
      setEmployeeId(empId);
    }
  }, []);

  // Resolve username → numeric user ID
  const { data: userResponse } = useGetUserByUsername(
    !employeeId ? username : "",
  );
  const { data: allEmployeesResponse } = useGetAllEmployees();

  // Find the employee record for the logged-in user
  const employees = (() => {
    const raw = allEmployeesResponse?.data ?? allEmployeesResponse;
    return Array.isArray(raw) ? (raw as EmployeeProfile[]) : [];
  })();

  const currentEmployee = (() => {
    if (employeeId) {
      return employees.find((e) => e.id === employeeId) ?? null;
    }
    const userData = userResponse?.data ?? userResponse;
    const numericUserId = userData?.id;
    if (numericUserId) {
      return employees.find((e) => e.userId === numericUserId) ?? null;
    }
    if (username) {
      return employees.find((e) => e.username === username) ?? null;
    }
    return null;
  })();

  const avatarName = currentEmployee?.fullName || displayName;
  const avatarRole =
    currentEmployee?.positionName || currentEmployee?.departmentName || "";
  const avatarImage = currentEmployee?.imageUrl || "";

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
  };

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/80 backdrop-blur dark:border-slate-700 dark:bg-slate-800/80">
      <div className="mx-auto flex w-full max-w-screen-2xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4 flex-1">
          <Input
            type="text"
            placeholder="Search employees, reports, approvals..."
            className="h-11 w-96 rounded-md border-gray-200 px-4 focus-visible:ring-2 focus-visible:ring-[#0C4A6E] focus-visible:ring-offset-0 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100"
          />
          <div className="flex items-center gap-4">
            {/* search button */}
            <Button className="px-8 py-2 bg-linear-to-b from-[#0369A1] to-[#0369A1] hover:from-[#0B5D8F] hover:to-[#0C4A6E] rounded-lg text-white transition-all duration-200 hover:shadow-lg">
              Search
            </Button>
          </div>
        </div>
        {/* Notifications */}
        <Button
          variant="ghost"
          size="icon"
          className="relative h-10 w-10 rounded-full mr-3"
        >
          <Bell className="h-6 w-6 text-slate-600 dark:text-slate-300" />
          <span className="absolute top-1 right-1 inline-flex h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
        </Button>
        {/* User Profile Section */}
        <div className="relative" ref={dropdownRef}>
          <Button
            variant="ghost"
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center gap-4 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg p-4 py-6 transition"
          >
            {avatarImage ? (
              <img
                src={avatarImage}
                alt="User Avatar"
                className="h-10 w-10 rounded-full object-cover"
              />
            ) : (
              <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-sm font-semibold text-blue-600">
                {avatarName
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()
                  .slice(0, 2)}
              </div>
            )}
            <div className="flex flex-col text-left">
              <span className="text-sm font-medium text-slate-900 dark:text-slate-100">
                {avatarName}
              </span>
              {avatarRole && (
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  {avatarRole}
                </span>
              )}
            </div>
          </Button>

          {/* Dropdown Menu */}
          {showDropdown && (
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 py-1 z-50">
              <Button
                variant="ghost"
                onClick={() => {
                  setShowDropdown(false);
                }}
                asChild
                className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-100 flex items-center gap-2"
              >
                <Link href="/dashboard/profile">
                  <User className="h-4 w-4" />
                  Profile
                </Link>
              </Button>
              <hr className="my-1 border-slate-200 dark:border-slate-700" />
              {/* Theme Switcher */}
              <div className="px-3 py-2">
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5">
                  Theme
                </p>
                <div className="flex gap-1">
                  <button
                    onClick={() => setTheme("light")}
                    className={`flex-1 flex items-center justify-center gap-1 px-2 py-1.5 rounded text-xs font-medium transition ${
                      theme === "light"
                        ? "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300"
                        : "text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-700"
                    }`}
                  >
                    <Sun className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => setTheme("dark")}
                    className={`flex-1 flex items-center justify-center gap-1 px-2 py-1.5 rounded text-xs font-medium transition ${
                      theme === "dark"
                        ? "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300"
                        : "text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-700"
                    }`}
                  >
                    <Moon className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => setTheme("system")}
                    className={`flex-1 flex items-center justify-center gap-1 px-2 py-1.5 rounded text-xs font-medium transition ${
                      theme === "system"
                        ? "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300"
                        : "text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-700"
                    }`}
                  >
                    <Monitor className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
              <hr className="my-1 border-slate-200 dark:border-slate-700" />
              <Button
                variant="ghost"
                onClick={handleLogout}
                className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
