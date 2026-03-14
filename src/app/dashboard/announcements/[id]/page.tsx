"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useDeleteAnnouncement } from "@/hooks/announcement-query";
import { announcementsApi } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, ArrowLeft } from "lucide-react";

function formatDateTime(dateString: string | undefined) {
  if (!dateString) return "";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  const day = date.getDate().toString().padStart(2, "0");
  const month = date.toLocaleString("en-US", { month: "long" });
  const year = date.getFullYear();
  let hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  if (hours === 0) hours = 12;
  const hourStr = hours.toString().padStart(2, "0");
  return `${day}, ${month} ${year} : ${hourStr}:${minutes} ${ampm}`;
}

export default function AnnouncementDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [announcement, setAnnouncement] = useState<any>(null);
  const deleteAnnouncement = useDeleteAnnouncement();

  async function fetchData() {
    setLoading(true);
    try {
      const data = await announcementsApi.getAnnouncementById(Number(id));
      setAnnouncement(data);
    } catch (e) {
      setError("Failed to load announcement.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (loading) {
    return <div className="p-8 text-center text-slate-500">Loading...</div>;
  }
  if (error) {
    return <div className="p-8 text-center text-red-600">{error}</div>;
  }
  if (!announcement) {
    return (
      <div className="p-8 text-center text-slate-500">
        No announcement found.
      </div>
    );
  }

  // Delete handler
  function handleDelete() {
    if (
      !window.confirm(
        "Are you sure you want to delete this announcement? This action cannot be undone.",
      )
    )
      return;
    deleteAnnouncement.mutate(Number(id), {
      onSuccess: () => {
        router.push("/dashboard/announcements");
      },
      onError: () => {
        alert("Failed to delete announcement.");
      },
    });
  }

  return (
    <>
      <div className="flex items-center justify-between mb-6 mt-4 gap-4 w-full">
        <div className="flex items-center gap-3 min-w-0">
          <button
            className="shrink-0 w-10 h-10 flex items-center justify-center rounded-lg bg-slate-800 hover:bg-slate-700 text-white dark:bg-slate-800 dark:hover:bg-slate-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
            onClick={() => router.push("/dashboard/announcements")}
            aria-label="Back to Announcements"
            type="button"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="text-2xl sm:text-2xl font-extrabold text-slate-100 dark:text-white tracking-tight truncate ml-2">
            Announcement Details
          </h1>
        </div>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="default"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold flex items-center gap-2"
            onClick={() =>
              router.push(`/dashboard/announcements/${announcement.id}/edit`)
            }
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15.232 5.232l3.536 3.536M9 13h3l8-8a2.828 2.828 0 00-4-4l-8 8v3h3z"
              />
            </svg>
            Edit
          </Button>
          <Button
            size="sm"
            variant="destructive"
            className="bg-red-600 hover:bg-red-700 text-white font-semibold flex items-center gap-2"
            onClick={handleDelete}
            disabled={deleteAnnouncement.isPending}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3m5 0H6"
              />
            </svg>
            {deleteAnnouncement.isPending ? "Deleting..." : "Delete"}
          </Button>
        </div>
      </div>
      <div className="max-w-full mx-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 mt-10 shadow-lg relative overflow-hidden">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-3">
            {announcement.title}
          </h2>
        </div>
        <div className="flex items-center gap-4 mb-6">
          <Badge
            variant={announcement.status ? "default" : "secondary"}
            className={
              announcement.status
                ? "bg-green-600 text-white px-3 py-1 text-sm"
                : "bg-gray-400 text-white px-3 py-1 text-sm"
            }
          >
            {announcement.status ? "Active" : "Inactive"}
          </Badge>
          <span
            className={`font-semibold text-xs uppercase tracking-wider px-2 py-1 rounded ${announcement.priority === "high" ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300" : announcement.priority === "medium" ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300" : "bg-slate-200 text-slate-700 dark:bg-slate-700/40 dark:text-slate-200"}`}
          >
            Priority: {announcement.priority}
          </span>
        </div>
        {/* Divider */}
        <div className="border-t border-slate-200 dark:border-slate-700 mb-6" />
        {/* Content */}
        <div className="mb-8">
          <div className="text-lg leading-relaxed text-slate-700 dark:text-slate-200 whitespace-pre-line">
            {announcement.content}
          </div>
        </div>
        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
          <div>
            <span className="font-semibold text-slate-600 dark:text-slate-300">
              Published At
            </span>
            <div className="text-slate-800 dark:text-slate-100">
              {formatDateTime(announcement.publishedAt)}
            </div>
          </div>
          <div>
            <span className="font-semibold text-slate-600 dark:text-slate-300">
              Expires At
            </span>
            <div className="text-slate-800 dark:text-slate-100">
              {formatDateTime(announcement.expiresAt)}
            </div>
          </div>
          <div>
            <span className="font-semibold text-slate-600 dark:text-slate-300">
              Created At
            </span>
            <div className="text-slate-800 dark:text-slate-100">
              {formatDateTime(announcement.createdAt)}
            </div>
          </div>
          <div>
            <span className="font-semibold text-slate-600 dark:text-slate-300">
              Updated At
            </span>
            <div className="text-slate-800 dark:text-slate-100">
              {formatDateTime(announcement.updatedAt)}
            </div>
          </div>
          <div className="md:col-span-2">
            <span className="font-semibold text-slate-600 dark:text-slate-300">
              Created By
            </span>
            <div className="text-slate-800 dark:text-slate-100">
              {announcement.createdByName} (ID: {announcement.createdById})
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
