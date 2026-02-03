import type { ReactNode } from "react";

import Header from "./Header";
import Sidebar from "./Sidebar";

type DashboardLayoutProps = {
  children: ReactNode;
};

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Header />
      <div className="mx-auto flex w-full max-w-screen-2xl gap-6 px-4 pb-10 pt-6 sm:px-6 lg:px-8">
        <aside className="hidden w-64 shrink-0 md:block">
          <Sidebar />
        </aside>
        <main className="flex-1 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          {children}
        </main>
      </div>
    </div>
  );
}
