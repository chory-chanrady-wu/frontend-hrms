"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { format } from "date-fns";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { announcementsApi } from "@/lib/api";
import { useUpdateAnnouncement } from "@/hooks/announcement-query";

// Use real API

export default function AnnouncementEditPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    id: 0,
    title: "",
    content: "",
    priority: "Normal",
    status: true,
    createdById: 0,
    createdByName: "",
    publishedAt: "",
    expiresAt: "",
    createdAt: "",
    updatedAt: "",
  });
  const updateAnnouncement = useUpdateAnnouncement();
  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value,
    }));
  };
  const handleDateChange = (name: string, value: string) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };
  const handleStatusChange = (checked: boolean) => {
    setForm((prev) => ({ ...prev, status: checked }));
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    // Validate publish/expire dates
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    if (form.publishedAt) {
      const publishDate = new Date(form.publishedAt);
      if (publishDate < now) {
        setError("Published At must be today or in the future.");
        return;
      }
    }
    if (form.expiresAt) {
      const expireDate = new Date(form.expiresAt);
      if (expireDate < now) {
        setError("Expires At must be today or in the future.");
        return;
      }
    }
    if (form.publishedAt && form.expiresAt) {
      const publishDate = new Date(form.publishedAt);
      const expireDate = new Date(form.expiresAt);
      if (publishDate > expireDate) {
        setError("Published At must be before Expires At.");
        return;
      }
    }
    updateAnnouncement.mutate(
      {
        id: form.id,
        data: {
          title: form.title,
          content: form.content,
          priority: form.priority,
          publishedAt: form.publishedAt,
          expiresAt: form.expiresAt,
        },
      },
      {
        onSuccess: () => {
          router.back();
        },
        onError: () => {
          setError("Failed to update announcement.");
        },
      },
    );
  };
  useEffect(() => {
    setLoading(true);
    async function fetchData() {
      try {
        const data = await announcementsApi.getAnnouncementById(Number(id));
        setForm({
          id: data.id,
          title: data.title ?? "",
          content: data.content ?? "",
          priority: data.priority ?? "Normal",
          status: data.status ?? true,
          createdById: data.createdById ?? 0,
          createdByName: data.createdByName ?? "",
          publishedAt: data.publishedAt ?? "",
          expiresAt: data.expiresAt ?? "",
          createdAt: data.createdAt ?? "",
          updatedAt: data.updatedAt ?? "",
        });
      } catch (e) {
        setError("Failed to load announcement.");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [id]);
  // (Removed duplicate fetchData and useEffect)

  if (loading) {
    return <div className="p-8 text-center text-slate-500">Loading...</div>;
  }

  return (
    <div className="max-w-xl mx-auto bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-8 mt-8">
      <h1 className="text-2xl font-bold mb-6 text-slate-900 dark:text-white">
        Edit Announcement
      </h1>
      {error && <div className="mb-4 text-red-600">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-200">
            Title
          </label>
          <Input
            name="title"
            value={form.title}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-200">
            Content
          </label>
          <Textarea
            name="content"
            value={form.content}
            onChange={handleChange}
            rows={4}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-200">
            Priority
          </label>
          <select
            name="priority"
            value={form.priority}
            onChange={handleSelectChange}
            className="w-full border border-slate-300 dark:border-slate-700 rounded px-2 py-2 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-100"
          >
            <option value="Low">Low</option>
            <option value="Normal">Normal</option>
            <option value="High">High</option>
          </select>
        </div>
        <div className="flex items-center gap-3">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
            Status
          </label>
          <Switch checked={form.status} onCheckedChange={handleStatusChange} />
          <span className="text-xs text-slate-500">
            {form.status ? "Active" : "Inactive"}
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-200">
              Published At
            </label>
            <Input
              type="datetime-local"
              name="publishedAt"
              value={
                form.publishedAt
                  ? format(new Date(form.publishedAt), "yyyy-MM-dd'T'HH:mm")
                  : ""
              }
              onChange={(e) => handleDateChange("publishedAt", e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-200">
              Expires At
            </label>
            <Input
              type="datetime-local"
              name="expiresAt"
              value={
                form.expiresAt
                  ? format(new Date(form.expiresAt), "yyyy-MM-dd'T'HH:mm")
                  : ""
              }
              onChange={(e) => handleDateChange("expiresAt", e.target.value)}
            />
          </div>
        </div>
        <div className="flex gap-3 mt-6">
          <Button
            type="submit"
            disabled={updateAnnouncement.isPending}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            {updateAnnouncement.isPending ? "Saving..." : "Save"}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
