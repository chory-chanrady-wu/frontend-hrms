"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useGetPositionById, useUpdatePosition } from "@/hooks/position-query";
import { useGetAllDepartments } from "@/hooks/department-query";
import { themedSwal } from "@/components/ui/ThemedSwal";

export default function EditPositionPage() {
  const router = useRouter();
  const params = useParams();
  const positionId = Number(params.id);
  const { data: positionResponse, isLoading } = useGetPositionById(positionId);
  const { mutate: updatePosition, isPending } = useUpdatePosition();
  const { data: departmentsResponse } = useGetAllDepartments();

  const position = positionResponse?.data || positionResponse;
  const departments = Array.isArray(departmentsResponse)
    ? departmentsResponse
    : Array.isArray(departmentsResponse?.data)
      ? departmentsResponse.data
      : [];

  const [formData, setFormData] = useState({
    positionName: "",
    description: "",
    department: "",
    salary: "",
  });

  useEffect(() => {
    if (position) {
      setFormData({
        positionName: position.positionName || "",
        description: position.description || "",
        department: String(
          (position.departmentId ?? position.department) || "",
        ),
        salary: String(position.salary || ""),
      });
    }
  }, [position]);

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
    updatePosition(
      {
        id: positionId,
        posData: {
          positionName: formData.positionName,
          description: formData.description,
          department: Number(formData.department),
          salary: Number(formData.salary),
        },
      },
      {
        onSuccess: async () => {
          await themedSwal({
            title: "Success!",
            text: "Position updated successfully.",
            icon: "success",
            timer: 1500,
            showConfirmButton: false,
          });
          router.push("/dashboard/positions");
        },
        onError: async (err) => {
          await themedSwal({
            title: "Error",
            text: err?.message || "Failed to update position.",
            icon: "error",
          });
        },
      },
    );
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!position) {
    return <div>Position not found.</div>;
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-lg mx-auto mt-8 p-8 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700"
    >
      <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">
        Edit Position
      </h2>
      <div className="mb-6">
        <label className="block mb-1 font-medium text-slate-700 dark:text-slate-300">
          Position Name
        </label>
        <input
          type="text"
          name="positionName"
          value={formData.positionName}
          onChange={handleChange}
          className="w-full border border-slate-300 dark:border-slate-600 rounded px-3 py-2 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          required
        />
      </div>
      <div className="mb-6">
        <label className="block mb-1 font-medium text-slate-700 dark:text-slate-300">
          Description
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="w-full border border-slate-300 dark:border-slate-600 rounded px-3 py-2 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
        />
      </div>
      <div className="mb-6">
        <label className="block mb-1 font-medium text-slate-700 dark:text-slate-300">
          Department
        </label>
        <select
          name="department"
          value={formData.department}
          onChange={handleChange}
          className="w-full border border-slate-300 dark:border-slate-600 rounded px-3 py-2 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          required
        >
          <option value="">Select Department</option>
          {departments.map((dept: any) => (
            <option key={dept.id} value={dept.id}>
              {dept.name}
            </option>
          ))}
        </select>
      </div>
      <div className="mb-6">
        <label className="block mb-1 font-medium text-slate-700 dark:text-slate-300">
          Salary
        </label>
        <input
          type="number"
          name="salary"
          value={formData.salary}
          onChange={handleChange}
          className="w-full border border-slate-300 dark:border-slate-600 rounded px-3 py-2 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
        />
      </div>
      <div className="flex gap-3 mt-2">
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-all disabled:opacity-50"
          disabled={isPending}
        >
          {isPending ? "Saving..." : "Save Changes"}
        </button>
        <button
          type="button"
          className="bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-200 px-6 py-2 rounded-lg font-medium hover:bg-slate-300 dark:hover:bg-slate-600 transition-all border border-slate-300 dark:border-slate-600"
          onClick={() => router.push("/dashboard/positions")}
          disabled={isPending}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
