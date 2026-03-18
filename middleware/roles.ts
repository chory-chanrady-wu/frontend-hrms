import {
  LayoutDashboard,
  Megaphone,
  CalendarCheck,
  Building2,
  Users,
  FileText,
  CheckCircle,
  Wallet,
  Star,
  UserCircle,
  Briefcase,
  UserCheck,
  CalendarClock,
  BarChart3,
  Settings,
  Shield,
} from "lucide-react";

export const navSections = [
  {
    title: "Overview",
    items: [
      {
        label: "Dashboard",
        href: "/dashboard",
        icon: LayoutDashboard,
        permission: "dashboard:read",
      },
      {
        label: "Announcements",
        href: "/dashboard/announcements",
        icon: Megaphone,
        permission: "announcements:read",
      },
      {
        label: "Attendance",
        href: "/dashboard/attendance",
        icon: CalendarCheck,
        permission: "attendance:read",
      },
      {
        label: "Profile",
        href: "/dashboard/profile",
        icon: UserCircle,
        permission: "profile:read",
      },
    ],
  },
  {
    title: "People",
    items: [
      {
        label: "Employees",
        href: "/dashboard/employees",
        icon: Users,
        permission: "employees:read",
      },
      {
        label: "Departments",
        href: "/dashboard/departments",
        icon: Building2,
        permission: "departments:read",
      },
    ],
  },
  {
    title: "Operations",
    items: [
      {
        label: "My Requests",
        href: "/dashboard/leave",
        icon: FileText,
        permission: "leave:read",
      },
      {
        label: "Approvals",
        href: "/dashboard/leave/approvals",
        icon: CheckCircle,
        permission: "leave:approve",
      },
      {
        label: "Payroll",
        href: "/dashboard/payroll",
        icon: Wallet,
        permission: "payroll:read",
      },
    ],
  },
  {
    title: "Recruitment",
    items: [
      {
        label: "Recruitment",
        href: "/dashboard/recruitment",
        icon: Briefcase,
        permission: "recruitment:read",
      },
      {
        label: "Candidates",
        href: "/dashboard/recruitment/candidates",
        icon: UserCheck,
        permission: "candidates:read",
      },
      {
        label: "Interviews",
        href: "/dashboard/recruitment/interviews",
        icon: CalendarClock,
        permission: "interviews:read",
      },
    ],
  },
  {
    title: "Reports",
    items: [
      {
        label: "All Reports",
        href: "/dashboard/reports",
        icon: BarChart3,
        permission: "reports:read",
      },
      {
        label: "Attendance",
        href: "/dashboard/reports/attendance",
        icon: CalendarCheck,
        permission: "reports:read",
      },
      {
        label: "Payroll",
        href: "/dashboard/reports/payroll",
        icon: Wallet,
        permission: "reports:read",
      },
    ],
  },
  {
    title: "Admin",
    items: [
      {
        label: "Settings",
        href: "/dashboard/settings",
        icon: Settings,
        permission: "settings:read",
      },
      {
        label: "Roles",
        href: "/dashboard/settings/roles",
        icon: Shield,
        permission: "roles:read",
      },
      {
        label: "Users",
        href: "/dashboard/settings/users",
        icon: Users,
        permission: "users:read",
      },
    ],
  },
];
export const adminAllowed = navSections.flatMap((s) => s.items.map((i) => i.href));
export const hrAllowed = [
  "/dashboard",
  "/dashboard/attendance",
  "/dashboard/profile",
  "/dashboard/leave",
  "/dashboard/payroll",
  "/dashboard/employees",
  "/dashboard/departments",
  "/dashboard/recruitment",
  "/dashboard/recruitment/candidates",
  "/dashboard/recruitment/interviews",
  "/dashboard/reports",
];
export const managerAllowed = [
  "/dashboard/attendance",
  "/dashboard/profile",
  "/dashboard/leave",
  "/dashboard/payroll",
  "/dashboard/employees",
  "/dashboard/leave/approvals",
];
export const employeeAllowed = [
  "/dashboard/attendance",
  "/dashboard/profile",
  "/dashboard/leave",
  "/dashboard/payroll",
];