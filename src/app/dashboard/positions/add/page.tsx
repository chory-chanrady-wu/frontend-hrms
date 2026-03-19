"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCreatePosition } from "@/hooks/position-query";
import { useGetAllDepartments } from "@/hooks/department-query";
import Swal from "sweetalert2";

export default function AddPositionPage() {
  const router = useRouter();
  const { mutate: createPosition, isPending } = useCreatePosition();
  const [formData, setFormData] = useState({
    positionName: "",
    description: "",
    departmentId: "",
    headOfDepartmentId: "",
    headOfDepartmentName: "",
  });

  const { data: departmentsResponse, isLoading: isDepartmentsLoading } =
    useGetAllDepartments();
  const departments = Array.isArray(departmentsResponse)
    ? departmentsResponse
    : Array.isArray(departmentsResponse?.data)
      ? departmentsResponse.data
      : [];

  // Collect all possible heads of department from departments
  const heads = departments
    .filter((dept: any) => dept.headOfDepartmentId && dept.headOfDepartmentName)
    .map((dept: any) => ({
      id: dept.headOfDepartmentId,
      name: dept.headOfDepartmentName,
    }));

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      positionName: formData.positionName,
      description: formData.description,
      departmentId: Number(formData.departmentId),
      headOfDepartmentId: formData.headOfDepartmentId
        ? Number(formData.headOfDepartmentId)
        : undefined,
      headOfDepartmentName: formData.headOfDepartmentName || undefined,
    };
    console.log("Submitting position payload:", payload);
    createPosition(
      payload as any, // Cast to any to bypass type error until mutation type is updated
      {
        onSuccess: () => {
          const isDark =
            typeof window !== "undefined" &&
            (document.documentElement.classList.contains("dark") ||
              window.matchMedia("(prefers-color-scheme: dark)").matches);
          Swal.fire({
            title: "Success!",
            text: "Position created successfully.",
            icon: "success",
            background: isDark ? "#1e293b" : "#fff",
            color: isDark ? "#f1f5f9" : "#1e293b",
            customClass: {
              popup: isDark ? "swal2-dark" : "",
            },
          }).then(() => {
            router.push("/dashboard/positions");
          });
        },
        onError: (err) => {
          console.error("Failed to create position:", err);
          const isDark =
            typeof window !== "undefined" &&
            (document.documentElement.classList.contains("dark") ||
              window.matchMedia("(prefers-color-scheme: dark)").matches);
          Swal.fire({
            title: "Error",
            text: "Failed to create position.",
            icon: "error",
            background: isDark ? "#1e293b" : "#fff",
            color: isDark ? "#f1f5f9" : "#1e293b",
            customClass: {
              popup: isDark ? "swal2-dark" : "",
            },
          });
        },
      },
    );
  };

  return (
    <div className="max-w-xl mx-auto mt-8">
      <h1 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">
        Add New Position
      </h1>
      <form
        onSubmit={handleSubmit}
        className="space-y-6 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-6"
      >
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Position Name *
          </label>
          <input
            type="text"
            name="positionName"
            value={formData.positionName}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            placeholder="e.g. Developer Team Leader"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            placeholder="Describe the position's responsibilities"
          />
        </div>
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
            <option value="" disabled>
              {isDepartmentsLoading ? "Loading..." : "Select department"}
            </option>
            {departments.map((dept: { id: number; name: string }) => (
              <option key={dept.id} value={dept.id}>
                {dept.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Line Manager (Head of Department)
          </label>
          <select
            name="headOfDepartmentId"
            value={formData.headOfDepartmentId}
            onChange={(e) => {
              const selected = heads.find(
                (h: { id: number; name: string }) =>
                  String(h.id) === e.target.value,
              );
              setFormData({
                ...formData,
                headOfDepartmentId: e.target.value,
                headOfDepartmentName: selected ? selected.name : "",
              });
            }}
            className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          >
            <option value="">Select line manager</option>
            {heads.map((h: { id: number; name: string }) => (
              <option key={h.id} value={h.id}>
                {h.name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex gap-3 mt-6">
          <button
            type="submit"
            disabled={isPending}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-all disabled:opacity-50"
          >
            {isPending ? "Creating..." : "Create Position"}
          </button>
          <button
            type="button"
            onClick={() => router.push("/dashboard/positions")}
            className="bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-200 px-6 py-2 rounded-lg font-medium hover:bg-slate-300 dark:hover:bg-slate-600 transition-all"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
