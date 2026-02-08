"use client";

import { useParams } from "next/navigation";

export default function UserDetailPage() {
  const params = useParams();

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 mb-6">User Details</h1>
      <p className="text-slate-600">User ID: {params.id}</p>
    </div>
  );
}
