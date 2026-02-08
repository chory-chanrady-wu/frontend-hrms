"use client";

import { useParams } from "next/navigation";

export default function RoleDetailPage() {
  const params = useParams();

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Role Details</h1>
      <p className="text-slate-600">Role ID: {params.id}</p>
    </div>
  );
}
