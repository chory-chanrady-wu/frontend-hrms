"use client";

import { BookOpen, Clock, Users, Play } from "lucide-react";

const courses = [
  {
    id: 1,
    title: "Leadership Skills Workshop",
    description: "Develop essential leadership and management skills",
    duration: "5 hours",
    enrolled: 25,
    category: "Leadership",
    level: "Intermediate",
  },
  {
    id: 2,
    title: "Customer Service Excellence",
    description: "Master the art of exceptional customer service",
    duration: "3 hours",
    enrolled: 32,
    category: "Customer Service",
    level: "Beginner",
  },
  {
    id: 3,
    title: "Technical Writing Fundamentals",
    description: "Learn to write clear and effective technical documentation",
    duration: "8 hours",
    enrolled: 15,
    category: "Communication",
    level: "Intermediate",
  },
  {
    id: 4,
    title: "Data Analysis with Excel",
    description: "Advanced Excel techniques for data analysis",
    duration: "12 hours",
    enrolled: 28,
    category: "Technical",
    level: "Advanced",
  },
  {
    id: 5,
    title: "Project Management Basics",
    description: "Introduction to project management methodologies",
    duration: "6 hours",
    enrolled: 20,
    category: "Management",
    level: "Beginner",
  },
  {
    id: 6,
    title: "Effective Communication Skills",
    description: "Improve your workplace communication skills",
    duration: "4 hours",
    enrolled: 38,
    category: "Communication",
    level: "Beginner",
  },
];

export default function CoursesPage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Training Courses</h1>
        <div className="flex gap-3">
          <select className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none">
            <option>All Categories</option>
            <option>Leadership</option>
            <option>Technical</option>
            <option>Communication</option>
            <option>Management</option>
          </select>
          <select className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none">
            <option>All Levels</option>
            <option>Beginner</option>
            <option>Intermediate</option>
            <option>Advanced</option>
          </select>
        </div>
      </div>

      {/* Courses Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {courses.map((course) => (
          <div
            key={course.id}
            className="bg-white border border-slate-200 rounded-lg p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <BookOpen className="h-6 w-6 text-blue-600" />
              </div>
              <span className="px-2 py-1 bg-slate-100 text-slate-700 text-xs font-semibold rounded">
                {course.level}
              </span>
            </div>

            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              {course.title}
            </h3>
            <p className="text-sm text-slate-600 mb-4">{course.description}</p>

            <div className="flex items-center gap-4 text-sm text-slate-600 mb-4">
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{course.duration}</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                <span>{course.enrolled} enrolled</span>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200">
              <button className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition">
                <Play className="h-4 w-4" />
                Start Course
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
