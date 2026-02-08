import "../../styles/globals.css";

export default function DashboardPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-600 mb-6">Dashboard</h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {/* Stats Cards */}
        <div className="rounded-lg bg-blue-50 p-6 border border-blue-100">
          <p className="text-sm font-medium text-blue-600">Total Employees</p>
          <p className="mt-2 text-3xl font-bold text-blue-900">248</p>
        </div>

        <div className="rounded-lg bg-green-50 p-6 border border-green-100">
          <p className="text-sm font-medium text-green-600">Present Today</p>
          <p className="mt-2 text-3xl font-bold text-green-900">235</p>
        </div>

        <div className="rounded-lg bg-orange-50 p-6 border border-orange-100">
          <p className="text-sm font-medium text-orange-600">
            Pending Requests
          </p>
          <p className="mt-2 text-3xl font-bold text-orange-900">12</p>
        </div>

        <div className="rounded-lg bg-purple-50 p-6 border border-purple-100">
          <p className="text-sm font-medium text-purple-600">On Leave</p>
          <p className="mt-2 text-3xl font-bold text-purple-900">13</p>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold text-gray-600 mb-4">
          Recent Activity
        </h2>
        <div>
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2">
              <div>
                <p className="font-medium text-slate-900">
                  New Employee Onboarded
                </p>
                <p className="text-sm text-slate-500">
                  John Doe joined the Engineering team
                </p>
              </div>
              <span className="text-xs text-slate-400">2 hours ago</span>
            </div>
            <div className="flex items-center justify-between py-2 border-t">
              <div>
                <p className="font-medium text-slate-900">
                  Leave Request Approved
                </p>
                <p className="text-sm text-slate-500">
                  Annual leave for Jane Smith
                </p>
              </div>
              <span className="text-xs text-slate-400">5 hours ago</span>
            </div>
            <div className="flex items-center justify-between py-2 border-t">
              <div>
                <p className="font-medium text-slate-900">
                  Attendance Report Generated
                </p>
                <p className="text-sm text-slate-500">
                  Monthly attendance for January 2026
                </p>
              </div>
              <span className="text-xs text-slate-400">1 day ago</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
