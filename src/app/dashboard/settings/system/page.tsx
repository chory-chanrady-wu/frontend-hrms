"use client";

import { ArrowLeft, Sun, Moon, Monitor } from "lucide-react";
import Link from "next/link";
import { useTheme } from "@/src/components/ThemeProvider";

const themes = [
  {
    value: "light" as const,
    label: "Light",
    description: "Use a light background with dark text",
    icon: Sun,
  },
  {
    value: "dark" as const,
    label: "Dark",
    description: "Use a dark background with light text",
    icon: Moon,
  },
  {
    value: "system" as const,
    label: "System",
    description: "Automatically match your operating system setting",
    icon: Monitor,
  },
];

export default function SystemSettingsPage() {
  const { theme, setTheme } = useTheme();

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <Link
          href="/dashboard/settings"
          className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition"
        >
          <ArrowLeft className="h-5 w-5 text-slate-600 dark:text-slate-300" />
        </Link>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
          System Settings
        </h1>
      </div>

      <div className="max-w-2xl space-y-8">
        {/* Appearance */}
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-1">
            Appearance
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
            Choose how the application looks to you. Select a single theme or
            sync with your system.
          </p>

          <div className="grid gap-4 sm:grid-cols-3">
            {themes.map((t) => {
              const Icon = t.icon;
              const selected = theme === t.value;
              return (
                <button
                  key={t.value}
                  onClick={() => setTheme(t.value)}
                  className={`flex flex-col items-center gap-3 p-5 rounded-lg border-2 transition cursor-pointer ${
                    selected
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-900/30"
                      : "border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-500"
                  }`}
                >
                  <div
                    className={`p-3 rounded-full ${
                      selected
                        ? "bg-blue-100 dark:bg-blue-800"
                        : "bg-slate-100 dark:bg-slate-700"
                    }`}
                  >
                    <Icon
                      className={`h-6 w-6 ${
                        selected
                          ? "text-blue-600 dark:text-blue-400"
                          : "text-slate-500 dark:text-slate-400"
                      }`}
                    />
                  </div>
                  <div className="text-center">
                    <p
                      className={`text-sm font-semibold ${
                        selected
                          ? "text-blue-700 dark:text-blue-300"
                          : "text-slate-700 dark:text-slate-300"
                      }`}
                    >
                      {t.label}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      {t.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
