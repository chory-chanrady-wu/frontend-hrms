"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Bell, LogOut, User } from "lucide-react";
import { logout } from "@/lib/auth";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";

export default function Header() {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex w-full max-w-screen-2xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4 flex-1">
          <Input
            type="text"
            placeholder="Search employees, reports, approvals..."
            className="h-11 w-96 rounded-md border-gray-200 px-4 focus-visible:ring-2 focus-visible:ring-[#0C4A6E] focus-visible:ring-offset-0"
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
          <Bell className="h-6 w-6 text-slate-600" />
          <span className="absolute top-1 right-1 inline-flex h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
        </Button>
        {/* User Profile Section */}
        <div className="relative" ref={dropdownRef}>
          <Button
            variant="ghost"
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center gap-4 hover:bg-slate-100 rounded-lg p-2 transition"
          >
            <img
              src="../assets/image.png"
              alt="User Avatar"
              className="h-10 w-10 rounded-full object-cover"
            />
            <div className="flex flex-col text-left">
              <span className="text-sm font-medium text-slate-900">Admin</span>
              <span className="text-xs text-slate-500">Administrator</span>
            </div>
          </Button>

          {/* Dropdown Menu */}
          {showDropdown && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-slate-200 py-1 z-50">
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
              <hr className="my-1 border-slate-200" />
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
