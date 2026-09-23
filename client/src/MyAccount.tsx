import { apiUrl } from "./api";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle2,
  KeyRound,
  Mail,
  Pencil,
  ShieldCheck,
  User,
  UserCircle,
} from "lucide-react";

import AppShell from "./components/layout/AppShell";

type User = {
  userId: string;
  displayId: string;
  fullName: string;
  username: string;
  email?: string | null;
  role: "ADMIN" | "CLINIC_STAFF";
  status: "ACTIVE" | "INACTIVE";
};

export default function MyAccount() {
  const navigate = useNavigate();

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadAccount() {
      try {
        const response = await fetch(
          apiUrl("/api/users/me"),
          {
            credentials: "include",
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.error || "Could not load account."
          );
        }

        setUser(data.user);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Could not load account."
        );
      } finally {
        setLoading(false);
      }
    }

    loadAccount();
  }, []);

  if (loading) {
    return (
      <AppShell>
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="text-sm text-slate-500">
            Loading account...
          </div>
        </div>
      </AppShell>
    );
  }

  if (!user) {
    return (
      <AppShell>
        <div className="space-y-6">
          <div className="rounded-xl border border-red-200 bg-red-50 p-6">
            <p className="text-sm font-medium text-red-700">
              {error || "Could not load account."}
            </p>

            <button
              type="button"
              onClick={() => navigate("/dashboard")}
              className="mt-5 inline-flex items-center gap-2 rounded-lg bg-igcc-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-igcc-800"
            >
              <ArrowLeft size={16} strokeWidth={1.8} />
              Back to Dashboard
            </button>
          </div>
        </div>
      </AppShell>
    );
  }

  const roleLabel =
    user.role === "ADMIN" ? "Administrator" : "Clinic Staff";

  const isActive = user.status === "ACTIVE";

  return (
    <AppShell
      userRole={user.role}
      userName={user.fullName}
    >
      <div className="space-y-6">
        {/* Header */}
        <div>
          <button
            type="button"
            onClick={() => navigate("/dashboard")}
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-igcc-700"
          >
            <ArrowLeft size={17} />
            Back to Dashboard
          </button>

          <div className="mt-4 flex items-center gap-3 sm:mt-5">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-igcc-900 text-white shadow-sm">
              <UserCircle size={23} strokeWidth={1.8} />
            </div>

            <div>
              <h1 className="text-2xl font-bold leading-tight tracking-tight text-slate-900 sm:text-3xl">
                My Account
              </h1>

              <p className="mt-0.5 text-sm leading-5 text-slate-500 sm:leading-6">
                Manage your personal information and account settings.
              </p>
            </div>
          </div>
        </div>

        {/* Account Information */}
        <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-4 py-4 sm:px-6 sm:py-5">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
                <User size={18} strokeWidth={1.8} />
              </div>

              <div>
                <h2 className="text-base font-semibold text-slate-900">
                  Account Information
                </h2>

                <p className="mt-0.5 text-xs text-slate-500">
                  Your staff account details
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-x-10 gap-y-5 px-4 py-5 sm:grid-cols-2 sm:gap-y-7 sm:px-6 sm:py-6">
            <div>
              <p className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-slate-400 sm:mb-1.5 sm:text-xs">
                Full Name
              </p>

              <p className="text-base font-semibold text-slate-900 sm:text-sm">
                {user.fullName}
              </p>
            </div>

            <div>
              <p className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-slate-400 sm:mb-1.5 sm:text-xs">
                Username
              </p>

              <p className="text-base font-semibold text-slate-900 sm:text-sm">
                {user.username}
              </p>
            </div>

            <div>
              <p className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-slate-400 sm:mb-1.5 sm:text-xs">
                Staff ID
              </p>

              <p className="text-base font-semibold text-slate-900 sm:text-sm">
                {user.displayId}
              </p>
            </div>

            <div>
              <p className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-slate-400 sm:mb-1.5 sm:text-xs">
                Role
              </p>

              <div className="flex items-center gap-2">
                <ShieldCheck
                  size={16}
                  strokeWidth={1.8}
                  className="text-slate-400"
                />

                <p className="text-base font-semibold text-slate-900 sm:text-sm">
                  {roleLabel}
                </p>
              </div>
            </div>

            <div>
              <p className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-slate-400 sm:mb-1.5 sm:text-xs">
                Email
              </p>

              <div className="flex items-center gap-2">
                <Mail
                  size={15}
                  strokeWidth={1.8}
                  className="text-slate-400"
                />

                <p className="text-base font-semibold text-slate-900 sm:text-sm">
                  {user.email || "Not provided"}
                </p>
              </div>
            </div>

            <div>
              <p className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-slate-400 sm:mb-1.5 sm:text-xs">
                Account Status
              </p>

              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
                  isActive
                    ? "bg-emerald-50 text-emerald-700"
                    : "bg-slate-100 text-slate-600"
                }`}
              >
                <CheckCircle2 size={14} strokeWidth={2} />
                {user.status}
              </span>
            </div>
          </div>
        </section>

        {/* Account Actions */}
        <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-4 py-4 sm:px-6 sm:py-5">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
                <ShieldCheck size={18} strokeWidth={1.8} />
              </div>

              <div>
                <h2 className="text-base font-semibold text-slate-900">
                  Account Actions
                </h2>

                <p className="mt-0.5 text-xs text-slate-500">
                  Update your profile or security settings
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 px-4 py-4 sm:flex-row sm:px-6 sm:py-5">
            <button
              type="button"
              onClick={() => navigate("/account/edit")}
              className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-igcc-900 px-4 py-3 text-sm font-semibold text-white sm:w-auto sm:py-2.5 shadow-sm transition hover:bg-igcc-800"
            >
              <Pencil size={16} strokeWidth={1.8} />
              Edit Profile
            </button>

            <button
              type="button"
              onClick={() =>
                navigate("/account/change-password")
              }
              className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700 sm:w-auto sm:py-2.5 transition hover:bg-slate-50"
            >
              <KeyRound size={16} strokeWidth={1.8} />
              Change Password
            </button>
          </div>
        </section>
      </div>
    </AppShell>
  );
}
