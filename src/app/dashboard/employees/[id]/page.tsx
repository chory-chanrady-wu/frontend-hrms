"use client";

import { useParams } from "next/navigation";

export default function EmployeeDetailPage() {
  const params = useParams();
  const employeeId = params.id;

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 mb-6">
        Employee Details
      </h1>
      <p className="text-slate-600">Employee ID: {employeeId}</p>
    </div>
  );
}
