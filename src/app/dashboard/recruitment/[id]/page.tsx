"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { jobPostingsApi } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Swal from "sweetalert2";

type JobDetail = {
  jobId: number | string;
  jobTitle: string;
  departmentName?: string;
  departmentId?: string | number;
  hiringManagerName?: string;
  hiringManagerId?: string | number;
  location?: string;
  employmentType?: string;
  vacancies?: number;
  jobStatus?: string;
  postingDate?: string;
  closingDate?: string;
  jobDescription?: string;
  requirements?: string;
  responsibilities?: string;
};

export default function RecruitmentJobDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [job, setJob] = useState<JobDetail | null>(null);
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

  // Delete handler with SweetAlert
  const handleDelete = async () => {
    Swal.fire({
      title: "Are you sure?",
      text: "This will permanently delete the job posting.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await jobPostingsApi.deleteJobPosting(job.jobId);
          Swal.fire("Deleted!", "Job posting deleted.", "success");
          router.push("/dashboard/recruitment");
        } catch (error) {
          Swal.fire("Error", "Failed to delete job posting.", "error");
        }
      }
    });
  };

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3 min-w-0">
          <button
            className="shrink-0 w-10 h-10 flex items-center justify-center rounded-lg bg-slate-800 hover:bg-slate-700 text-white dark:bg-slate-800 dark:hover:bg-slate-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
            onClick={() => router.push("/dashboard/recruitment")}
            aria-label="Back to Recruitment"
            type="button"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="text-2xl sm:text-2xl font-extrabold dark:text-white tracking-tight truncate ml-2">
            Job Details
          </h1>
        </div>

        <div className="flex gap-2">
          <Button
            asChild
            variant="default"
            size="sm"
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Link href={`/dashboard/recruitment/${job.jobId}/edit`}>
              <Edit className="w-4 h-4 mr-1" /> Edit
            </Link>
          </Button>
          <Button
            onClick={handleDelete}
            variant="destructive"
            size="sm"
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            <Trash2 className="w-4 h-4 mr-1" /> Delete
          </Button>
        </div>
      </div>
      <div className="max-w-full mx-auto mt-10">
        <div className="mb-4">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            {job.jobTitle}
          </h1>
        </div>
        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-lg p-8 border border-slate-200 dark:border-slate-700">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Department
              </span>
              <div className="font-semibold text-slate-900 dark:text-slate-100">
                {job.departmentName || job.departmentId}
              </div>
            </div>
            <div>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Hiring Manager
              </span>
              <div className="font-semibold text-slate-900 dark:text-slate-100">
                {job.hiringManagerName || job.hiringManagerId}
              </div>
            </div>
            <div>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Location
              </span>
              <div className="font-semibold text-slate-900 dark:text-slate-100">
                {job.location}
              </div>
            </div>
            <div>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Type
              </span>
              <div className="font-semibold text-slate-900 dark:text-slate-100">
                {job.employmentType}
              </div>
            </div>
            <div>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Vacancies
              </span>
              <div className="font-semibold text-slate-900 dark:text-slate-100">
                {job.vacancies}
              </div>
            </div>
            <div>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Status
              </span>
              <div className="font-semibold text-slate-900 dark:text-slate-100">
                {job.jobStatus}
              </div>
            </div>
            <div>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Posting Date
              </span>
              <div className="font-semibold text-slate-900 dark:text-slate-100">
                {job.postingDate
                  ? new Date(job.postingDate).toLocaleDateString()
                  : "-"}
              </div>
            </div>
            <div>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Closing Date
              </span>
              <div className="font-semibold text-slate-900 dark:text-slate-100">
                {job.closingDate
                  ? new Date(job.closingDate).toLocaleDateString()
                  : "-"}
              </div>
            </div>
          </div>
          <div>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              Description
            </span>
            <div className="text-base text-slate-700 dark:text-slate-200 mt-2">
              {job.jobDescription ? (
                <span>{job.jobDescription}</span>
              ) : (
                <span className="italic text-slate-400 dark:text-slate-500">
                  No description provided.
                </span>
              )}
            </div>
          </div>
          <div className="mt-6">
            <span className="text-xs text-slate-500 dark:text-slate-400">
              Responsibilities
            </span>
            <div className="text-base text-slate-700 dark:text-slate-200 mt-2">
              {job.responsibilities ? (
                <span>{job.responsibilities}</span>
              ) : (
                <span className="italic text-slate-400 dark:text-slate-500">
                  No responsibilities provided.
                </span>
              )}
            </div>
          </div>
          <div className="mt-6">
            <span className="text-xs text-slate-500 dark:text-slate-400">
              Requirements
            </span>
            <div className="text-base text-slate-700 dark:text-slate-200 mt-2">
              {job.requirements ? (
                <span>{job.requirements}</span>
              ) : (
                <span className="italic text-slate-400 dark:text-slate-500">
                  No requirements provided.
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
