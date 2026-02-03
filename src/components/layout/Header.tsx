import Link from "next/link";

export default function Header() {
  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex w-full max-w-screen-2xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-sm font-semibold text-white">
            HR
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
              Wing HR Suite
            </p>
            <p className="text-lg font-semibold text-slate-900">Dashboard</p>
          </div>
        </div>

        <div className="hidden w-full max-w-md items-center rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-500 shadow-sm md:flex">
          <span className="text-slate-400">
            Search employees, reports, approvals...
          </span>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/profile"
            className="hidden rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:border-slate-300 hover:text-slate-900 md:inline-flex"
          >
            View profile
          </Link>
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
            aria-label="Open quick actions"
          >
            Quick actions
          </button>
        </div>
      </div>
    </header>
  );
}
