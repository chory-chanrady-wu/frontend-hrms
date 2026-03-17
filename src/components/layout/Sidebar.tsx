"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { hasPermission } from "@/lib/permissions";
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
  ChevronDown,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const navSections = [
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
      {
        label: "Performance",
        href: "/dashboard/reports/performance",
        icon: Star,
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

export default function SidebarNavigation() {
  const pathname = usePathname();
  const auth = useAuth();
  // Use roleName from user object if available
  const userRole = auth?.user?.roleName || auth?.user?.role || "";
  // Parse permissions if stringified
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    Overview: false,
    People: false,
    Operations: false,
    Recruitment: false,
    Reports: false,
    Admin: false,
  });
  // Always use permissions from localStorage if available
  let permissions = [];
  let userPermissionsRaw = null;
  if (typeof window !== "undefined") {
    userPermissionsRaw = localStorage.getItem("permissions");
  }
  if (userPermissionsRaw) {
    try {
      permissions = JSON.parse(userPermissionsRaw);
    } catch {
      permissions = [];
    }
  }

  const loading = auth?.loading ?? true;
  // EMPLOYEE allowed routes
  const employeeAllowed = [
    "/dashboard/attendance",
    "/dashboard/profile",
    "/dashboard/leave",
    "/dashboard/payroll",
  ];
  // Robust EMPLOYEE role/permission check (case-insensitive)
  const isEmployee =
    userRole.toLowerCase() === "employee" ||
    (Array.isArray(permissions) &&
      permissions.some((p: string) => p.toLowerCase().includes("employee"))) ||
    (typeof permissions === "string" &&
      permissions.toLowerCase().includes("employee"));
  // Find the most specific matching route across all sections
  const allItems = navSections.flatMap((s) => s.items);
  const bestMatch = allItems
    .filter(
      (navItem) =>
        pathname === navItem.href || pathname.startsWith(navItem.href + "/"),
    )
    .reduce(
      (longest, current) =>
        current.href.length > (longest?.href.length || 0) ? current : longest,
      null as (typeof allItems)[0] | null,
    );
  if (loading) {
    return null;
  }
  return (
    <Sidebar className="border-0 bg-linear-to-b from-[#0C4A6E] to-[#075985]">
      <SidebarContent className="gap-0">
        {/* Logo */}
        <div className="px-4 py-6">
          <h1 className="text-2xl font-bold text-white tracking-wide text-center">
            HRMS
          </h1>
        </div>

        {/* Navigation Groups */}
        {isEmployee ? (
          <SidebarGroup className="py-0.5 gap-0 mt-1">
            <SidebarMenu className="gap-1">
              {navSections
                .flatMap((section) => section.items)
                .filter((item) =>
                  [
                    "/dashboard/attendance",
                    "/dashboard/profile",
                    "/dashboard/leave",
                    "/dashboard/payroll",
                  ].includes(item.href),
                )
                .map((item) => {
                  const Icon = item.icon;
                  const isActive = bestMatch?.href === item.href;
                  return (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton
                        asChild
                        isActive={isActive}
                        className="cursor-pointer text-white/70 hover:text-white hover:bg-white/10 data-[active=true]:bg-white/10 data-[active=true]:text-white data-[active=true]:font-medium h-9"
                      >
                        <Link
                          href={item.href}
                          className="flex items-center gap-2"
                        >
                          <Icon className="h-5 w-5" />
                          <span className="text-sm">{item.label}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
            </SidebarMenu>
          </SidebarGroup>
        ) : (
          navSections.map((section) => {
            let visibleItems = section.items.filter((item) =>
              hasPermission(permissions, item.permission),
            );
            if (visibleItems.length === 0) return null;
            return (
              <SidebarGroup key={section.title} className="py-0.5 gap-0 mt-1">
                {/* Section Label Trigger */}
                <button
                  onClick={() =>
                    setOpenSections((prev) => {
                      const newState = Object.fromEntries(
                        Object.keys(prev).map((key) => [key, false]),
                      );
                      return {
                        ...newState,
                        [section.title]: !prev[section.title],
                      };
                    })
                  }
                  className="flex rounded-md w-full items-center justify-between px-2 py-2 text-xs font-semibold uppercase tracking-widest bg-white/80 text-black transition-colors hover:text-white hover:bg-white/20 mb-1"
                >
                  {section.title}
                  <ChevronDown
                    className={`h-4 w-4 transition-transform duration-200 ${openSections[section.title] ? "rotate-180" : ""}`}
                  />
                </button>
                {openSections[section.title] && (
                  <SidebarMenu className="gap-1">
                    {visibleItems.map((item) => {
                      const Icon = item.icon;
                      const isActive = bestMatch?.href === item.href;
                      return (
                        <SidebarMenuItem key={item.href}>
                          <SidebarMenuButton
                            asChild
                            isActive={isActive}
                            className="cursor-pointer text-white/70 hover:text-white hover:bg-white/10 data-[active=true]:bg-white/10 data-[active=true]:text-white data-[active=true]:font-medium h-9"
                          >
                            <Link
                              href={item.href}
                              className="flex items-center gap-2"
                            >
                              <Icon className="h-5 w-5" />
                              <span className="text-sm">{item.label}</span>
                            </Link>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      );
                    })}
                  </SidebarMenu>
                )}
              </SidebarGroup>
            );
          })
        )}
      </SidebarContent>
    </Sidebar>
  );
}
