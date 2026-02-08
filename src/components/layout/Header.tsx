import { Input } from "@/components/ui/input";
import { Bell } from "lucide-react";

export default function Header() {
  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex w-full max-w-screen-2xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4 flex-1">
          <Input
            type="text"
            placeholder="Search employees, reports, approvals..."
            className="h-11 w-96 rounded-md border-gray-200 px-4 focus-visible:ring-2 focus-visible:ring-[#0C4A6E] focus-visible:ring-offset-0"
          />
          <div className="flex items-center gap-4">
            {/* search button */}
            <button className="px-8 py-2 bg-linear-to-b from-[#0369A1] to-[#0369A1] hover:from-[#0B5D8F] hover:to-[#0C4A6E] rounded-lg text-white transition-all duration-200 hover:shadow-lg">
              Search
            </button>
          </div>
        </div>
        {/* Notifications */}
        <button className="relative inline-flex h-10 w-10 items-center justify-center rounded-full hover:bg-slate-100 transition mr-3">
          <Bell className="h-6 w-6 text-slate-600" />
          <span className="absolute top-1 right-1 inline-flex h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
        </button>
        {/* User Profile Section */}
        <div className="flex items-center gap-4">
          <img
            src="../assets/image.png"
            alt="User Avatar"
            className="h-10 w-10 rounded-full object-cover"
          />
          <div className="flex flex-col">
            <span className="text-sm font-medium text-slate-900">Admin</span>
            <span className="text-xs text-slate-500">Administrator</span>
          </div>
        </div>
      </div>
    </header>
  );
}
