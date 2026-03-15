// Add this to your global CSS (e.g., styles/globals.css) for SweetAlert2 theme support
/*
.swal2-popup-theme {
  background-color: #fff;
  color: #1e293b;
}
.dark .swal2-popup-theme {
  background-color: #1e293b !important;
  color: #f1f5f9 !important;
}
.swal2-title-theme {
  color: inherit;
}
.swal2-html-theme {
  color: inherit;
}
.swal2-confirm-theme {
  background-color: #dc2626 !important;
  color: #fff !important;
  border: none !important;
}
.swal2-cancel-theme {
  background-color: #2563eb !important;
  color: #fff !important;
  border: none !important;
}
.dark .swal2-confirm-theme {
  background-color: #ef4444 !important;
}
.dark .swal2-cancel-theme {
  background-color: #3b82f6 !important;
}
*/
"use client";

import { themedSwal } from "@/components/ui/ThemedSwal";
import {
  Bell,
  Calendar,
  User,
  CheckCircle,
  XCircle,
  Eye,
  Pencil,
  Trash2,
  TriangleAlert,
} from "lucide-react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useGetAllAnnouncements } from "@/hooks/announcement-query";
import { announcementsApi } from "@/lib/api";
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";

export default function AnnouncementsPage() {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const {
    data: response,
    isLoading,
    error,
    refetch,
  } = useGetAllAnnouncements();
  const announcementsRaw = Array.isArray(response)
    ? response
    : Array.isArray(response?.data)
      ? response.data
      : [];
  // Show all announcements (active and inactive)
  const announcements = announcementsRaw;
  // Debug log to verify API response shape and values
  // console.log("Announcements API response:", response);
  // console.log("Announcements array:", announcements);

  // Show SweetAlert2 error if announcements fail to load
  useEffect(() => {
    if (error) {
      themedSwal({
        title: "Error",
        text: "Error loading announcements. Please try again.",
        icon: "error",
      });
    }
  }, [error]);

  async function handleDelete(id: number) {
    themedSwal({
      title: "Are you sure?",
      text: "Are you sure you want to delete this announcement? This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        setDeletingId(id);
        try {
          await announcementsApi.deleteAnnouncement(id);
          await refetch();
          themedSwal({
            title: "Deleted!",
            text: "Announcement has been deleted.",
            icon: "success",
          });
        } catch (e) {
          themedSwal({
            title: "Error",
            text: "Failed to delete announcement.",
            icon: "error",
          });
        } finally {
          setDeletingId(null);
        }
      }
    });
  }

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

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Priority</TableHead>
            <TableHead>Created By</TableHead>
            <TableHead>Published At</TableHead>
            <TableHead>Expires At</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {announcements.map((announcement: any) => (
            <TableRow
              key={announcement.id}
              onClick={(e) => {
                // Prevent row click if clicking on a button or link inside actions
                if (
                  (e.target as HTMLElement).closest('button, [role="menuitem"]')
                )
                  return;
                router.push(`/dashboard/announcements/${announcement.id}`);
              }}
              className={
                "cursor-pointer transition hover:bg-slate-100 dark:hover:bg-slate-800" +
                (deletingId === announcement.id
                  ? " opacity-60 pointer-events-none"
                  : "")
              }
            >
              <TableCell>
                <div className="flex items-center gap-3">
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
                    <div className="max-w-xl text-xs text-slate-600 dark:text-slate-400 mt-1 whitespace-pre-line">
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
                  <TriangleAlert className="h-4 w-4" />
                  <span>{announcement.priority}</span>
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
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label="More actions"
                      tabIndex={0}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <MoreHorizontal className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="dark:bg-slate-900 dark:text-white text-black border-slate-700 bg-white"
                  >
                    <DropdownMenuItem
                      onClick={() =>
                        router.push(
                          `/dashboard/announcements/${announcement.id}`,
                        )
                      }
                    >
                      <Eye className="h-4 w-4 mr-2 text-green-600" /> View
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        router.push(
                          `/dashboard/announcements/${announcement.id}/edit`,
                        )
                      }
                    >
                      <Pencil className="h-4 w-4 mr-2 text-blue-600" /> Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleDelete(announcement.id)}
                      className="text-red-600 focus:text-red-600"
                      disabled={deletingId === announcement.id}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      {deletingId === announcement.id
                        ? "Deleting..."
                        : "Delete"}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
