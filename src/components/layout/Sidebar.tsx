"use client";

import { hrAllowed, managerAllowed, employeeAllowed,adminAllowed,navSections } from "@/middleware/roles";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { ChevronDown } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

export default function SidebarNavigation() {
  const pathname = usePathname();
  const auth = useAuth();
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    Overview: false,
    People: false,
    Operations: false,
    Recruitment: false,
    Reports: false,
    Admin: false,
  });
  let userRole = "";
  if (typeof window !== "undefined") {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const userObj = JSON.parse(storedUser);
        if (userObj.roleName && typeof userObj.roleName === "string") {
          userRole = userObj.roleName.toLowerCase().trim();
        } else if (
          userObj.permissions &&
          typeof userObj.permissions === "string"
        ) {
          userRole = userObj.permissions.toLowerCase().trim();
        }
      } catch {}
    }
  }
  if (!userRole && auth?.user) {
    userRole =
      auth.user.roleName?.toLowerCase().trim() ||
      (typeof auth.user.permissions === "string"
        ? auth.user.permissions.toLowerCase().trim()
        : "");
  }
  if (!userRole) userRole = "employee"; // fallback
  let allowedRoutes: string[] = [];
  if (userRole === "admin") {
    allowedRoutes = adminAllowed;
  } else if (userRole === "hr") {
    allowedRoutes = hrAllowed;
  } else if (userRole === "manager") {
    allowedRoutes = managerAllowed;
  } else if (userRole === "employee") {
    allowedRoutes = employeeAllowed;
  } else {
    allowedRoutes = employeeAllowed; // fallback
  }

  const loading = auth?.loading ?? true;

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
        {userRole === "admin" ? (
          navSections.map((section) => {
            const visibleItems = section.items.filter((item) =>
              allowedRoutes.includes(item.href),
            );
            if (visibleItems.length === 0) return null;
            return (
              <SidebarGroup key={section.title} className="py-0.5 gap-0 mt-1">
                <button
                  onClick={() =>
                    setOpenSections((prev) => ({
                      ...prev,
                      [section.title]: !prev[section.title],
                    }))
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
        ) : (
          <SidebarGroup className="py-0.5 gap-0 mt-1">
            <SidebarMenu className="gap-1">
              {navSections
                .flatMap((section) => section.items)
                .filter((item) => allowedRoutes.includes(item.href))
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
        )}
      </SidebarContent>
    </Sidebar>
  );
}
