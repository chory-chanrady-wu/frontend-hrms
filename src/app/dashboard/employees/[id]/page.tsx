"use client";

import { useParams, useRouter } from "next/navigation";
import { useGetEmployeeById, useDeleteEmployee } from "@/hooks/employee-query";
import {
  ArrowLeft,
  Mail,
  Phone,
  Briefcase,
  Building2,
  Calendar,
  Loader2,
  Pencil,
  Trash2,
  User,
  Shield,
  AtSign,
  MapPin,
  Globe,
  Cake,
} from "lucide-react";
import Link from "next/link";

export default function EmployeeDetailPage() {
  const params = useParams();
  const router = useRouter();
  const employeeId = Number(params.id);
  const { data: employee, isLoading, isError } = useGetEmployeeById(employeeId);
  const { mutate: deleteEmployee, isPending: isDeleting } = useDeleteEmployee();

  const handleDelete = () => {
    if (!confirm("Are you sure you want to delete this employee?")) return;
    deleteEmployee(employeeId, {
      onSuccess: () => router.push("/dashboard/employees"),
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (isError || !employee) {
    return (
      <div className="text-center py-16">
        <p className="text-slate-500 dark:text-slate-400">
          Employee not found.
        </p>
        <Link
          href="/dashboard/employees"
          className="text-blue-600 hover:underline mt-2 inline-block"
        >
          Back to Employees
        </Link>
      </div>
    );
  }

  const emp: any = employee?.data ?? employee;

  const statusColor =
    emp.status === true
      ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
      : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard/employees"
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition"
          >
            <ArrowLeft className="h-5 w-5 text-slate-600 dark:text-slate-400" />
          </Link>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            Employee Details
          </h1>
        </div>
        <div className="flex gap-2">
          <Link
            href={`/dashboard/employees/${employeeId}/edit`}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition text-sm font-medium"
          >
            <Pencil className="h-4 w-4" /> Edit
          </Link>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition text-sm font-medium disabled:opacity-50"
          >
            {isDeleting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Trash2 className="h-4 w-4" />
            )}
            Delete
          </button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Profile Card */}
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-6 text-center">
          {emp.imageUrl ? (
            <img
              src={emp.imageUrl}
              alt={emp.fullName || emp.username}
              className="w-24 h-24 rounded-full mx-auto mb-4 object-cover border-4 border-slate-100 dark:border-slate-600"
            />
          ) : (
            <div className="w-24 h-24 rounded-full mx-auto mb-4 bg-slate-200 dark:bg-slate-600 flex items-center justify-center">
              <User className="h-10 w-10 text-slate-400 dark:text-slate-300" />
            </div>
          )}
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
            {emp.fullName || emp.username || "N/A"}
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            @{emp.username}
          </p>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            {emp.positionName || "—"}
          </p>
          <div className="flex justify-center gap-2 mt-3">
            <span
              className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${statusColor}`}
            >
              {emp.status === true ? "Active" : "Inactive"}
            </span>
            <span
              className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                emp.userStatus === "true"
                  ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                  : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
              }`}
            >
              User: {emp.userStatus === "true" ? "Active" : "Inactive"}
            </span>
          </div>

          {/* Personal Info */}
          <div className="mt-6 space-y-3 text-left border-t border-slate-200 dark:border-slate-700 pt-4">
            <div className="flex items-center gap-3 text-sm">
              <Mail className="h-4 w-4 text-slate-400" />
              <span className="text-slate-700 dark:text-slate-300">
                {emp.email || "—"}
              </span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Phone className="h-4 w-4 text-slate-400" />
              <span className="text-slate-700 dark:text-slate-300">
                {emp.phoneNumber || "—"}
              </span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Cake className="h-4 w-4 text-slate-400" />
              <span className="text-slate-700 dark:text-slate-300">
                {emp.dateOfBirth
                  ? new Date(emp.dateOfBirth).toLocaleDateString()
                  : "—"}
              </span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Globe className="h-4 w-4 text-slate-400" />
              <span className="text-slate-700 dark:text-slate-300">
                {emp.nationality || "—"}
              </span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <MapPin className="h-4 w-4 text-slate-400" />
              <span className="text-slate-700 dark:text-slate-300">
                {emp.address || "—"}
              </span>
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
              Employment Information
            </h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <InfoRow
                icon={<Mail className="h-4 w-4" />}
                label="Email"
                value={emp.email || "—"}
              />
              <InfoRow
                icon={<Phone className="h-4 w-4" />}
                label="Phone Number"
                value={emp.phoneNumber || "—"}
              />
              <InfoRow
                icon={<Building2 className="h-4 w-4" />}
                label="Department"
                value={emp.departmentName || "—"}
              />
              <InfoRow
                icon={<Briefcase className="h-4 w-4" />}
                label="Position"
                value={emp.positionName || "—"}
              />
              <InfoRow
                icon={<Briefcase className="h-4 w-4" />}
                label="Employment Type"
                value={emp.employmentType || "—"}
              />
              <InfoRow
                icon={<Calendar className="h-4 w-4" />}
                label="Hire Date"
                value={
                  emp.hireDate
                    ? new Date(emp.hireDate).toLocaleDateString()
                    : "—"
                }
              />
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
              System Information
            </h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <InfoRow
                icon={<User className="h-4 w-4" />}
                label="Employee ID"
                value={`EMP-${emp.id}`}
              />
              <InfoRow
                icon={<User className="h-4 w-4" />}
                label="User ID"
                value={String(emp.userId)}
              />
              <InfoRow
                icon={<AtSign className="h-4 w-4" />}
                label="Username"
                value={emp.username || "—"}
              />
              <InfoRow
                icon={<Shield className="h-4 w-4" />}
                label="User Status"
                value={emp.userStatus === "true" ? "Active" : "Inactive"}
              />
              <InfoRow
                icon={<Calendar className="h-4 w-4" />}
                label="Created"
                value={
                  emp.createdAt
                    ? new Date(emp.createdAt).toLocaleDateString()
                    : "—"
                }
              />
              <InfoRow
                icon={<Calendar className="h-4 w-4" />}
                label="Updated"
                value={
                  emp.updatedAt
                    ? new Date(emp.updatedAt).toLocaleDateString()
                    : "—"
                }
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="text-slate-400 dark:text-slate-500 mt-0.5">{icon}</div>
      <div>
        <p className="text-xs text-slate-500 dark:text-slate-400">{label}</p>
        <p className="text-sm font-medium text-slate-900 dark:text-slate-100 capitalize">
          {value}
        </p>
      </div>
    </div>
  );
}
