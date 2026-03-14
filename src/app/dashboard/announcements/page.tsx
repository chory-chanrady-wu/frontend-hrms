"use client";

import { Bell, Calendar, User, CheckCircle, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useGetAllAnnouncements } from "@/hooks/announcement-query";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function AnnouncementsPage() {
  const router = useRouter();
  const { data: response, isLoading, error } = useGetAllAnnouncements();
  const announcementsRaw = Array.isArray(response)
    ? response
    : Array.isArray(response?.data)
      ? response.data
      : [];
  // Filter only active announcements
  const announcements = announcementsRaw.filter((a: any) => a.status === true);
  // Debug log to verify API response shape and values
  console.log("Announcements API response:", response);
  console.log("Active announcements array:", announcements);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Announcements</h1>
        <button
          className="bg-linear-to-r from-[#0C4A6E] to-[#075985] text-white px-4 py-2 rounded-lg font-medium hover:shadow-lg transition-all dark:bg-blue-900/30 dark:text-blue-100 border border-blue-700"
          onClick={() => router.push("/dashboard/announcements/add")}
        >
          New Announcement
        </button>
      </div>

      {isLoading && (
        <div className="bg-white border border-slate-200 rounded-lg p-6 text-center dark:bg-slate-800 dark:border-slate-700">
          <p className="text-slate-600 dark:text-slate-400">
            Loading announcements...
          </p>
        </div>
      )}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 dark:bg-red-900/20 dark:border-red-800">
          <p className="text-red-600 dark:text-red-400">
            Error loading announcements. Please try again.
          </p>
        </div>
      )}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created By</TableHead>
            <TableHead>Published At</TableHead>
            <TableHead>Expires At</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {announcements.map((announcement: any) => (
            <TableRow key={announcement.id}>
              <TableCell>
                <div className={`flex items-center gap-3`}>
                  <span
                    className={`p-2 rounded-lg ${
                      announcement.priority === "high"
                        ? "bg-red-100 dark:bg-red-900/20"
                        : announcement.priority === "medium"
                          ? "bg-blue-100 dark:bg-blue-900/20"
                          : "bg-slate-100 dark:bg-slate-700/30"
                    }`}
                  >
                    <Bell
                      className={`h-6 w-6 ${
                        announcement.priority === "high"
                          ? "text-red-600 dark:text-red-400"
                          : announcement.priority === "medium"
                            ? "text-blue-600 dark:text-blue-400"
                            : "text-slate-600 dark:text-slate-400"
                      }`}
                    />
                  </span>
                  <div>
                    <div className="font-semibold text-slate-900 dark:text-slate-100">
                      {announcement.title}
                    </div>
                    <div className="text-xs text-slate-600 dark:text-slate-400">
                      {announcement.content}
                    </div>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  {announcement.status ? (
                    <CheckCircle className="h-4 w-4 text-green-500 dark:text-green-400" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-500 dark:text-red-400" />
                  )}
                  <span
                    className={`text-xs font-semibold ${announcement.status ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}
                  >
                    {announcement.status ? "Active" : "Inactive"}
                  </span>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span>{announcement.createdByName || "Unknown"}</span>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>
                    {announcement.publishedAt
                      ? new Date(announcement.publishedAt).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "2-digit",
                            day: "2-digit",
                          },
                        )
                      : "Not published"}
                  </span>
                </div>
                <div className="mt-1 text-xs text-slate-400 dark:text-slate-500">
                  {announcement.createdAt && (
                    <>
                      Created:{" "}
                      {new Date(announcement.createdAt).toLocaleString("en-US")}
                    </>
                  )}
                  {announcement.updatedAt && (
                    <span>
                      {" "}
                      | Updated:{" "}
                      {new Date(announcement.updatedAt).toLocaleString("en-US")}
                    </span>
                  )}
                </div>
              </TableCell>
              <TableCell>
                {announcement.expiresAt ? (
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>
                      {new Date(announcement.expiresAt).toLocaleDateString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "2-digit",
                          day: "2-digit",
                        },
                      )}
                    </span>
                  </div>
                ) : (
                  <span className="text-xs text-slate-400">—</span>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
