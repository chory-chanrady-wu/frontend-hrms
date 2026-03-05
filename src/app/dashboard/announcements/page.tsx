"use client";

import { Bell, Calendar, User } from "lucide-react";

const announcements = [
  {
    id: 1,
    title: "Company Holiday - Lunar New Year",
    content:
      "The office will be closed from February 10-14, 2026 for Lunar New Year celebrations. We wish everyone a prosperous new year!",
    author: "HR Department",
    date: "2026-02-07",
    priority: "high",
  },
  {
    id: 2,
    title: "New Employee Benefits Program",
    content:
      "We're excited to announce enhanced health insurance coverage starting March 1st. Details will be sent to your email.",
    author: "Benefits Team",
    date: "2026-02-05",
    priority: "medium",
  },
  {
    id: 3,
    title: "Quarterly Town Hall Meeting",
    content:
      "Join us for the Q1 2026 Town Hall on February 20th at 2 PM in the main conference room. CEO will share company updates and Q&A.",
    author: "Management",
    date: "2026-02-03",
    priority: "medium",
  },
  {
    id: 4,
    title: "Office Maintenance Notice",
    content:
      "HVAC maintenance scheduled for February 15th from 6 AM to 10 AM. Please plan accordingly.",
    author: "Facilities",
    date: "2026-02-01",
    priority: "low",
  },
];

export default function AnnouncementsPage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Announcements</h1>
        <button className="bg-gradient-to-r from-[#0C4A6E] to-[#075985] text-white px-4 py-2 rounded-lg font-medium hover:shadow-lg transition-all">
          New Announcement
        </button>
      </div>

      <div className="space-y-4">
        {announcements.map((announcement) => (
          <div
            key={announcement.id}
            className="bg-white border border-slate-200 rounded-lg p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start gap-4">
              <div
                className={`p-3 rounded-lg ${
                  announcement.priority === "high"
                    ? "bg-red-100"
                    : announcement.priority === "medium"
                      ? "bg-blue-100"
                      : "bg-slate-100"
                }`}
              >
                <Bell
                  className={`h-6 w-6 ${
                    announcement.priority === "high"
                      ? "text-red-600"
                      : announcement.priority === "medium"
                        ? "text-blue-600"
                        : "text-slate-600"
                  }`}
                />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  {announcement.title}
                </h3>
                <p className="text-slate-600 mb-4">{announcement.content}</p>
                <div className="flex items-center gap-6 text-sm text-slate-500">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span>{announcement.author}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>
                      {new Date(announcement.date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                      })}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
