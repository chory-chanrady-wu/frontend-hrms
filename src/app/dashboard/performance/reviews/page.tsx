"use client";

import { ArrowLeft, Star } from "lucide-react";
import Link from "next/link";

const reviews = [
  {
    id: 1,
    employeeName: "John Doe",
    reviewerName: "Jane Manager",
    date: "2025-12-15",
    rating: 4.5,
    feedback:
      "Exceptional performance in Q4. Delivered all projects on time with high quality.",
  },
  {
    id: 2,
    employeeName: "Jane Smith",
    reviewerName: "Mike Director",
    date: "2025-12-10",
    rating: 4.2,
    feedback: "Strong team player with excellent communication skills.",
  },
];

export default function ReviewsPage() {
  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <Link
          href="/dashboard/performance"
          className="p-2 hover:bg-slate-100 rounded-lg transition"
        >
          <ArrowLeft className="h-5 w-5 text-slate-600" />
        </Link>
        <h1 className="text-2xl font-bold text-slate-900">
          Performance Reviews
        </h1>
      </div>

      <div className="space-y-4">
        {reviews.map((review) => (
          <div
            key={review.id}
            className="bg-white border border-slate-200 rounded-lg p-6"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">
                  {review.employeeName}
                </h3>
                <p className="text-sm text-slate-600">
                  Reviewed by {review.reviewerName} on{" "}
                  {new Date(review.date).toLocaleDateString()}
                </p>
              </div>
              <div className="flex items-center gap-1">
                <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                <span className="text-lg font-semibold text-slate-900">
                  {review.rating}
                </span>
              </div>
            </div>
            <p className="text-slate-700">{review.feedback}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
