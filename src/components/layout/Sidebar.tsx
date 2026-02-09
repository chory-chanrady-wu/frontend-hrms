"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
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
  ClipboardList,
  Settings,
  Shield,
  GraduationCap,
  BookOpen,
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
      { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
      {
        label: "Announcements",
        href: "/dashboard/announcements",
        icon: Megaphone,
      },
      {
        label: "Attendance",
        href: "/dashboard/attendance",
        icon: CalendarCheck,
      },
      { label: "Profile", href: "/dashboard/profile", icon: UserCircle },
    ],
  },
  {
    title: "People",
    items: [
      { label: "Employees", href: "/dashboard/employees", icon: Users },
      { label: "Departments", href: "/dashboard/departments", icon: Building2 },
    ],
  },
  {
    title: "Operations",
    items: [
      { label: "My Requests", href: "/dashboard/leave", icon: FileText },
      {
        label: "Approvals",
        href: "/dashboard/leave/approvals",
        icon: CheckCircle,
      },
      { label: "Payroll", href: "/dashboard/payroll", icon: Wallet },
    ],
  },
  {
    title: "Growth",
    items: [
      { label: "Performance", href: "/dashboard/performance", icon: Star },
      {
        label: "Reviews",
        href: "/dashboard/performance/reviews",
        icon: ClipboardList,
      },
      { label: "Training", href: "/dashboard/training", icon: GraduationCap },
      { label: "Courses", href: "/dashboard/training/courses", icon: BookOpen },
    ],
  },
  {
    title: "Recruitment",
    items: [
      { label: "Recruitment", href: "/dashboard/recruitment", icon: Briefcase },
      {
        label: "Candidates",
        href: "/dashboard/recruitment/candidates",
        icon: UserCheck,
      },
      {
        label: "Interviews",
        href: "/dashboard/recruitment/interviews",
        icon: CalendarClock,
      },
    ],
  },
  {
    title: "Reports",
    items: [
      { label: "All Reports", href: "/dashboard/reports", icon: BarChart3 },
      {
        label: "Attendance",
        href: "/dashboard/reports/attendance",
        icon: CalendarCheck,
      },
      { label: "Payroll", href: "/dashboard/reports/payroll", icon: Wallet },
      {
        label: "Performance",
        href: "/dashboard/reports/performance",
        icon: Star,
      },
    ],
  },
  {
    title: "Admin",
    items: [
      { label: "Settings", href: "/dashboard/settings", icon: Settings },
      { label: "Roles", href: "/dashboard/settings/roles", icon: Shield },
      { label: "Users", href: "/dashboard/settings/users", icon: Users },
    ],
  },
];

export default function SidebarNavigation() {
  const pathname = usePathname();
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    Overview: true,
    People: false,
    Operations: false,
    Growth: false,
    Recruitment: false,
    Reports: false,
    Admin: false,
  });

  const toggleSection = (sectionTitle: string) => {
    setOpenSections((prev) => {
      if (prev[sectionTitle]) {
        return { ...prev, [sectionTitle]: false };
      } else {
        const newState: Record<string, boolean> = {};
        Object.keys(prev).forEach((key) => {
          newState[key] = key === sectionTitle;
        });
        return newState;
      }
    });
  };

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
        {navSections.map((section) => (
          <SidebarGroup key={section.title} className="py-0.5 gap-0 mt-1">
            {/* Section Label Trigger */}
            <button
              onClick={() => toggleSection(section.title)}
              className="flex rounded-md w-full items-center justify-between px-2 py-2 text-xs font-semibold uppercase tracking-widest bg-white/80 text-black transition-colors hover:text-white hover:bg-white/20 mb-1"
            >
              {section.title}
              <ChevronDown
                className={`h-4 w-4 transition-transform duration-200 ${
                  openSections[section.title] ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* Section Menu Items */}
            {openSections[section.title] && (
              <SidebarMenu className="gap-1">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = bestMatch?.href === item.href;

                  return (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton
                        asChild
                        isActive={isActive}
                        className="text-white/70 hover:text-white hover:bg-white/10 data-[active=true]:bg-white/10 data-[active=true]:text-white data-[active=true]:font-medium h-9"
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
        ))}
      </SidebarContent>
    </Sidebar>
  );
}
