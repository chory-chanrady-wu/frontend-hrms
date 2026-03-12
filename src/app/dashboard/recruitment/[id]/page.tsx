"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { jobPostingsApi } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Briefcase } from "lucide-react";
import Link from "next/link";

export default function RecruitmentJobDetailPage() {
  const { id } = useParams();
  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
        setJob(data);
      } catch (err) {
        setError("Failed to load job posting.");
      } finally {
        setLoading(false);
      }
    }
    fetchJob();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <span className="text-lg text-slate-500">Loading...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <span className="text-lg text-red-500">{error}</span>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="flex items-center justify-center h-64">
        <span className="text-lg text-slate-500">Job posting not found.</span>
      </div>
    );
  }

  return (
    <>
      <div className="max-w-full mx-auto mt-5 bg-linear-to-br from-blue-100 via-blue-50 to-blue-200 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 rounded-3xl shadow-2xl p-12 relative animate-fade-in overflow-visible h-auto">
        <Link
          href="/dashboard/recruitment"
          className="absolute top-8 right-10 text-blue-600 hover:text-blue-800 dark:hover:text-blue-300 font-semibold text-sm transition"
        >
          Back to list
        </Link>
        <div className="flex flex-col items-center mb-10">
          <div className="bg-blue-100 dark:bg-slate-700 rounded-full p-4 mb-4 shadow-md animate-bounce relative">
            <Briefcase className="w-10 h-10 text-blue-600 dark:text-blue-300 drop-shadow-lg" />
            {job.jobStatus === "Open" && (
              <span className="absolute -top-3 -right-3 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold shadow-lg animate-pulse flex items-center gap-1">
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="12" fill="#22c55e" />
                  <path
                    d="M7 13l3 3 7-7"
                    stroke="#fff"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Open
              </span>
            )}
          </div>
          <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white mb-2 text-center tracking-tight animate-pulse">
            {job.jobTitle}
          </h1>
          {job.jobStatus === "Open" && (
            <div className="confetti absolute top-0 left-1/2 transform -translate-x-1/2 mt-2">
              <span className="text-yellow-400 text-2xl">🎉</span>
              <span className="text-pink-400 text-2xl">✨</span>
              <span className="text-blue-400 text-2xl">🎊</span>
            </div>
          )}
        </div>
        <div className="grid grid-cols-2 gap-x-10 gap-y-8 mb-10">
          <div>
            <span className="text-xs text-slate-500">Department</span>
            <div className="text-lg font-bold text-slate-900 dark:text-white mt-1">
              {job.departmentName || job.departmentId}
            </div>
          </div>
          <div>
            <span className="text-xs text-slate-500">Hiring Manager</span>
            <div className="text-lg font-bold text-slate-900 dark:text-white mt-1">
              {job.hiringManagerName || job.hiringManagerId}
            </div>
          </div>
          <div>
            <span className="text-xs text-slate-500">Location</span>
            <div className="text-base text-slate-700 dark:text-slate-300 mt-1">
              {job.location}
            </div>
          </div>
          <div>
            <span className="text-xs text-slate-500">Type</span>
            <div className="text-base text-slate-700 dark:text-slate-300 mt-1">
              {job.employmentType}
            </div>
          </div>
          <div>
            <span className="text-xs text-slate-500">Vacancies</span>
            <div className="text-lg font-bold text-slate-900 dark:text-white mt-1">
              {job.vacancies}
            </div>
          </div>
          <div>
            <span className="text-xs text-slate-500">Status</span>
            <span
              className={`inline-flex px-4 py-1 text-sm font-bold rounded-full shadow-md mt-1 transition-all duration-300 ${job.jobStatus === "Closed" ? "bg-red-600 text-white animate-glow" : "bg-green-600 text-white animate-glow"}`}
              style={{
                boxShadow:
                  job.jobStatus === "Closed"
                    ? "0 0 8px 2px #f87171"
                    : "0 0 8px 2px #22c55e",
                position: "relative",
                zIndex: 2,
              }}
            >
              {job.jobStatus === "Closed" ? "❌ " : "✅ "}
              {job.jobStatus}
            </span>
          </div>
          <div>
            <span className="text-xs text-slate-500">Posting Date</span>
            <div className="text-base text-slate-700 dark:text-slate-300 mt-1">
              {job.postingDate
                ? new Date(job.postingDate).toLocaleDateString()
                : "-"}
            </div>
          </div>
          <div>
            <span className="text-xs text-slate-500">Closing Date</span>
            <div className="text-base text-slate-700 dark:text-slate-300 mt-1">
              {job.closingDate
                ? new Date(job.closingDate).toLocaleDateString()
                : "-"}
            </div>
          </div>
        </div>
        <div className="mb-10">
          <span className="text-xs text-slate-500">Description</span>
          <div className="text-base text-slate-700 dark:text-slate-200 mt-2">
            {job.description ? (
              <span>{job.description}</span>
            ) : (
              <span className="italic text-slate-400">
                No description provided.
              </span>
            )}
          </div>
        </div>
        <hr className="my-8 border-blue-200 dark:border-slate-700" />
        <div className="flex gap-6 justify-center mt-6">
          <Button
            asChild
            variant="outline"
            className="px-8 py-2 text-base font-bold shadow-sm hover:bg-blue-300 hover:text-blue-900 dark:hover:bg-slate-700 dark:hover:text-blue-200 transition duration-300 border-2 border-blue-400"
          >
            <Link href={`/dashboard/recruitment/${job.jobId}/edit`}>
              <span role="img" aria-label="edit">
                ✏️
              </span>{" "}
              Edit
            </Link>
          </Button>
          <Button
            asChild
            variant="destructive"
            className="px-8 py-2 text-base font-bold shadow-sm hover:bg-red-400 hover:text-white transition duration-300 border-2 border-red-400"
          >
            <Link href="/dashboard/recruitment">
              <span role="img" aria-label="delete">
                🗑️
              </span>{" "}
              Delete
            </Link>
          </Button>
        </div>
      </div>
      {/* Removed creative-bg custom background style */}
    </>
  );
}
