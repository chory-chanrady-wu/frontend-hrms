"use client";

import { Settings as SettingsIcon, Shield, Users, Bell } from "lucide-react";
import Link from "next/link";

const settingsCategories = [
  {
    id: 1,
    title: "Roles & Permissions",
    description: "Manage user roles and access permissions",
    href: "/dashboard/settings/roles",
    icon: Shield,
  },
  {
    id: 2,
    title: "User Management",
    description: "Add, edit, or remove system users",
    href: "/dashboard/settings/users",
    icon: Users,
  },
  {
    id: 3,
    title: "Notifications",
    description: "Configure email and system notifications",
    href: "#",
    icon: Bell,
  },
  {
    id: 4,
    title: "System Settings",
    description: "General application settings and preferences",
    href: "/dashboard/settings/system",
    icon: SettingsIcon,
  },
];

export default function SettingsPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-6">
        Settings
      </h1>

      <div className="grid gap-6 md:grid-cols-2">
        {settingsCategories.map((category) => {
          const Icon = category.icon;
          return (
            <Link
              key={category.id}
              href={category.href}
              className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-6 hover:shadow-lg transition-all"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <Icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
                    {category.title}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {category.description}
                  </p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
