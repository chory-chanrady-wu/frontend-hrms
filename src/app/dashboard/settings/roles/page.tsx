"use client";

import { Shield, Edit, Trash2 } from "lucide-react";
import Link from "next/link";

const roles = [
  {
    id: 1,
    name: "Administrator",
    description: "Full system access with all permissions",
    users: 3,
    color: "red",
  },
  {
    id: 2,
    name: "HR Manager",
    description: "Manage employees, payroll, and leave",
    users: 5,
    color: "blue",
  },
  {
    id: 3,
    name: "Department Manager",
    description: "Manage department staff and operations",
    users: 12,
    color: "green",
  },
  {
    id: 4,
    name: "Employee",
    description: "Basic access to personal information",
    users: 228,
    color: "slate",
  },
];

export default function RolesPage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-900">
          Roles & Permissions
        </h1>
        <Link
          href="/dashboard/settings/roles/add"
          className="bg-gradient-to-r from-[#0C4A6E] to-[#075985] text-white px-4 py-2 rounded-lg font-medium hover:shadow-lg transition-all"
        >
          Add Role
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {roles.map((role) => (
          <div
            key={role.id}
            className="bg-white border border-slate-200 rounded-lg p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`p-3 bg-${role.color}-100 rounded-lg`}>
                  <Shield className={`h-6 w-6 text-${role.color}-600`} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">
                    {role.name}
                  </h3>
                  <p className="text-sm text-slate-600">{role.users} users</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Link
                  href={`/dashboard/settings/roles/${role.id}/edit`}
                  className="p-2 text-slate-400 hover:text-blue-600 transition"
                >
                  <Edit className="h-4 w-4" />
                </Link>
                <button className="p-2 text-slate-400 hover:text-red-600 transition">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
            <p className="text-sm text-slate-600">{role.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
