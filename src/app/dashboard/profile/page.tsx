"use client";

import {
  User,
  Mail,
  Phone,
  Calendar,
  Building2,
  Briefcase,
} from "lucide-react";

const profile = {
  name: "CHORY Chanrady",
  email: "chory.chanrady@company.com",
  phone: "+855 12 345 678",
  department: "Engineering",
  position: "Senior Developer",
  employeeId: "EMP-2024-001",
  joinDate: "2024-01-15",
  address: "Phnom Penh, Cambodia",
};

export default function ProfilePage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 mb-6">My Profile</h1>

      <div className="max-w-4xl">
        {/* Profile Header */}
        <div className="bg-white border border-slate-200 rounded-lg p-8 mb-6">
          <div className="flex items-start gap-6">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center">
              <span className="text-3xl font-bold text-white">
                {profile.name.charAt(0)}
              </span>
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-slate-900 mb-2">
                {profile.name}
              </h2>
              <p className="text-lg text-slate-600 mb-4">{profile.position}</p>
              <div className="flex gap-4">
                <button className="bg-gradient-to-r from-[#0C4A6E] to-[#075985] text-white px-4 py-2 rounded-lg font-medium hover:shadow-lg transition-all">
                  Edit Profile
                </button>
                <button className="bg-white border border-slate-300 text-slate-700 px-4 py-2 rounded-lg font-medium hover:bg-slate-50 transition">
                  Change Password
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Details */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Personal Information */}
          <div className="bg-white border border-slate-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">
              Personal Information
            </h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-slate-400" />
                <div>
                  <p className="text-xs text-slate-500">Email</p>
                  <p className="text-sm font-medium text-slate-900">
                    {profile.email}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-slate-400" />
                <div>
                  <p className="text-xs text-slate-500">Phone</p>
                  <p className="text-sm font-medium text-slate-900">
                    {profile.phone}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <User className="h-5 w-5 text-slate-400" />
                <div>
                  <p className="text-xs text-slate-500">Employee ID</p>
                  <p className="text-sm font-medium text-slate-900">
                    {profile.employeeId}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Employment Information */}
          <div className="bg-white border border-slate-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">
              Employment Information
            </h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Building2 className="h-5 w-5 text-slate-400" />
                <div>
                  <p className="text-xs text-slate-500">Department</p>
                  <p className="text-sm font-medium text-slate-900">
                    {profile.department}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Briefcase className="h-5 w-5 text-slate-400" />
                <div>
                  <p className="text-xs text-slate-500">Position</p>
                  <p className="text-sm font-medium text-slate-900">
                    {profile.position}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-slate-400" />
                <div>
                  <p className="text-xs text-slate-500">Join Date</p>
                  <p className="text-sm font-medium text-slate-900">
                    {new Date(profile.joinDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Leave Balance */}
        <div className="bg-white border border-slate-200 rounded-lg p-6 mt-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">
            Leave Balance
          </h3>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="bg-blue-50 rounded-lg p-4">
              <p className="text-sm text-blue-600">Annual Leave</p>
              <p className="text-2xl font-bold text-blue-900 mt-1">18 days</p>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <p className="text-sm text-green-600">Sick Leave</p>
              <p className="text-2xl font-bold text-green-900 mt-1">10 days</p>
            </div>
            <div className="bg-purple-50 rounded-lg p-4">
              <p className="text-sm text-purple-600">Personal Leave</p>
              <p className="text-2xl font-bold text-purple-900 mt-1">5 days</p>
            </div>
            <div className="bg-orange-50 rounded-lg p-4">
              <p className="text-sm text-orange-600">Used</p>
              <p className="text-2xl font-bold text-orange-900 mt-1">7 days</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
