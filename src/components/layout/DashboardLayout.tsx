import type { DashboardLayoutProps } from "@/lib/types";

import Header from "./Header";
import Sidebar from "./Sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-slate-50 text-slate-900 dark:bg-slate-900 dark:text-slate-100">
        <Sidebar />
        <SidebarInset>
          <Header />
          <div>
            <main className="px-6 py-2">{children}</main>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
