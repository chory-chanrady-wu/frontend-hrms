"use client";
import Swal from "sweetalert2";

import { Briefcase, MoreHorizontalIcon } from "lucide-react";
import Link from "next/link";
import { jobPostingsApi } from "@/lib/api";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function RecruitmentPage() {
  // Job postings state
  const [jobPostings, setJobPostings] = useState([]);
  const [loading, setLoading] = useState(false);
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 9;
  const totalPages = Math.ceil(jobPostings.length / jobsPerPage);
  const paginatedJobs = jobPostings.slice(
    (currentPage - 1) * jobsPerPage,
    currentPage * jobsPerPage,
  );
  // Track which menu is open
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  // Close menu on outside click
  useEffect(() => {
    function handleClickOutside() {
      setOpenMenuId(null);
    }
    if (openMenuId) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [openMenuId]);

  // Handler for deleting a job posting
  const handleDelete = async (jobId: string) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Are you sure you want to delete this job posting?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        setLoading(true);
        try {
          await jobPostingsApi.deleteJobPosting(jobId);
          setJobPostings((prev: any) =>
            prev.filter((job: any) => job.jobId !== jobId),
          );
          Swal.fire("Deleted!", "Job posting deleted.", "success");
        } catch (error: any) {
          Swal.fire(
            "Error",
            error?.message || "Failed to delete job posting.",
            "error",
          );
        } finally {
          setLoading(false);
        }
      }
    });
  };

  // Handler for closing a job posting
  const handleClose = async (jobId: string) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Are you sure you want to close this job posting?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, close it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        setLoading(true);
        try {
          await jobPostingsApi.closeJobPosting(jobId);
          setJobPostings((prev: any) =>
            prev.map((job: any) =>
              job.jobId === jobId ? { ...job, jobStatus: "Closed" } : job,
            ),
          );
          Swal.fire("Closed!", "Job posting closed.", "success");
        } catch (error: any) {
          Swal.fire(
            "Error",
            error?.message || "Failed to close job posting.",
            "error",
          );
        } finally {
          setLoading(false);
        }
      }
    });
  };

  // Fetch job postings from API
  useEffect(() => {
    async function fetchJobPostings() {
      setLoading(true);
      try {
        const data = await jobPostingsApi.getAllJobPostings();
        setJobPostings(data);
      } catch (error) {
        // Handle error
      } finally {
        setLoading(false);
      }
    }
    fetchJobPostings();
  }, []);

  return (
    <div className="bg-white dark:bg-slate-900">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Recruitment</h1>
        <div className="flex gap-3">
          <Link
            href="/dashboard/recruitment/candidates"
            className="bg-white border border-slate-300 text-slate-700 px-4 py-2 rounded-lg font-medium hover:bg-slate-50 transition"
          >
            View Candidates
          </Link>
          <Link
            href="/dashboard/recruitment/interviews"
            className="bg-linear-to-r from-[#0C4A6E] to-[#075985] text-white px-4 py-2 rounded-lg font-medium hover:shadow-lg transition-all"
          >
            Schedule Interview
          </Link>
          <Link
            href="/dashboard/recruitment/add"
            className="bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition"
          >
            Add Job Posting
          </Link>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-6 md:grid-cols-4 mb-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 dark:bg-slate-800 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600">
                All Positions
              </p>
              <p className="text-3xl font-bold text-blue-900 mt-2">
                {jobPostings.length}
              </p>
            </div>
            <Briefcase className="h-12 w-12 text-blue-600 opacity-20" />
          </div>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 dark:bg-slate-800 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600">
                Open Positions
              </p>
              <p className="text-3xl font-bold text-green-900 mt-2">
                {
                  jobPostings.filter((job: any) => job.jobStatus === "open")
                    .length
                }
              </p>
            </div>
            <Briefcase className="h-12 w-12 text-green-600 opacity-20" />
          </div>
        </div>
      </div>

      {/* Open Positions */}
      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden dark:bg-slate-800 dark:border-slate-700">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Position</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Hiring Manager</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Type</TableHead>
              <TableHead className="text-center">Vacancies</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedJobs.map((job: any) => (
              <TableRow
                key={job.jobId}
                className={
                  openMenuId === job.jobId ? "bg-slate-700 text-white" : ""
                }
              >
                <TableCell className="font-medium">
                  <div className="text-sm font-medium text-slate-900 dark:text-slate-100">
                    {job.jobTitle}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    Posted on {new Date(job.postingDate).toLocaleDateString()}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm text-slate-900 dark:text-slate-100">
                    {job.departmentName ? job.departmentName : job.departmentId}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm text-slate-900 dark:text-slate-100">
                    {job.hiringManagerName
                      ? job.hiringManagerName
                      : job.hiringManagerId}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm text-slate-600 dark:text-slate-300">
                    {job.location}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm text-slate-600 dark:text-slate-300">
                    {job.employmentType}
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  <div className="text-sm font-medium text-slate-900 dark:text-slate-100">
                    {job.vacancies}
                  </div>
                </TableCell>
                <TableCell>
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${job.jobStatus === "closed" ? "bg-red-600 text-white" : "bg-green-600 text-white"}`}
                  >
                    {job.jobStatus}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="size-8">
                        <MoreHorizontalIcon />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild disabled={loading}>
                        <Link
                          href={`/dashboard/recruitment/${job.jobId}`}
                          tabIndex={loading ? -1 : 0}
                        >
                          View
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild disabled={loading}>
                        <Link
                          href={`/dashboard/recruitment/${job.jobId}/edit`}
                          tabIndex={loading ? -1 : 0}
                        >
                          Edit
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => handleDelete(job.jobId)}
                        variant="destructive"
                        disabled={loading}
                      >
                        Delete
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleClose(job.jobId)}
                        disabled={loading || job.jobStatus === "Closed"}
                      >
                        Close
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {/* Pagination Summary & Controls */}
        <div className="flex items-center justify-between px-6 py-3 border-t border-slate-200 dark:border-slate-700">
          {/* Summary */}
          <div className="mb-2 md:mb-0 text-xs text-slate-400 dark:text-slate-500">
            {(() => {
              const start = (currentPage - 1) * jobsPerPage + 1;
              const end = Math.min(
                currentPage * jobsPerPage,
                jobPostings.length,
              );
              return `Showing ${start}–${end} of ${jobPostings.length} jobs`;
            })()}
          </div>
          {/* Controls */}
          <div className="flex items-center gap-2">
            <button
              className="px-3 py-1 text-sm rounded-md border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              Previous
            </button>
            {/* Page numbers */}
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                className={`px-3 py-1 text-sm rounded-md ${
                  i + 1 === currentPage
                    ? "bg-blue-600 text-white"
                    : "border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                }`}
                onClick={() => setCurrentPage(i + 1)}
                disabled={currentPage === i + 1}
              >
                {i + 1}
              </button>
            ))}
            <button
              className="px-3 py-1 text-sm rounded-md border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
