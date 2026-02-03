import Link from "next/link";
import "../styles/globals.css";

export default function Home() {
  return (
    <div className="min-h-screen bg-linear-to-br from-slate-400 to-green-800">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-center px-4 py-24 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="mb-6 flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-green-500 text-2xl font-bold text-white">
              HR
            </div>
          </div>

          <h1 className="mb-4 text-5xl font-bold text-green-500 sm:text-6xl">
            Wing HR Suite
          </h1>

          <p className="mb-8 text-xl text-slate-300">
            Modern HR Management System for Growing Organizations
          </p>

          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/auth/login"
              className="inline-flex items-center justify-center rounded-full bg-white px-8 py-3 text-base font-semibold text-slate-900 transition hover:bg-slate-100"
            >
              Sign In
            </Link>

            <Link
              href="/auth/register"
              className="inline-flex items-center justify-center rounded-full border-2 border-white px-8 py-3 text-base font-semibold text-white transition hover:bg-white/10"
            >
              Get Started
            </Link>
          </div>
        </div>

        <div className="mt-20 grid gap-8 sm:grid-cols-3">
          <div className="rounded-xl border border-slate-700 bg-slate-800/50 p-6 backdrop-blur">
            <h3 className="mb-2 text-lg font-semibold text-white">
              Employee Management
            </h3>
            <p className="text-slate-400">
              Centralized employee database with profiles and documentation
            </p>
          </div>

          <div className="rounded-xl border border-slate-700 bg-slate-800/50 p-6 backdrop-blur">
            <h3 className="mb-2 text-lg font-semibold text-white">
              Attendance & Leave
            </h3>
            <p className="text-slate-400">
              Track attendance, manage leave requests, and approvals
            </p>
          </div>

          <div className="rounded-xl border border-slate-700 bg-slate-800/50 p-6 backdrop-blur">
            <h3 className="mb-2 text-lg font-semibold text-white">
              Payroll & Reports
            </h3>
            <p className="text-slate-400">
              Generate payroll and comprehensive HR reports effortlessly
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
