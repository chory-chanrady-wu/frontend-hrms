"use client";

import { themedSwal } from "@/components/ui/ThemedSwal";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { useCreateAnnouncement } from "@/hooks/announcement-query";

export default function AddAnnouncementPage() {
  const router = useRouter();
  const employeeId =
    typeof window !== "undefined"
      ? Number(localStorage.getItem("employeeId")) || undefined
      : undefined;
  const [form, setForm] = useState({
    title: "",
    content: "",
    priority: "medium",
    publishedAt: "",
    expiresAt: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const { mutate, isPending } = useCreateAnnouncement();

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Validate publish date before expire date
    const now = new Date();
    now.setHours(0, 0, 0, 0); // Only compare date part
    if (form.publishedAt) {
      let publishDate = new Date(form.publishedAt);
      if (isNaN(publishDate.getTime())) {
        themedSwal({
          title: "Validation Error",
          text: "Invalid Publish Date & Time.",
          icon: "warning",
        });
        return;
      }
      if (publishDate < now) {
        themedSwal({
          title: "Validation Error",
          text: "Publish Date & Time must be today or in the future.",
          icon: "warning",
        });
        return;
      }
    }
    if (form.expiresAt) {
      // For datetime-local, treat empty time as 00:00
      let expireDate = new Date(form.expiresAt);
      if (isNaN(expireDate.getTime())) {
        themedSwal({
          title: "Validation Error",
          text: "Invalid Expire Date & Time.",
          icon: "warning",
        });
        return;
      }
      if (expireDate < now) {
        themedSwal({
          title: "Validation Error",
          text: "Expire Date & Time must be today or in the future.",
          icon: "warning",
        });
        return;
      }
    }
    if (form.publishedAt && form.expiresAt) {
      const publishDate = new Date(form.publishedAt);
      const expireDate = new Date(form.expiresAt);
      if (publishDate > expireDate) {
        themedSwal({
          title: "Validation Error",
          text: "Publish Date must be before Expire Date & Time.",
          icon: "warning",
        });
        return;
      }
    }
    mutate(
      {
        title: form.title,
        content: form.content,
        priority: form.priority,
        publishedAt: form.publishedAt
          ? new Date(form.publishedAt).toISOString()
          : undefined,
        expiresAt: form.expiresAt
          ? new Date(form.expiresAt).toISOString()
          : undefined,
        createdById: employeeId,
      },
      {
        onSuccess: () => {
          themedSwal({
            title: "Success",
            text: "Announcement created successfully!",
            icon: "success",
          });
          setTimeout(() => router.push("/dashboard/announcements"), 1200);
        },
        onError: (err: any) => {
          themedSwal({
            title: "Error",
            text: err?.message || "Failed to create announcement.",
            icon: "error",
          });
        },
      },
    );
  };

  return (
    <>
      <button
        type="button"
        className="mb-4 flex items-center gap-2 text-slate-700 dark:text-slate-200 hover:text-blue-700 dark:hover:text-blue-400 font-medium focus:outline-none"
        onClick={() => router.back()}
        aria-label="Back to Announcements"
      >
        <ArrowLeft className="h-5 w-5" />
        Back to Announcements
      </button>
      <div className="max-w-xl mx-auto mt-10 bg-white border border-slate-200 rounded-lg p-8 shadow-md dark:bg-slate-800 dark:border-slate-700">
        <h1 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">
          Add Announcement
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300"
              htmlFor="title"
            >
              Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={form.title}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none dark:bg-slate-700 dark:border-slate-600 dark:text-slate-100"
            />
          </div>
          <div>
            <label
              className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300"
              htmlFor="content"
            >
              Content
            </label>
            <textarea
              id="content"
              name="content"
              value={form.content}
              onChange={handleChange}
              required
              rows={5}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none dark:bg-slate-700 dark:border-slate-600 dark:text-slate-100"
            />
          </div>
          <div>
            <label
              className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300"
              htmlFor="priority"
            >
              Priority
            </label>
            <select
              id="priority"
              name="priority"
              value={form.priority}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none dark:bg-slate-700 dark:border-slate-600 dark:text-slate-100"
            >
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
          <div className="flex gap-4">
            <div className="flex-1">
              <label
                className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300"
                htmlFor="publishedAt"
              >
                Publish Date & Time
              </label>
              <input
                type="datetime-local"
                id="publishedAt"
                name="publishedAt"
                value={form.publishedAt}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none dark:bg-slate-700 dark:border-slate-600 dark:text-slate-100"
              />
            </div>
            <div className="flex-1">
              <label
                className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300"
                htmlFor="expiresAt"
              >
                Expire Date & Time
              </label>
              <input
                type="datetime-local"
                id="expiresAt"
                name="expiresAt"
                value={form.expiresAt}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none dark:bg-slate-700 dark:border-slate-600 dark:text-slate-100"
              />
            </div>
          </div>
          {/* SweetAlert2 handles error/success messages */}
          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-linear-to-r from-[#0C4A6E] to-[#075985] text-white py-2 rounded-lg font-medium hover:shadow-lg transition-all dark:bg-blue-900/30 dark:text-blue-100 border border-blue-700 disabled:opacity-50"
          >
            {isPending ? "Saving..." : "Create Announcement"}
          </button>
        </form>
      </div>
    </>
  );
}
