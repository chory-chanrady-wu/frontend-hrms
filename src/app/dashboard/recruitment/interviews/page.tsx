"use client";

const interviews = [
  {
    id: 1,
    candidateName: "Maria Garcia",
    position: "Marketing Manager",
    interviewer: "John Doe",
    date: "2026-02-12",
    time: "10:00 AM",
    location: "Conference Room A",
    status: "Scheduled",
  },
  {
    id: 2,
    candidateName: "Alex Thompson",
    position: "Senior Software Engineer",
    interviewer: "Jane Smith",
    date: "2026-02-14",
    time: "2:00 PM",
    location: "Conference Room B",
    status: "Scheduled",
  },
];

export default function InterviewsPage() {
  // Get user role from localStorage
  let userRole = "";
  const storedUser =
    typeof window !== "undefined" ? localStorage.getItem("user") : null;
  if (storedUser) {
    try {
      const userObj = JSON.parse(storedUser);
      userRole = userObj.role || userObj.roleName || userObj.permission || "";
    } catch {}
  }

  // Only allow admin and hr to view dashboard
  if (userRole.toLowerCase() !== "admin" && userRole.toLowerCase() !== "hr") {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <h1 className="text-2xl font-semibold text-red-600 mb-4">
          Not Authorized
        </h1>
        <p className="text-lg text-gray-600">
          You do not have access to the dashboard.
        </p>
      </div>
    );
  }
  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 mb-6">
        Scheduled Interviews
      </h1>

      <div className="space-y-4">
        {interviews.map((interview) => (
          <div
            key={interview.id}
            className="bg-white border border-slate-200 rounded-lg p-6"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-slate-900 mb-1">
                  {interview.candidateName}
                </h3>
                <p className="text-sm text-slate-600 mb-4">
                  {interview.position}
                </p>

                <div className="grid gap-4 md:grid-cols-3">
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">
                      Interviewer
                    </p>
                    <p className="text-sm font-medium text-slate-900">
                      {interview.interviewer}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">
                      Date & Time
                    </p>
                    <p className="text-sm font-medium text-slate-900">
                      {new Date(interview.date).toLocaleDateString()} at{" "}
                      {interview.time}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">
                      Location
                    </p>
                    <p className="text-sm font-medium text-slate-900">
                      {interview.location}
                    </p>
                  </div>
                </div>
              </div>

              <span className="inline-flex px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                {interview.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
