"use client";

import { BookOpen, Users, Clock, Award } from "lucide-react";
import Link from "next/link";

const trainingStats = [
  {
    id: 1,
    label: "Active Courses",
    value: "12",
    icon: BookOpen,
    color: "blue",
  },
  {
    id: 2,
    label: "Enrolled Employees",
    value: "156",
    icon: Users,
    color: "green",
  },
  {
    id: 3,
    label: "Hours Completed",
    value: "3,240",
    icon: Clock,
    color: "purple",
  },
  {
    id: 4,
    label: "Certifications",
    value: "45",
    icon: Award,
    color: "orange",
  },
];

const recentTraining = [
  {
    id: 1,
    title: "Leadership Skills Workshop",
    enrolled: 25,
    completed: 18,
    duration: "5 hours",
    status: "ongoing",
  },
  {
    id: 2,
    title: "Customer Service Excellence",
    enrolled: 32,
    completed: 32,
    duration: "3 hours",
    status: "completed",
  },
  {
    id: 3,
    title: "Technical Writing Fundamentals",
    enrolled: 15,
    completed: 10,
    duration: "8 hours",
    status: "ongoing",
  },
];

export default function TrainingPage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-900">
          Training & Development
        </h1>
        <Link
          href="/dashboard/training/courses"
          className="bg-gradient-to-r from-[#0C4A6E] to-[#075985] text-white px-4 py-2 rounded-lg font-medium hover:shadow-lg transition-all"
        >
          View All Courses
        </Link>
      </div>

      {/* Stats */}
      <div className="grid gap-6 md:grid-cols-4 mb-8">
        {trainingStats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.id}
              className={`bg-${stat.color}-50 border border-${stat.color}-200 rounded-lg p-6`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm font-medium text-${stat.color}-600`}>
                    {stat.label}
                  </p>
                  <p
                    className={`text-3xl font-bold text-${stat.color}-900 mt-2`}
                  >
                    {stat.value}
                  </p>
                </div>
                <Icon
                  className={`h-12 w-12 text-${stat.color}-600 opacity-20`}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Training */}
      <div className="bg-white border border-slate-200 rounded-lg">
        <div className="px-6 py-4 border-b border-slate-200">
          <h2 className="text-lg font-semibold text-slate-900">
            Recent Training Programs
          </h2>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {recentTraining.map((training) => (
              <div
                key={training.id}
                className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:shadow-md transition"
              >
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-900 mb-2">
                    {training.title}
                  </h3>
                  <div className="flex items-center gap-6 text-sm text-slate-600">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      <span>
                        {training.completed}/{training.enrolled} completed
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span>{training.duration}</span>
                    </div>
                  </div>
                </div>
                <span
                  className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                    training.status === "completed"
                      ? "bg-green-100 text-green-800"
                      : "bg-blue-100 text-blue-800"
                  }`}
                >
                  {training.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
