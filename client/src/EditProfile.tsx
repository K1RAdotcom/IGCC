import { apiUrl } from "./api";
import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle2,
  Mail,
  Pencil,
  User,
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

export default function EditProfile() {
  const navigate = useNavigate();

  const [user, setUser] = useState<User | null>(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

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
          throw new Error(data.error || "Could not load account.");
        }

        setUser(data.user);
        setFullName(data.user.fullName || "");
        setEmail(data.user.email || "");
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

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!fullName.trim()) {
      setError("Full name is required.");
      return;
    }

    setSaving(true);

    try {
      const response = await fetch(
        apiUrl("/api/users/me"),
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            fullName,
            email,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Could not update profile."
        );
      }

      setUser(data.user);
      setFullName(data.user.fullName || "");
      setEmail(data.user.email || "");
      setSuccess("Profile updated successfully.");

      setTimeout(() => {
        navigate("/account");
      }, 800);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Could not update profile."
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <AppShell>
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="text-sm text-slate-500">
            Loading profile...
          </div>
        </div>
      </AppShell>
    );
  }

  if (!user) {
    return (
      <AppShell>
        <div className="mx-auto max-w-4xl px-6 py-10">
          <div className="rounded-xl border border-red-200 bg-red-50 p-6">
            <p className="text-sm font-medium text-red-600">
              {error || "Could not load profile."}
            </p>

            <button
              type="button"
              onClick={() => navigate("/account")}
              className="mt-5 inline-flex items-center gap-2 rounded-lg bg-igcc-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-igcc-800"
            >
              <ArrowLeft size={16} />
              Back to My Account
            </button>
          </div>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell
      userRole={user.role}
      userName={user.fullName}
    >
      <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
      {/* Page Header */}
      <div className="mb-7">
        <button
          type="button"
          onClick={() => navigate("/account")}
          disabled={saving}
          className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <ArrowLeft size={16} />
          Back to My Account
        </button>

        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-igcc-900 text-white shadow-sm">
            <Pencil size={21} strokeWidth={1.8} />
          </div>

          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Edit Profile
            </h1>

            <p className="mt-0.5 text-sm text-slate-500">
              Update your personal account information.
            </p>
          </div>
        </div>
      </div>

      {/* Profile Form */}
      <form
        onSubmit={handleSubmit}
        className="group relative overflow-hidden rounded-2xl border border-white/70 bg-white/65 shadow-[0_10px_35px_rgba(15,23,42,0.08)] backdrop-blur-2xl"
      >
        {/* Form Header */}
        <div className="border-b border-white/70 bg-white/35 px-4 py-4 backdrop-blur-xl sm:px-6 sm:py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
              <User size={18} strokeWidth={1.8} />
            </div>

            <div>
              <h2 className="text-base font-semibold text-slate-900">
                Personal Information
              </h2>

              <p className="mt-0.5 text-xs text-slate-500">
                Update the information associated with your account
              </p>
            </div>
          </div>
        </div>

        <div className="px-4 py-5 sm:px-6 sm:py-7">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {/* Full Name */}
            <div className="sm:col-span-2">
              <label
                htmlFor="fullName"
                className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500"
              >
                Full Name <span className="text-red-500">*</span>
              </label>

              <input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(event) =>
                  setFullName(event.target.value)
                }
                required
                className="w-full rounded-xl border border-slate-300/70 bg-white/90 px-3.5 py-3 text-sm text-slate-900 shadow-[0_1px_2px_rgba(15,23,42,0.04),0_3px_10px_rgba(15,23,42,0.06)] outline-none backdrop-blur-sm transition placeholder:text-slate-500 focus:border-igcc-700 focus:bg-white focus:ring-2 focus:ring-igcc-700/10"
              />
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500"
              >
                Email
              </label>

              <div className="relative">
                <Mail
                  size={16}
                  strokeWidth={1.8}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(event) =>
                    setEmail(event.target.value)
                  }
                  placeholder="Enter email address"
                  className="w-full rounded-xl border border-slate-300/70 bg-white/90 py-3 pl-9 pr-3.5 text-sm text-slate-900 shadow-[0_1px_2px_rgba(15,23,42,0.04),0_3px_10px_rgba(15,23,42,0.06)] outline-none backdrop-blur-sm transition placeholder:text-slate-500 focus:border-igcc-700 focus:bg-white focus:ring-2 focus:ring-igcc-700/10"
                />
              </div>
            </div>

            {/* Username */}
            <div>
              <label
                htmlFor="username"
                className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500"
              >
                Username
              </label>

              <input
                id="username"
                type="text"
                value={user.username}
                disabled
                className="w-full cursor-not-allowed rounded-xl border border-white/70 bg-slate-50/70 px-3.5 py-3 text-sm text-slate-500 shadow-sm backdrop-blur-sm"
              />

              <p className="mt-1.5 text-xs text-slate-400">
                Username cannot be changed here.
              </p>
            </div>

            {/* Staff ID */}
            <div>
              <label
                htmlFor="staffId"
                className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500"
              >
                Staff ID
              </label>

              <input
                id="staffId"
                type="text"
                value={user.displayId}
                disabled
                className="w-full cursor-not-allowed rounded-xl border border-white/70 bg-slate-50/70 px-3.5 py-3 text-sm text-slate-500 shadow-sm backdrop-blur-sm"
              />

              <p className="mt-1.5 text-xs text-slate-400">
                Staff ID is assigned by the system.
              </p>
            </div>
          </div>

          {/* Messages */}
          {error && (
            <div className="mt-6 flex items-start gap-3 rounded-xl border border-red-200/80 bg-red-50/75 px-4 py-3 shadow-sm text-sm text-red-700 backdrop-blur-sm">
              <div className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-red-500" />
              <p>{error}</p>
            </div>
          )}

          {success && (
            <div className="mt-6 flex items-start gap-3 rounded-xl border border-emerald-200/80 bg-emerald-50/75 px-4 py-3 shadow-sm text-sm text-emerald-700 backdrop-blur-sm">
              <CheckCircle2
                size={17}
                strokeWidth={1.8}
                className="mt-0.5 shrink-0"
              />
              <p>{success}</p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-col-reverse gap-3 border-t border-white/70 bg-white/35 px-4 py-4 backdrop-blur-xl sm:flex-row sm:justify-end sm:px-6 sm:py-5">
          <button
            type="button"
            onClick={() => navigate("/account")}
            disabled={saving}
            className="inline-flex min-h-11 w-full items-center justify-center rounded-lg border border-white/80 bg-white/70 px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm backdrop-blur-sm transition hover:bg-white hover:text-igcc-700 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={saving}
            className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-igcc-700 px-4 py-2.5 text-sm font-semibold text-white shadow-[0_8px_20px_rgba(31,107,79,0.18)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-igcc-800 hover:shadow-[0_10px_24px_rgba(31,107,79,0.24)] disabled:cursor-not-allowed disabled:bg-slate-400 disabled:shadow-none sm:w-auto"
          >
            {saving ? (
              "Saving..."
            ) : (
              <>
                <CheckCircle2 size={16} strokeWidth={1.8} />
                Save Changes
              </>
            )}
          </button>
        </div>
      </form>
      </div>
    </AppShell>
  );
}