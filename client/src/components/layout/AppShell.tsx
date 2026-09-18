import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import {
  Activity,
  ClipboardList,
  FileText,
  LayoutDashboard,
  LogOut,
  Settings,
  ShieldCheck,
  Stethoscope,
  UserCircle,
  Users,
} from "lucide-react";

type AppShellProps = {
  children: ReactNode;
  userRole?: "ADMIN" | "CLINIC_STAFF" | null;
  userName?: string;
};

export default function AppShell({
  children,
  userRole = null,
  userName = "Clinic Staff",
}: AppShellProps) {
  const navigate = useNavigate();

  async function handleLogout() {
    try {
      await fetch("http://localhost:4000/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      navigate("/login");
    } catch {
      // Keep the shell stable if logout request fails.
    }
  }

  return (
    <div className="min-h-screen bg-igcc-background text-slate-900">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-igcc-800 bg-igcc-900 text-white lg:flex">
        <div className="border-b border-white/10 px-6 py-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10">
              <Stethoscope size={21} strokeWidth={1.8} />
            </div>

            <div className="min-w-0">
              <p className="truncate text-sm font-bold">
                Ikeja Golf Club Clinic
              </p>
              <p className="mt-0.5 text-xs text-white/60">
                Clinic Management System
              </p>
            </div>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-5">
          <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-white/40">
            Main
          </p>

          <button
            onClick={() => navigate("/dashboard")}
            className="mb-1 flex w-full items-center gap-3 rounded-lg bg-white/10 px-3 py-2.5 text-left text-sm font-medium text-white transition hover:bg-white/15"
          >
            <LayoutDashboard size={18} strokeWidth={1.8} />
            Dashboard
          </button>

          <button
            onClick={() => navigate("/patients")}
            className="mb-1 flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm text-white/75 transition hover:bg-white/10 hover:text-white"
          >
            <Users size={18} strokeWidth={1.8} />
            Patients
          </button>

          <button
            onClick={() => navigate("/patients")}
            className="mb-1 flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm text-white/75 transition hover:bg-white/10 hover:text-white"
          >
            <ClipboardList size={18} strokeWidth={1.8} />
            New Visit
          </button>

          <button
            onClick={() => navigate("/account")}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm text-white/75 transition hover:bg-white/10 hover:text-white"
          >
            <UserCircle size={18} strokeWidth={1.8} />
            My Account
          </button>

          {userRole === "ADMIN" && (
            <div className="mt-7">
              <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-white/40">
                Administration
              </p>

              <button
                onClick={() => navigate("/admin/staff")}
                className="mb-1 flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm text-white/75 transition hover:bg-white/10 hover:text-white"
              >
                <ShieldCheck size={18} strokeWidth={1.8} />
                Staff Management
              </button>

              <button
                onClick={() => navigate("/admin/audit-logs")}
                className="mb-1 flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm text-white/75 transition hover:bg-white/10 hover:text-white"
              >
                <FileText size={18} strokeWidth={1.8} />
                Audit Logs
              </button>

              <button
                onClick={() => navigate("/admin/clinic-settings")}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm text-white/75 transition hover:bg-white/10 hover:text-white"
              >
                <Settings size={18} strokeWidth={1.8} />
                Clinic Settings
              </button>
            </div>
          )}
        </nav>

        <div className="border-t border-white/10 p-3">
          <div className="mb-2 flex items-center gap-3 rounded-lg px-3 py-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-igcc-700">
              <Activity size={17} />
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{userName}</p>
              <p className="text-xs text-white/50">
                {userRole === "ADMIN" ? "Administrator" : "Clinic Staff"}
              </p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm text-white/70 transition hover:bg-white/10 hover:text-white"
          >
            <LogOut size={18} strokeWidth={1.8} />
            Logout
          </button>
        </div>
      </aside>

      <div className="min-h-screen lg:pl-64">
        <header className="sticky top-0 z-30 border-b border-igcc-border bg-white/95 backdrop-blur">
          <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
            <div>
              <p className="text-sm font-semibold text-slate-900">
                Ikeja Golf Club Clinic
              </p>
              <p className="text-xs text-slate-500">
                Clinic Management System
              </p>
            </div>

            <button
              onClick={() => navigate("/account")}
              className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
            >
              <UserCircle size={20} />
              <span className="hidden sm:inline">{userName}</span>
            </button>
          </div>
        </header>

        <main className="px-4 py-6 sm:px-6 lg:px-8">
          <div className="mx-auto w-full max-w-7xl">{children}</div>
        </main>
      </div>

    </div>
  );
}

