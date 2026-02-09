import type { ReactNode } from "react";

import Header from "./Header";
import Sidebar from "./Sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

type DashboardLayoutProps = {
  children: ReactNode;
};

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-slate-50 text-slate-900">
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
