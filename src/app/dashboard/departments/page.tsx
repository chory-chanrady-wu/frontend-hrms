"use client";

import { Building2, Users, Edit, Trash2 } from "lucide-react";
import Link from "next/link";

const departments = [
  {
    id: 1,
    name: "Engineering",
    manager: "John Doe",
    employees: 45,
    description: "Software development and IT infrastructure",
  },
  {
    id: 2,
    name: "Marketing",
    manager: "Jane Smith",
    employees: 23,
    description: "Brand management and digital marketing",
  },
  {
    id: 3,
    name: "Sales",
    manager: "Mike Johnson",
    employees: 32,
    description: "Business development and client relations",
  },
  {
    id: 4,
    name: "Human Resources",
    manager: "Sarah Williams",
    employees: 12,
    description: "Employee relations and talent management",
  },
  {
    id: 5,
    name: "Finance",
    manager: "David Brown",
    employees: 18,
    description: "Financial planning and accounting",
  },
];

export default function DepartmentsPage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Departments</h1>
        <Link
          href="/dashboard/departments/add"
          className="bg-gradient-to-r from-[#0C4A6E] to-[#075985] text-white px-4 py-2 rounded-lg font-medium hover:shadow-lg transition-all"
        >
          Add Department
        </Link>
      </div>

      {/* Summary */}
      <div className="grid gap-6 md:grid-cols-3 mb-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <p className="text-sm font-medium text-blue-600">Total Departments</p>
          <p className="text-3xl font-bold text-blue-900 mt-2">
            {departments.length}
          </p>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <p className="text-sm font-medium text-green-600">Total Employees</p>
          <p className="text-3xl font-bold text-green-900 mt-2">
            {departments.reduce((sum, dept) => sum + dept.employees, 0)}
          </p>
        </div>
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
          <p className="text-sm font-medium text-purple-600">Avg per Dept</p>
          <p className="text-3xl font-bold text-purple-900 mt-2">
            {Math.round(
              departments.reduce((sum, dept) => sum + dept.employees, 0) /
                departments.length,
            )}
          </p>
        </div>
      </div>

      {/* Departments Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {departments.map((dept) => (
          <div
            key={dept.id}
            className="bg-white border border-slate-200 rounded-lg p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Building2 className="h-6 w-6 text-blue-600" />
              </div>
              <div className="flex gap-2">
                <Link
                  href={`/dashboard/departments/${dept.id}/edit`}
                  className="p-2 text-slate-400 hover:text-blue-600 transition"
                >
                  <Edit className="h-4 w-4" />
                </Link>
                <button className="p-2 text-slate-400 hover:text-red-600 transition">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              {dept.name}
            </h3>
            <p className="text-sm text-slate-600 mb-4">{dept.description}</p>
            <div className="pt-4 border-t border-slate-200">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600">Manager:</span>
                <span className="font-medium text-slate-900">
                  {dept.manager}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm mt-2">
                <span className="text-slate-600">Employees:</span>
                <span className="flex items-center gap-1 font-medium text-slate-900">
                  <Users className="h-4 w-4" />
                  {dept.employees}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
