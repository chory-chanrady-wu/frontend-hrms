"use client";
import Swal from "sweetalert2";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2, Upload } from "lucide-react";
import Link from "next/link";
import { useCreateEmployee } from "@/hooks/employee-query";
import { useGetAllDepartments } from "@/hooks/department-query";
import { useGetAllPositions } from "@/hooks/position-query";
import { useQueryClient } from "@tanstack/react-query";

export default function AddEmployeePage() {
  const router = useRouter();
  const { mutate: createEmployee, isPending } = useCreateEmployee();
  const { data: deptResponse } = useGetAllDepartments();
  const { data: positionsResponse } = useGetAllPositions();
  const queryClient = useQueryClient();

  const departments = Array.isArray(deptResponse)
    ? deptResponse
    : Array.isArray(deptResponse?.data)
      ? deptResponse.data
      : [];

  const positions = Array.isArray(positionsResponse)
    ? positionsResponse
    : Array.isArray(positionsResponse?.data)
      ? positionsResponse.data
      : [];

  const [formData, setFormData] = useState({
    username: "",
    fullName: "",
    email: "",
    password: "",
    phoneNumber: "",
    departmentId: "",
    positionId: "",
    employmentType: "Full-time",
    salary: "",
    hireDate: "",
    dateOfBirth: "",
    nationality: "",
    address: "",
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const fd = new FormData();
    fd.append("username", formData.username);
    fd.append("fullName", formData.fullName);
    fd.append("email", formData.email);
    fd.append("password", formData.password);
    fd.append("departmentId", formData.departmentId);
    fd.append("positionId", formData.positionId);
    fd.append("employmentType", formData.employmentType);
    fd.append("salary", formData.salary);
    fd.append("hireDate", formData.hireDate);
    if (formData.phoneNumber) fd.append("phoneNumber", formData.phoneNumber);
    if (formData.dateOfBirth) fd.append("dateOfBirth", formData.dateOfBirth);
    if (formData.nationality) fd.append("nationality", formData.nationality);
    if (formData.address) fd.append("address", formData.address);
    if (imageFile) fd.append("image", imageFile);

    createEmployee(fd, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["users"] });
        const isDark =
          typeof window !== "undefined" &&
          document.documentElement.classList.contains("dark");
        Swal.fire({
          title: "Success!",
          text: "Employee created successfully.",
          icon: "success",
          background: isDark ? "#1e293b" : "#fff",
          color: isDark ? "#f1f5f9" : "#1e293b",
          customClass: {
            popup: isDark ? "swal2-dark" : "",
          },
        }).then(() => {
          router.push("/dashboard/employees");
          router.refresh();
        });
      },
      onError: (err) =>
        Swal.fire({
          title: "Error",
          text: "Failed to create: " + (err as Error).message,
          icon: "error",
          background:
            typeof window !== "undefined" &&
            document.documentElement.classList.contains("dark")
              ? "#1e293b"
              : "#fff",
          color:
            typeof window !== "undefined" &&
            document.documentElement.classList.contains("dark")
              ? "#f1f5f9"
              : "#1e293b",
          customClass: {
            popup:
              typeof window !== "undefined" &&
              document.documentElement.classList.contains("dark")
                ? "swal2-dark"
                : "",
          },
        }),
    });
  };
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
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;
    // If department changes, reset positionId
    if (name === "departmentId") {
      setFormData({
        ...formData,
        departmentId: value,
        positionId: "",
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <Link
          href="/dashboard/employees"
          className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition"
        >
          <ArrowLeft className="h-5 w-5 text-slate-600 dark:text-slate-400" />
        </Link>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
          Add New Employee
        </h1>
      </div>

      <div className="w-full">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Account Information */}
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
              Account Information
            </h2>
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Username *
                </label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  placeholder="e.g. john.doe"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  placeholder="e.g. john.doe@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Password *
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  placeholder="Enter password"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Phone Number
                </label>
                <input
                  type="text"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  placeholder="e.g. 010346085"
                />
              </div>
            </div>
          </div>

          {/* Employment Information */}
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
              Employment Information
            </h2>
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Department *
                </label>
                <select
                  name="departmentId"
                  value={formData.departmentId}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                >
                  <option value="">Select Department</option>
                  {departments.map((dept: any) => (
                    <option key={dept.id} value={dept.id}>
                      {dept.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Position *
                </label>
                <select
                  name="positionId"
                  value={formData.positionId}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                >
                  <option value="">Select Position</option>
                  {formData.departmentId &&
                    positions
                      .filter(
                        (pos: any) =>
                          String(pos.departmentId) ===
                          String(formData.departmentId),
                      )
                      .map((pos: any) => (
                        <option key={pos.id} value={pos.id}>
                          {pos.positionName || pos.name}
                        </option>
                      ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Employment Type *
                </label>
                <select
                  name="employmentType"
                  value={formData.employmentType}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                >
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Contract">Contract</option>
                  <option value="Intern">Intern</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Salary *
                </label>
                <input
                  type="number"
                  name="salary"
                  value={formData.salary}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  placeholder="0.00"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Hire Date *
                </label>
                <input
                  type="date"
                  name="hireDate"
                  value={formData.hireDate}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>
            </div>
          </div>

          {/* Personal Information */}
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
              Personal Information
            </h2>
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Date of Birth
                </label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Nationality
                </label>
                <input
                  type="text"
                  name="nationality"
                  value={formData.nationality}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  placeholder="e.g. Khmer"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Address
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  rows={2}
                  className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
                  placeholder="e.g. Phnom Penh"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Profile Image
                </label>
                <div className="flex items-center gap-4">
                  {imagePreview && (
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-16 h-16 rounded-full object-cover border-2 border-slate-200 dark:border-slate-600"
                    />
                  )}
                  <label className="flex items-center gap-2 px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-600 transition cursor-pointer">
                    <Upload className="h-4 w-4" />
                    {imageFile ? imageFile.name : "Choose Image"}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={isPending}
              className="bg-linear-to-r from-[#0C4A6E] to-[#075985] text-white px-6 py-2 rounded-lg font-medium hover:shadow-lg transition-all disabled:opacity-50 flex items-center gap-2"
            >
              {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
              Create Employee
            </button>
            <Link
              href="/dashboard/employees"
              className="bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 px-6 py-2 rounded-lg font-medium hover:bg-slate-50 dark:hover:bg-slate-600 transition"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
