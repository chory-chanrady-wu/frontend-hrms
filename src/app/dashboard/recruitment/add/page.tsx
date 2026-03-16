"use client";

import { jobPostingsApi } from "@/lib/api";
import { themedSwal } from "@/components/ui/ThemedSwal";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Select, { SingleValue } from "react-select";

// Custom styles for react-select to match Tailwind dark/light mode
const selectStyles = {
  control: (provided: any, state: any) => ({
    ...provided,
    backgroundColor: document.documentElement.classList.contains("dark")
      ? "#1e293b"
      : "#f8fafc",
    borderColor: state.isFocused ? "#0C4A6E" : "#cbd5e1",
    color: document.documentElement.classList.contains("dark")
      ? "#f1f5f9"
      : "#0f172a",
    boxShadow: state.isFocused ? "0 0 0 2px #0C4A6E" : "none",
  }),
  menu: (provided: any) => ({
    ...provided,
    backgroundColor: document.documentElement.classList.contains("dark")
      ? "#1e293b"
      : "#f8fafc",
    color: document.documentElement.classList.contains("dark")
      ? "#f1f5f9"
      : "#0f172a",
  }),
  option: (provided: any, state: any) => ({
    ...provided,
    backgroundColor: state.isFocused
      ? document.documentElement.classList.contains("dark")
        ? "#334155"
        : "#e0e7ef"
      : document.documentElement.classList.contains("dark")
        ? "#1e293b"
        : "#f8fafc",
    color: document.documentElement.classList.contains("dark")
      ? "#f1f5f9"
      : "#0f172a",
  }),
  singleValue: (provided: any) => ({
    ...provided,
    color: document.documentElement.classList.contains("dark")
      ? "#f1f5f9"
      : "#0f172a",
  }),
  input: (provided: any) => ({
    ...provided,
    color: document.documentElement.classList.contains("dark")
      ? "#f1f5f9"
      : "#0f172a",
  }),
};
import { useGetAllDepartments } from "@/hooks/department-query";
import { useGetAllUsers } from "@/hooks/user-query";
import { useEffect } from "react";
import { getAccessToken } from "@/lib/auth";

export default function AddJobPostingPage() {
  // Validation and error state
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  // Default dates
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");
  const todayStr = `${yyyy}-${mm}-${dd}`;
  const oneMonthLater = new Date(today);
  oneMonthLater.setMonth(oneMonthLater.getMonth() + 1);
  const yyyy2 = oneMonthLater.getFullYear();
  const mm2 = String(oneMonthLater.getMonth() + 1).padStart(2, "0");
  const dd2 = String(oneMonthLater.getDate()).padStart(2, "0");
  const oneMonthStr = `${yyyy2}-${mm2}-${dd2}`;

  const [form, setForm] = useState({
    closingDate: oneMonthStr,
    createdAt: "" as string | null,
    createdBy: "",
    departmentId: "",
    employmentType: "",
    hiringManagerId: "",
    jobDescription: "",
    jobStatus: "Open",
    jobTitle: "",
    location: "",
    postingDate: todayStr,
    remoteOption: false,
    requirements: "",
    responsibilities: "",
    salary: "",
    updatedAt: "" as string | null,
    vacancies: 1,
  });
  // Auto-update jobStatus to 'Closed' after closingDate
  useEffect(() => {
    if (form.closingDate) {
      const closing = new Date(form.closingDate);
      const now = new Date();
      if (now > closing && form.jobStatus !== "Closed") {
        setForm((prev) => ({ ...prev, jobStatus: "Closed" }));
      } else if (now <= closing && form.jobStatus !== "Open") {
        setForm((prev) => ({ ...prev, jobStatus: "Open" }));
      }
    }
  }, [form.closingDate]);

  // Department and user queries
  const { data: departments = [], isLoading: deptLoading } =
    useGetAllDepartments();
  const { data: users = [], isLoading: userLoading } = useGetAllUsers();

  // Get logged-in user info (example: decode token or fetch user)
  useEffect(() => {
    // Example: decode JWT or fetch user profile
    const token = getAccessToken();
    let userId = "";
    if (token) {
      try {
        // If JWT, decode and extract userId
        const payload = JSON.parse(atob(token.split(".")[1]));
        userId = payload.userId || payload.id || payload.sub || "";
      } catch {}
    }
    if (userId) {
      setForm((prev) => ({ ...prev, createdBy: userId }));
    }
  }, []);

  type OptionType = { value: string | number; label: string };

  // Employment type options
  const employmentTypeOptions: OptionType[] = [
    { value: "Full-Time", label: "Full-Time" },
    { value: "Part-Time", label: "Part-Time" },
    { value: "Contract", label: "Contract" },
    { value: "Internship", label: "Internship" },
    { value: "Temporary", label: "Temporary" },
  ];

  // Department options
  const departmentOptions: OptionType[] = departments.map((dept: any) => ({
    value: dept.id || dept.departmentId,
    label: dept.name,
  }));

  // User options
  const userOptions: OptionType[] = users.map((user: any) => ({
    value: user.id || user.userId,
    label: user.fullName || user.username,
  }));

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value, type } = e.target;
    let newValue: string | boolean = value;
    if (type === "checkbox") {
      newValue = (e.target as HTMLInputElement).checked;
    }
    setForm((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  // react-select handlers
  const initialFormState = {
    closingDate: "",
    createdAt: "",
    createdBy: form.createdBy,
    departmentId: "",
    employmentType: "",
    hiringManagerId: "",
    jobDescription: "",
    jobId: "",
    jobStatus: "",
    jobTitle: "",
    location: "",
    postingDate: "",
    remoteOption: false,
    requirements: "",
    responsibilities: "",
    salary: "",
    updatedAt: "",
    vacancies: 1,
  };

  const handleSelectChange = (
    name: string,
    option: SingleValue<OptionType>,
  ) => {
    setForm((prev) => ({
      ...prev,
      [name]: option ? option.value : "",
    }));
  };

  // Simple validation
  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!form.jobTitle) newErrors.jobTitle = "Job title is required.";
    if (!form.departmentId) newErrors.departmentId = "Department is required.";
    if (!form.location) newErrors.location = "Location is required.";
    if (!form.employmentType)
      newErrors.employmentType = "Employment type is required.";
    if (!form.vacancies || Number(form.vacancies) < 1)
      newErrors.vacancies = "Vacancies must be at least 1.";
    if (!form.jobStatus) newErrors.jobStatus = "Job status is required.";
    if (!form.postingDate) newErrors.postingDate = "Posting date is required.";
    if (!form.closingDate) newErrors.closingDate = "Closing date is required.";
    if (!form.createdBy) newErrors.createdBy = "Created By is required.";
    if (!form.hiringManagerId)
      newErrors.hiringManagerId = "Hiring Manager is required.";
    if (!form.jobDescription)
      newErrors.jobDescription = "Job description is required.";
    if (!form.requirements)
      newErrors.requirements = "Requirements are required.";
    if (!form.responsibilities)
      newErrors.responsibilities = "Responsibilities are required.";
    if (!form.salary) newErrors.salary = "Salary is required.";
    return newErrors;
  };

  const handleCreateJob = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;
    setLoading(true);
    // Map form fields to required API fields and types
    // Generate a random UUID for jobId (for demo, not cryptographically secure)
    function uuidv4() {
      return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
        /[xy]/g,
        function (c) {
          var r = (Math.random() * 16) | 0,
            v = c === "x" ? r : (r & 0x3) | 0x8;
          return v.toString(16);
        },
      );
    }
    const payload = {
      jobId: uuidv4(),
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
      updatedAt:
        form.updatedAt && form.updatedAt !== ""
          ? form.updatedAt
          : new Date().toISOString(),
    };
    try {
      await jobPostingsApi.createJobPosting(payload);
      await themedSwal({
        icon: "success",
        title: "Job posting created successfully!",
        showConfirmButton: true,
      });
      router.push("/dashboard/recruitment");
    } catch (error) {
      await themedSwal({
        icon: "error",
        title: "Failed to create job posting",
        text: (error as Error).message || "An error occurred.",
        showConfirmButton: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto mt-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-8">
      <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100 text-center">
        Create Job Posting
      </h2>
      <form
        onSubmit={handleCreateJob}
        className="grid grid-cols-4 gap-6 bg-white dark:bg-slate-900 rounded-lg"
        aria-label="Job Posting Form"
      >
        <div className="col-span-1 bg-white dark:bg-slate-900 rounded-lg">
          <label
            htmlFor="jobTitle"
            className="block text-sm font-medium text-slate-700 dark:text-slate-100"
          >
            Job Title *
          </label>
          <input
            id="jobTitle"
            name="jobTitle"
            value={form.jobTitle}
            onChange={handleChange}
            placeholder="Enter job title"
            className={`border p-2 rounded-lg w-full text-slate-900 dark:text-slate-100 placeholder:text-slate-500 dark:placeholder:text-slate-400 bg-white dark:bg-slate-900 ${errors.jobTitle ? "border-red-500" : ""}`}
            style={{
              backgroundColor: document.documentElement.classList.contains(
                "dark",
              )
                ? "#1e293b"
                : "#f8fafc",
            }}
            aria-invalid={!!errors.jobTitle}
            aria-describedby="jobTitle-error"
          />
          {errors.jobTitle && (
            <span id="jobTitle-error" className="text-xs text-red-500">
              {errors.jobTitle}
            </span>
          )}
        </div>
        {/* Department dropdown */}
        <div className="col-span-1 bg-white dark:bg-slate-900 rounded-lg">
          <label
            htmlFor="departmentId"
            className="block text-sm font-medium text-slate-700 dark:text-slate-100"
          >
            Department *
          </label>
          <Select
            name="departmentId"
            inputId="departmentId"
            options={departmentOptions}
            value={
              departmentOptions.find(
                (opt: OptionType) => opt.value === form.departmentId,
              ) || null
            }
            onChange={(option: SingleValue<OptionType>) =>
              handleSelectChange("departmentId", option)
            }
            isLoading={deptLoading}
            placeholder="Select Department"
            classNamePrefix="react-select"
            aria-invalid={!!errors.departmentId}
            aria-describedby="departmentId-error"
            styles={selectStyles}
          />
          {errors.departmentId && (
            <span id="departmentId-error" className="text-xs text-red-500">
              {errors.departmentId}
            </span>
          )}
        </div>
        {/* Employment type dropdown */}
        <div className="col-span-1 bg-white dark:bg-slate-900 rounded-lg">
          <label
            htmlFor="employmentType"
            className="block text-sm font-medium text-slate-700 dark:text-slate-100"
          >
            Employment Type *
          </label>
          <Select
            name="employmentType"
            inputId="employmentType"
            options={employmentTypeOptions}
            value={
              employmentTypeOptions.find(
                (opt: OptionType) => opt.value === form.employmentType,
              ) || null
            }
            onChange={(option: SingleValue<OptionType>) =>
              handleSelectChange("employmentType", option)
            }
            placeholder="Select Employment Type"
            classNamePrefix="react-select"
            aria-invalid={!!errors.employmentType}
            aria-describedby="employmentType-error"
            styles={selectStyles}
          />
          {errors.employmentType && (
            <span id="employmentType-error" className="text-xs text-red-500">
              {errors.employmentType}
            </span>
          )}
        </div>
        <div className="col-span-1 bg-white dark:bg-slate-900 rounded-lg">
          <label
            htmlFor="hiringManagerId"
            className="block text-sm font-medium text-slate-700 dark:text-slate-100"
          >
            Hiring Manager *
          </label>
          <Select
            name="hiringManagerId"
            inputId="hiringManagerId"
            options={userOptions}
            value={
              userOptions.find(
                (opt: OptionType) => opt.value === form.hiringManagerId,
              ) || null
            }
            onChange={(option: SingleValue<OptionType>) =>
              handleSelectChange("hiringManagerId", option)
            }
            isLoading={userLoading}
            placeholder="Select Hiring Manager"
            classNamePrefix="react-select"
            aria-invalid={!!errors.hiringManagerId}
            aria-describedby="hiringManagerId-error"
            styles={selectStyles}
          />
          {errors.hiringManagerId && (
            <span id="hiringManagerId-error" className="text-xs text-red-500">
              {errors.hiringManagerId}
            </span>
          )}
        </div>
        <div className="col-span-1 bg-white dark:bg-slate-900 rounded-lg">
          <label
            htmlFor="vacancies"
            className="block text-sm font-medium text-slate-700 dark:text-slate-100"
          >
            Vacancies *
          </label>
          <input
            id="vacancies"
            name="vacancies"
            type="number"
            min={1}
            value={form.vacancies}
            onChange={handleChange}
            placeholder="Number of vacancies"
            className={`border p-2 rounded-lg w-full text-slate-900 dark:text-white placeholder:text-slate-500 dark:placeholder:text-slate-400 bg-white dark:bg-slate-900 ${errors.vacancies ? "border-red-500" : ""}`}
            style={{
              backgroundColor: document.documentElement.classList.contains(
                "dark",
              )
                ? "#1e293b"
                : "#fff",
            }}
            aria-invalid={!!errors.vacancies}
            aria-describedby="vacancies-error"
          />
          {errors.vacancies && (
            <span id="vacancies-error" className="text-xs text-red-500">
              {errors.vacancies}
            </span>
          )}
        </div>
        {/* Job Status is auto-set, no input field */}
        <div className="col-span-1 bg-white dark:bg-slate-900 rounded-lg">
          <label
            htmlFor="postingDate"
            className="block text-sm font-medium text-slate-700 dark:text-slate-100"
          >
            Posting Date *
          </label>
          <input
            id="postingDate"
            name="postingDate"
            type="date"
            value={form.postingDate}
            onChange={handleChange}
            placeholder="Posting Date"
            className={`border p-2 rounded-lg w-full text-slate-900 dark:text-white placeholder:text-slate-500 dark:placeholder:text-slate-400 bg-white dark:bg-slate-900 ${errors.postingDate ? "border-red-500" : ""}`}
            style={{
              backgroundColor: document.documentElement.classList.contains(
                "dark",
              )
                ? "#1e293b"
                : "#fff",
            }}
            aria-invalid={!!errors.postingDate}
            aria-describedby="postingDate-error"
          />
          {errors.postingDate && (
            <span id="postingDate-error" className="text-xs text-red-500">
              {errors.postingDate}
            </span>
          )}
        </div>
        <div className="col-span-1 bg-white dark:bg-slate-900 rounded-lg">
          <label
            htmlFor="closingDate"
            className="block text-sm font-medium text-slate-700 dark:text-slate-100"
          >
            Closing Date *
          </label>
          <input
            id="closingDate"
            name="closingDate"
            type="date"
            value={form.closingDate}
            onChange={handleChange}
            placeholder="Closing Date"
            className={`border p-2 rounded-lg w-full text-slate-900 dark:text-white placeholder:text-slate-500 dark:placeholder:text-slate-400 bg-white dark:bg-slate-900 ${errors.closingDate ? "border-red-500" : ""}`}
            style={{
              backgroundColor: document.documentElement.classList.contains(
                "dark",
              )
                ? "#1e293b"
                : "#fff",
            }}
            aria-invalid={!!errors.closingDate}
            aria-describedby="closingDate-error"
          />
          {errors.closingDate && (
            <span id="closingDate-error" className="text-xs text-red-500">
              {errors.closingDate}
            </span>
          )}
        </div>
        {/* Created By auto-selected from login user (hidden input) */}
        <input type="hidden" name="createdBy" value={form.createdBy} />
        <div className="col-span-1 bg-white dark:bg-slate-900 rounded-lg">
          <label
            htmlFor="salary"
            className="block text-sm font-medium text-slate-700 dark:text-slate-100"
          >
            Salary *
          </label>
          <input
            id="salary"
            name="salary"
            value={form.salary}
            onChange={handleChange}
            placeholder="Enter salary"
            className={`border p-2 rounded-lg w-full text-slate-900 dark:text-white placeholder:text-slate-500 dark:placeholder:text-slate-400 bg-white dark:bg-slate-900 ${errors.salary ? "border-red-500" : ""}`}
            style={{
              backgroundColor: document.documentElement.classList.contains(
                "dark",
              )
                ? "#1e293b"
                : "#fff",
            }}
            aria-invalid={!!errors.salary}
            aria-describedby="salary-error"
          />
          {errors.salary && (
            <span id="salary-error" className="text-xs text-red-500">
              {errors.salary}
            </span>
          )}
        </div>
        <div className="col-span-1 bg-white dark:bg-slate-900 rounded-lg">
          <label
            htmlFor="location"
            className="block text-sm font-medium text-slate-700 dark:text-slate-100"
          >
            Location *
          </label>
          <input
            id="location"
            name="location"
            value={form.location}
            onChange={handleChange}
            placeholder="Enter location"
            className={`border p-2 rounded-lg w-full text-slate-900 dark:text-white placeholder:text-slate-500 dark:placeholder:text-slate-400 bg-white dark:bg-slate-900 ${errors.location ? "border-red-500" : ""}`}
            style={{
              backgroundColor: document.documentElement.classList.contains(
                "dark",
              )
                ? "#1e293b"
                : "#fff",
            }}
            aria-invalid={!!errors.location}
            aria-describedby="location-error"
          />
          {errors.location && (
            <span id="location-error" className="text-xs text-red-500">
              {errors.location}
            </span>
          )}
        </div>
        <div className="col-span-1 flex items-center bg-white dark:bg-slate-900 rounded-lg">
          <input
            id="remoteOption"
            name="remoteOption"
            type="checkbox"
            checked={form.remoteOption}
            onChange={handleChange}
            className="mr-2"
            aria-label="Remote Option"
          />
          <label
            htmlFor="remoteOption"
            className="text-sm font-medium text-slate-700 dark:text-slate-100"
          >
            Remote Option
          </label>
        </div>
        <div className="col-span-4 bg-white dark:bg-slate-900 rounded-lg">
          <label
            htmlFor="jobDescription"
            className="block text-sm font-medium text-slate-700 dark:text-slate-100"
          >
            Job Description *
          </label>
          <textarea
            id="jobDescription"
            name="jobDescription"
            value={form.jobDescription}
            onChange={handleChange}
            placeholder="Describe the job role"
            className={`border p-2 rounded-lg w-full text-slate-900 dark:text-white placeholder:text-slate-500 dark:placeholder:text-slate-400 bg-white dark:bg-slate-900 ${errors.jobDescription ? "border-red-500" : ""}`}
            style={{
              backgroundColor: document.documentElement.classList.contains(
                "dark",
              )
                ? "#1e293b"
                : "#fff",
            }}
            aria-invalid={!!errors.jobDescription}
            aria-describedby="jobDescription-error"
            rows={2}
          />
          {errors.jobDescription && (
            <span id="jobDescription-error" className="text-xs text-red-500">
              {errors.jobDescription}
            </span>
          )}
        </div>
        <div className="col-span-4 bg-white dark:bg-slate-900 rounded-lg">
          <label
            htmlFor="requirements"
            className="block text-sm font-medium text-slate-700 dark:text-slate-100"
          >
            Requirements *
          </label>
          <textarea
            id="requirements"
            name="requirements"
            value={form.requirements}
            onChange={handleChange}
            placeholder="List requirements"
            className={`border p-2 rounded-lg w-full text-slate-900 dark:text-white placeholder:text-slate-500 dark:placeholder:text-slate-400 bg-white dark:bg-slate-900 ${errors.requirements ? "border-red-500" : ""}`}
            style={{
              backgroundColor: document.documentElement.classList.contains(
                "dark",
              )
                ? "#1e293b"
                : "#fff",
            }}
            aria-invalid={!!errors.requirements}
            aria-describedby="requirements-error"
            rows={2}
          />
          {errors.requirements && (
            <span id="requirements-error" className="text-xs text-red-500">
              {errors.requirements}
            </span>
          )}
        </div>
        <div className="col-span-4 bg-white dark:bg-slate-900 rounded-lg">
          <label
            htmlFor="responsibilities"
            className="block text-sm font-medium text-slate-700 dark:text-slate-100"
          >
            Responsibilities *
          </label>
          <textarea
            id="responsibilities"
            name="responsibilities"
            value={form.responsibilities}
            onChange={handleChange}
            placeholder="List responsibilities"
            className={`border p-2 rounded-lg w-full text-slate-900 dark:text-white placeholder:text-slate-500 dark:placeholder:text-slate-400 bg-white dark:bg-slate-900 ${errors.responsibilities ? "border-red-500" : ""}`}
            style={{
              backgroundColor: document.documentElement.classList.contains(
                "dark",
              )
                ? "#1e293b"
                : "#fff",
            }}
            aria-invalid={!!errors.responsibilities}
            aria-describedby="responsibilities-error"
            rows={2}
          />
          {errors.responsibilities && (
            <span id="responsibilities-error" className="text-xs text-red-500">
              {errors.responsibilities}
            </span>
          )}
        </div>
        <div className="col-span-4 flex justify-end bg-white dark:bg-slate-900 rounded-lg">
          <button
            type="submit"
            className="mt-4 bg-linear-to-r from-[#0C4A6E] to-[#075985] text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            disabled={loading}
            aria-busy={loading}
          >
            {loading ? "Creating..." : "Create Job Posting"}
          </button>
        </div>
      </form>
    </div>
  );
}
