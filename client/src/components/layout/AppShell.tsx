import { apiUrl } from "../../api";
import { useEffect, useState, type ReactNode } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Activity,
  FileText,
  LayoutDashboard,
  LogOut,
  Menu,
  Settings,
  ShieldCheck,
  UserCircle,
  Users,
  X,
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
  const location = useLocation();

  const isActive = (path: string) =>
    location.pathname === path || location.pathname.startsWith(path + "/");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

async function loadAvatar() {
  try {
    const response = await fetch(apiUrl("/api/users/me/avatar"), {
      credentials: "include",
    });

    if (response.status === 404) {
      setAvatarUrl(null);
      return;
    }

    if (!response.ok) {
      return;
    }

    const blob = await response.blob();
    const nextUrl = URL.createObjectURL(blob);

    setAvatarUrl((currentUrl) => {
      if (currentUrl) {
        URL.revokeObjectURL(currentUrl);
      }

      return nextUrl;
    });
  } catch {
    setAvatarUrl(null);
  }
}

useEffect(() => {
  void loadAvatar();

  const handleAvatarUpdated = () => {
    void loadAvatar();
  };

  window.addEventListener("igcc:avatar-updated", handleAvatarUpdated);

  return () => {
    window.removeEventListener("igcc:avatar-updated", handleAvatarUpdated);
  };
}, []);

  async function handleLogout() {
    try {
      await fetch(apiUrl("/api/auth/logout"), {
        method: "POST",
        credentials: "include",
      });

      navigate("/login");
    } catch {
      // Keep the shell stable if logout request fails.
    }
  }

  function navigateAndClose(path: string) {
    setMobileMenuOpen(false);
    navigate(path);
  }

  return (
    <div className="min-h-screen bg-igcc-background text-slate-900">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-white/10 bg-igcc-900/90 text-white shadow-[8px_0_30px_rgba(15,23,42,0.12)] backdrop-blur-2xl lg:flex">
        <div className="border-b border-white/10 px-6 py-6">
          <div className="flex items-center justify-center px-4 py-5">
            <img
              src="/igcc-logo.png"
              alt="Ikeja Golf Club Clinic"
              className="h-14 w-auto object-contain"
            />
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-5">
          <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-white/40">
            Main
          </p>

          <button
            onClick={() => navigate("/dashboard")}
            className={`mb-1 flex w-52 items-center gap-3 rounded-xl px-4 py-2.5 text-left whitespace-nowrap text-sm font-medium text-white transition hover:bg-white/15 ${isActive("/dashboard") ? "bg-white/[0.07] shadow-[inset_0_1px_0_rgba(255,255,255,0.10),inset_0_-1px_0_rgba(255,255,255,0.03)] backdrop-blur-md" : ""}`}
          >
            <LayoutDashboard size={18} strokeWidth={1.8} />
            Dashboard
          </button>

          <button
            onClick={() => navigate("/patients")}
            className={`mb-1 flex w-52 items-center gap-3 rounded-xl px-4 py-2.5 text-left whitespace-nowrap text-sm font-medium transition hover:bg-white/10 hover:text-white ${isActive("/patients") ? "border border-white/15 bg-white/10 text-white shadow-[0_4px_16px_rgba(255,255,255,0.06)] backdrop-blur-md" : "text-white/75"}`}
          >
            <Users size={18} strokeWidth={1.8} />
            Patients
          </button>

          <button
            onClick={() => navigate("/account")}
            className={`flex w-52 items-center gap-3 rounded-xl px-4 py-2.5 text-left whitespace-nowrap text-sm font-medium transition hover:bg-white/10 hover:text-white ${isActive("/account") ? "border border-white/15 bg-white/10 text-white shadow-[0_4px_16px_rgba(255,255,255,0.06)] backdrop-blur-md" : "text-white/75"}`}
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
                className={`mb-1 flex w-52 items-center gap-3 rounded-xl px-4 py-2.5 text-left whitespace-nowrap text-sm font-medium transition hover:bg-white/10 hover:text-white ${isActive("/admin/staff") ? "border border-white/15 bg-white/10 text-white shadow-[0_4px_16px_rgba(255,255,255,0.06)] backdrop-blur-md" : "text-white/75"}`}
              >
                <ShieldCheck size={18} strokeWidth={1.8} />
                Staff Management
              </button>

              <button
                onClick={() => navigate("/admin/audit-logs")}
                className={`mb-1 flex w-52 items-center gap-3 rounded-xl px-4 py-2.5 text-left whitespace-nowrap text-sm font-medium transition hover:bg-white/10 hover:text-white ${isActive("/admin/audit-logs") ? "border border-white/15 bg-white/10 text-white shadow-[0_4px_16px_rgba(255,255,255,0.06)] backdrop-blur-md" : "text-white/75"}`}
              >
                <FileText size={18} strokeWidth={1.8} />
                Audit Logs
              </button>

              <button
                onClick={() => navigate("/admin/clinic-settings")}
                className={`flex w-52 items-center gap-3 rounded-xl px-4 py-2.5 text-left whitespace-nowrap text-sm font-medium transition hover:bg-white/10 hover:text-white ${isActive("/admin/clinic-settings") ? "border border-white/15 bg-white/10 text-white shadow-[0_4px_16px_rgba(255,255,255,0.06)] backdrop-blur-md" : "text-white/75"}`}
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
            className="flex w-52 items-center gap-3 rounded-xl px-4 py-2.5 text-left text-sm text-white/70 transition hover:bg-white/10 hover:text-white"
          >
            <LogOut size={18} strokeWidth={1.8} />
            Logout
          </button>
        </div>
      </aside>

      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 max-w-[85vw] flex-col border-r border-white/10 bg-igcc-900/90 text-white shadow-2xl backdrop-blur-2xl transition-transform duration-200 lg:hidden ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-5">
          <img
            src="/igcc-logo.png"
            alt="Ikeja Golf Club Clinic"
            className="h-12 w-auto object-contain"
          />

          <button
            onClick={() => setMobileMenuOpen(false)}
            aria-label="Close navigation menu"
            className="rounded-lg p-2 text-white/70 transition hover:bg-white/10 hover:text-white"
          >
            <X size={22} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-5">
          <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-white/40">
            Main
          </p>

          <button
            onClick={() => navigateAndClose("/dashboard")}
            className={`mb-1 flex w-52 items-center gap-3 rounded-xl px-4 py-3 text-left whitespace-nowrap text-sm font-medium text-white transition hover:bg-white/15 ${isActive("/dashboard") ? "bg-white/[0.07] shadow-[inset_0_1px_0_rgba(255,255,255,0.10),inset_0_-1px_0_rgba(255,255,255,0.03)] backdrop-blur-md" : ""}`}
          >
            <LayoutDashboard size={18} strokeWidth={1.8} />
            Dashboard
          </button>

          <button
            onClick={() => navigateAndClose("/patients")}
            className={`mb-1 flex w-52 items-center gap-3 rounded-xl px-4 py-3 text-left whitespace-nowrap text-sm font-medium transition hover:bg-white/10 hover:text-white ${isActive("/patients") ? "border border-white/15 bg-white/10 text-white shadow-[0_4px_16px_rgba(255,255,255,0.06)] backdrop-blur-md" : "text-white/75"}`}
          >
            <Users size={18} strokeWidth={1.8} />
            Patients
          </button>

          <button
            onClick={() => navigateAndClose("/account")}
            className={`flex w-52 items-center gap-3 rounded-xl px-4 py-3 text-left whitespace-nowrap text-sm font-medium transition hover:bg-white/10 hover:text-white ${isActive("/account") ? "border border-white/15 bg-white/10 text-white shadow-[0_4px_16px_rgba(255,255,255,0.06)] backdrop-blur-md" : "text-white/75"}`}
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
                onClick={() => navigateAndClose("/admin/staff")}
                className={`mb-1 flex w-52 items-center gap-3 rounded-xl px-4 py-3 text-left whitespace-nowrap text-sm font-medium transition hover:bg-white/10 hover:text-white ${isActive("/admin/staff") ? "border border-white/15 bg-white/10 text-white shadow-[0_4px_16px_rgba(255,255,255,0.06)] backdrop-blur-md" : "text-white/75"}`}
              >
                <ShieldCheck size={18} strokeWidth={1.8} />
                Staff Management
              </button>

              <button
                onClick={() => navigateAndClose("/admin/audit-logs")}
                className={`mb-1 flex w-52 items-center gap-3 rounded-xl px-4 py-3 text-left whitespace-nowrap text-sm font-medium transition hover:bg-white/10 hover:text-white ${isActive("/admin/audit-logs") ? "border border-white/15 bg-white/10 text-white shadow-[0_4px_16px_rgba(255,255,255,0.06)] backdrop-blur-md" : "text-white/75"}`}
              >
                <FileText size={18} strokeWidth={1.8} />
                Audit Logs
              </button>

              <button
                onClick={() => navigateAndClose("/admin/clinic-settings")}
                className={`flex w-52 items-center gap-3 rounded-xl px-4 py-3 text-left whitespace-nowrap text-sm font-medium transition hover:bg-white/10 hover:text-white ${isActive("/admin/clinic-settings") ? "border border-white/15 bg-white/10 text-white shadow-[0_4px_16px_rgba(255,255,255,0.06)] backdrop-blur-md" : "text-white/75"}`}
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
            className="flex w-52 items-center gap-3 rounded-xl px-4 py-3 text-left text-sm text-white/70 transition hover:bg-white/10 hover:text-white"
          >
            <LogOut size={18} strokeWidth={1.8} />
            Logout
          </button>
        </div>
      </aside>

      <div className="min-h-screen lg:pl-64">
        <header className="sticky top-0 z-30 border-b border-igcc-border bg-white/95 backdrop-blur">
          <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMobileMenuOpen(true)}
                aria-label="Open navigation menu"
                className="rounded-lg p-2 text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 lg:hidden"
              >
                <Menu size={23} />
              </button>

              <div>
                <p className="text-sm font-semibold text-slate-900">
                  Ikeja Golf Club Clinic
                </p>
                <p className="text-xs text-slate-500">
                  Clinic Management System
                </p>
              </div>
            </div>

            <button
              onClick={() => navigate("/account")}
              className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
            >
              {avatarUrl ? (
  <img
    src={avatarUrl}
    alt="Profile"
    className="h-8 w-8 rounded-full object-cover"
  />
) : (
  <UserCircle size={20} />
)}
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



