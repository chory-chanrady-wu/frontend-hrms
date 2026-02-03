import Link from "next/link";

const navSections = [
  {
    title: "Overview",
    items: [
      { label: "Dashboard", href: "/dashboard" },
      { label: "Announcements", href: "/dashboard/announcements" },
      { label: "Reports", href: "/dashboard/reports" },
    ],
  },
  {
    title: "People",
    items: [
      { label: "Employees", href: "/dashboard/employees" },
      { label: "Departments", href: "/dashboard/departments" },
      { label: "Recruitment", href: "/dashboard/recruitment" },
    ],
  },
  {
    title: "Operations",
    items: [
      { label: "Attendance", href: "/dashboard/attendance" },
      { label: "Leave", href: "/dashboard/leave" },
      { label: "Payroll", href: "/dashboard/payroll" },
    ],
  },
  {
    title: "Growth",
    items: [
      { label: "Performance", href: "/dashboard/performance" },
      { label: "Training", href: "/dashboard/training" },
    ],
  },
  {
    title: "Admin",
    items: [
      { label: "Settings", href: "/dashboard/settings" },
      { label: "Roles", href: "/dashboard/settings/roles" },
      { label: "Users", href: "/dashboard/settings/users" },
    ],
  },
];

export default function Sidebar() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
          Navigation
        </p>
      </div>

      <nav className="space-y-6 text-sm">
        {navSections.map((section) => (
          <div key={section.title} className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
              {section.title}
            </p>
            <ul className="space-y-2">
              {section.items.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="flex items-center justify-between rounded-xl px-3 py-2 text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
                  >
                    <span>{item.label}</span>
                    <span className="text-xs text-slate-400">→</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>
    </div>
  );
}
