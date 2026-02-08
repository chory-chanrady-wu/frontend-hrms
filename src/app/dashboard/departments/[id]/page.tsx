"use client";

import { useParams } from "next/navigation";

export default function DepartmentDetailPage() {
  const params = useParams();
  const departmentId = params.id;

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 mb-6">
        Department Details
      </h1>
      <p className="text-slate-600">Department ID: {departmentId}</p>
    </div>
  );
}
