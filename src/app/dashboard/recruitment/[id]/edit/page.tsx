"use client";

import { useEffect, useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { jobPostingsApi } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { themedSwal } from "@/components/ui/ThemedSwal";
import Link from "next/link";
import Select, { SingleValue, StylesConfig } from "react-select";
// Custom styles for react-select to match Tailwind dark/light mode
const selectStyles: StylesConfig<
  { value: string | number; label: string },
  false
> = {
  control: (provided, state) => ({
    ...provided,
    backgroundColor:
      typeof window !== "undefined" &&
      document.documentElement.classList.contains("dark")
        ? "#1e293b"
        : "#fff",
    borderColor: state.isFocused ? "#0C4A6E" : "#cbd5e1",
    color:
      typeof window !== "undefined" &&
      document.documentElement.classList.contains("dark")
        ? "#f1f5f9"
        : "#0f172a",
    boxShadow: state.isFocused ? "0 0 0 2px #0C4A6E" : "none",
  }),
  menu: (provided) => ({
    ...provided,
    backgroundColor:
      typeof window !== "undefined" &&
      document.documentElement.classList.contains("dark")
        ? "#1e293b"
        : "#fff",
    color:
      typeof window !== "undefined" &&
      document.documentElement.classList.contains("dark")
        ? "#f1f5f9"
        : "#0f172a",
    border: "1px solid #334155",
  }),
  option: (provided, state) => {
    const isDark =
      typeof window !== "undefined" &&
      document.documentElement.classList.contains("dark");
    return {
      ...provided,
      backgroundColor: state.isSelected
        ? isDark
          ? "#0C4A6E"
          : "#bae6fd"
        : state.isFocused
          ? isDark
            ? "#334155"
            : "#e0e7ef"
          : isDark
            ? "#1e293b"
            : "#fff",
      color: isDark ? "#f1f5f9" : "#0f172a",
      cursor: "pointer",
    };
  },
  singleValue: (provided) => ({
    ...provided,
    color:
      typeof window !== "undefined" &&
      document.documentElement.classList.contains("dark")
        ? "#f1f5f9"
        : "#0f172a",
  }),
  input: (provided) => ({
    ...provided,
    color:
      typeof window !== "undefined" &&
      document.documentElement.classList.contains("dark")
        ? "#f1f5f9"
        : "#0f172a",
  }),
};
import { useGetAllDepartments } from "@/hooks/department-query";
import { useGetAllUsers } from "@/hooks/user-query";

export default function EditJobPostingPage() {
  const { id } = useParams();
  const router = useRouter();
  const [form, setForm] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const { data: departments = [], isLoading: deptLoading } =
    useGetAllDepartments();
  const { data: users = [], isLoading: userLoading } = useGetAllUsers();

  // Memoized select options for performance
  const departmentOptions = useMemo(
    () =>
      departments.map((dept: any) => ({
        value: dept.id || dept.departmentId,
        label: dept.name,
      })),
    [departments],
  );
  const userOptions = useMemo(
    () =>
      users.map((user: any) => ({
        value: user.id || user.userId,
        label: user.fullName || user.username,
      })),
    [users],
  );
  const employmentTypeOptions = useMemo(
    () => [
      { value: "Full-Time", label: "Full-Time" },
      { value: "Part-Time", label: "Part-Time" },
      { value: "Contract", label: "Contract" },
      { value: "Internship", label: "Internship" },
      { value: "Temporary", label: "Temporary" },
    ],
    [],
  );

  useEffect(() => {
    if (!id) {
      setLoading(false);
      setError("Job not found.");
      return;
    }
    async function fetchJob() {
      setLoading(true);
      setError("");
      try {
        const data = await jobPostingsApi.getJobPostingById(String(id));
        setForm({
          ...data,
          jobTitle: data.title ?? data.jobTitle ?? "",
          jobDescription: data.description ?? data.jobDescription ?? "",
        });
      } catch (err) {
        setError("Failed to load job posting.");
      } finally {
        setLoading(false);
      }
    }
    fetchJob();
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value, type } = e.target;
    let newValue: string | boolean = value;
    if (type === "checkbox") {
      newValue = (e.target as HTMLInputElement).checked;
    }
    setForm((prev: any) => ({ ...prev, [name]: newValue }));
  };

  const handleSelectChange = (
    name: string,
    option: SingleValue<{ value: string | number; label: string }>,
  ) => {
    setForm((prev: any) => ({ ...prev, [name]: option ? option.value : "" }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      // Map form fields to API fields (match backend contract)
      const payload = {
        jobId: form.jobId || id, // fallback to id if jobId missing
        jobTitle: form.jobTitle,
        departmentId: Number(form.departmentId),
        hiringManagerId: Number(form.hiringManagerId),
        jobDescription: form.jobDescription,
        responsibilities: form.responsibilities,
        requirements: form.requirements,
        employmentType: form.employmentType,
        location: form.location,
        remoteOption: !!form.remoteOption,
        salary: String(form.salary),
        vacancies: Number(form.vacancies),
        postingDate: form.postingDate,
        closingDate: form.closingDate,
        jobStatus: form.jobStatus,
        createdBy: form.createdBy,
        createdAt:
          form.createdAt && form.createdAt !== ""
            ? form.createdAt
            : new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      await jobPostingsApi.updateJobPosting(String(id), payload);
      await themedSwal({
        icon: "success",
        title: "Job posting updated successfully!",
        showConfirmButton: true,
      });
      router.push(`/dashboard/recruitment/${id}`);
    } catch (err) {
      await themedSwal({
        icon: "error",
        title: "Failed to update job posting",
        text: (err as Error).message || "An error occurred.",
        showConfirmButton: true,
      });
      setError("Failed to update job posting.");
    } finally {
      setSaving(false);
    }
  };

  // Only block UI for job data, not for users/departments
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-slate-500">
        Loading job posting...
      </div>
    );
  }
  if (error) {
    return (
      <div className="flex items-center justify-center h-64 text-red-500">
        {error}
      </div>
    );
  }
  if (!form) {
    return (
      <div className="flex items-center justify-center h-64 text-slate-500">
        Job posting not found.
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto mt-10 bg-white dark:bg-slate-800 rounded-xl shadow-lg p-8 border border-slate-200 dark:border-slate-700">
      <h1 className="text-2xl font-bold mb-6 text-slate-900 dark:text-white text-center">
        Edit Job Posting
      </h1>
      <form onSubmit={handleSubmit} className="grid grid-cols-4 gap-6">
        {/* Job Title */}
        <div className="col-span-1">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-100">
            Job Title *
          </label>
          <input
            name="jobTitle"
            value={form.jobTitle || ""}
            onChange={handleChange}
            className="border p-2 rounded-lg w-full text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-900"
            required
          />
        </div>
        {/* Department */}
        <div className="col-span-1">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-100">
            Department *
          </label>
          <Select
            name="departmentId"
            inputId="departmentId"
            options={departmentOptions}
            value={
              departmentOptions.find(
                (opt: { value: string | number; label: string }) =>
                  opt.value === form.departmentId,
              ) || null
            }
            onChange={(option) => handleSelectChange("departmentId", option)}
            isLoading={deptLoading}
            isDisabled={deptLoading}
            placeholder="Select Department"
            classNamePrefix="react-select"
            styles={selectStyles}
          />
        </div>
        {/* Employment Type */}
        <div className="col-span-1">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-100">
            Employment Type *
          </label>
          <Select
            name="employmentType"
            inputId="employmentType"
            options={employmentTypeOptions}
            value={
              employmentTypeOptions.find(
                (opt) => opt.value === form.employmentType,
              ) || null
            }
            onChange={(option) => handleSelectChange("employmentType", option)}
            placeholder="Select Employment Type"
            classNamePrefix="react-select"
            styles={selectStyles}
          />
        </div>
        {/* Hiring Manager */}
        <div className="col-span-1">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-100">
            Hiring Manager *
          </label>
          <Select
            name="hiringManagerId"
            inputId="hiringManagerId"
            options={userOptions}
            value={
              userOptions.find(
                (opt: { value: string | number; label: string }) =>
                  opt.value === form.hiringManagerId,
              ) || null
            }
            onChange={(option) => handleSelectChange("hiringManagerId", option)}
            isLoading={userLoading}
            isDisabled={userLoading}
            placeholder="Select Hiring Manager"
            classNamePrefix="react-select"
            styles={selectStyles}
          />
        </div>
        {/* Vacancies */}
        <div className="col-span-1">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-100">
            Vacancies *
          </label>
          <input
            name="vacancies"
            type="number"
            min={1}
            value={form.vacancies || 1}
            onChange={handleChange}
            className="border p-2 rounded-lg w-full text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-900"
            required
          />
        </div>
        {/* Posting Date */}
        <div className="col-span-1">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-100">
            Posting Date *
          </label>
          <input
            name="postingDate"
            type="date"
            value={form.postingDate || ""}
            onChange={handleChange}
            className="border p-2 rounded-lg w-full text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-900"
            required
          />
        </div>
        {/* Closing Date */}
        <div className="col-span-1">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-100">
            Closing Date *
          </label>
          <input
            name="closingDate"
            type="date"
            value={form.closingDate || ""}
            onChange={handleChange}
            className="border p-2 rounded-lg w-full text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-900"
            required
          />
        </div>
        {/* Salary */}
        <div className="col-span-1">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-100">
            Salary *
          </label>
          <input
            name="salary"
            value={form.salary || ""}
            onChange={handleChange}
            className="border p-2 rounded-lg w-full text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-900"
            required
          />
        </div>
        {/* Location */}
        <div className="col-span-1">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-100">
            Location *
          </label>
          <input
            name="location"
            value={form.location || ""}
            onChange={handleChange}
            className="border p-2 rounded-lg w-full text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-900"
            required
          />
        </div>
        {/* Remote Option */}
        <div className="col-span-1 flex items-center">
          <input
            name="remoteOption"
            type="checkbox"
            checked={!!form.remoteOption}
            onChange={handleChange}
            className="mr-2"
          />
          <label className="text-sm font-medium text-slate-700 dark:text-slate-100">
            Remote Option
          </label>
        </div>
        {/* Job Description */}
        <div className="col-span-4">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-100">
            Job Description *
          </label>
          <textarea
            name="jobDescription"
            value={form.jobDescription || ""}
            onChange={handleChange}
            className="border p-2 rounded-lg w-full text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-900"
            rows={2}
            required
          />
        </div>
        {/* Requirements */}
        <div className="col-span-4">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-100">
            Requirements *
          </label>
          <textarea
            name="requirements"
            value={form.requirements || ""}
            onChange={handleChange}
            className="border p-2 rounded-lg w-full text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-900"
            rows={2}
            required
          />
        </div>
        {/* Responsibilities */}
        <div className="col-span-4">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-100">
            Responsibilities *
          </label>
          <textarea
            name="responsibilities"
            value={form.responsibilities || ""}
            onChange={handleChange}
            className="border p-2 rounded-lg w-full text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-900"
            rows={2}
            required
          />
        </div>
        {/* Buttons */}
        <div className="col-span-4 flex gap-3 justify-end">
          <Button
            type="submit"
            disabled={saving}
            className="bg-blue-600 text-white"
          >
            {saving ? "Saving..." : "Save Changes"}
          </Button>
          <Button asChild variant="outline">
            <Link href={`/dashboard/recruitment/${id}`}>Cancel</Link>
          </Button>
        </div>
      </form>
    </div>
  );
}
