import { apiUrl } from "./api";
import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  Eye,
  EyeOff,
  KeyRound,
} from "lucide-react";

export default function ChangePassword() {
  const navigate = useNavigate();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    setMessage("");
    setError("");

    if (!currentPassword || !newPassword || !confirmPassword) {
      setError("Please complete all password fields.");
      return;
    }

    if (newPassword.length < 8) {
      setError("New password must be at least 8 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("New passwords do not match.");
      return;
    }

    setSaving(true);

    try {
      const response = await fetch(
        apiUrl("/api/users/me/change-password"),
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            currentPassword,
            newPassword,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Could not change password."
        );
      }

      setMessage("Password changed successfully.");

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      setTimeout(() => {
        navigate("/account");
      }, 1000);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Could not change password."
      );
    } finally {
      setSaving(false);
    }
  }

  return (
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
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-white/80 bg-white/75 text-igcc-700 shadow-[0_8px_24px_rgba(15,23,42,0.06)] backdrop-blur-xl">
            <KeyRound size={22} strokeWidth={1.8} />
          </div>

          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Change Password
            </h1>

            <p className="mt-0.5 text-sm text-slate-500">
              Update your account password securely.
            </p>
          </div>
        </div>
      </div>

      {/* Password Form */}
      <section className="group relative overflow-hidden rounded-2xl border border-white/70 bg-white/65 shadow-[0_10px_35px_rgba(15,23,42,0.08)] backdrop-blur-2xl">
        <div className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-igcc-200/25 blur-3xl transition-all duration-300 group-hover:bg-igcc-200/40" />
        {/* Section Header */}
        <div className="border-b border-white/70 bg-white/35 px-4 py-4 backdrop-blur-xl sm:px-6 sm:py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/80 bg-white/70 text-slate-700 shadow-sm backdrop-blur-sm">
              <KeyRound size={18} strokeWidth={1.8} />
            </div>

            <div>
              <h2 className="text-base font-semibold text-slate-900">
                Password Security
              </h2>

              <p className="mt-0.5 text-xs text-slate-500">
                Choose a new password for your account
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="px-4 py-5 sm:px-6 sm:py-7">
            {/* Error Message */}
            {error && (
              <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-200/80 bg-red-50/75 px-4 py-3 text-sm text-red-700 shadow-sm backdrop-blur-sm">
                <AlertCircle
                  size={17}
                  strokeWidth={1.8}
                  className="mt-0.5 shrink-0"
                />
                <p>{error}</p>
              </div>
            )}

            {/* Success Message */}
            {message && (
              <div className="mb-6 flex items-start gap-3 rounded-xl border border-emerald-200/80 bg-emerald-50/75 px-4 py-3 text-sm text-emerald-700 shadow-sm backdrop-blur-sm">
                <CheckCircle2
                  size={17}
                  strokeWidth={1.8}
                  className="mt-0.5 shrink-0"
                />
                <p>{message}</p>
              </div>
            )}

            <div className="max-w-2xl space-y-6">
              {/* Current Password */}
              <div>
                <label
                  htmlFor="currentPassword"
                  className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500"
                >
                  Current Password
                </label>

                <div className="relative">
                  <input
                    id="currentPassword"
                    type={showCurrent ? "text" : "password"}
                    value={currentPassword}
                    onChange={(event) =>
                      setCurrentPassword(event.target.value)
                    }
                    autoComplete="current-password"
                    className="w-full rounded-xl border border-white/80 bg-white/75 px-3.5 py-3 pr-11 text-sm text-slate-900 shadow-[0_2px_8px_rgba(15,23,42,0.07)] outline-none backdrop-blur-sm transition placeholder:text-slate-400 focus:border-igcc-700 focus:bg-white focus:ring-2 focus:ring-igcc-700/10"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowCurrent((value) => !value)
                    }
                    className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-slate-400 transition hover:bg-white/80 hover:text-slate-700"
                    aria-label={
                      showCurrent
                        ? "Hide current password"
                        : "Show current password"
                    }
                  >
                    {showCurrent ? (
                      <EyeOff size={17} />
                    ) : (
                      <Eye size={17} />
                    )}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div>
                <label
                  htmlFor="newPassword"
                  className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500"
                >
                  New Password
                </label>

                <div className="relative">
                  <input
                    id="newPassword"
                    type={showNew ? "text" : "password"}
                    value={newPassword}
                    onChange={(event) =>
                      setNewPassword(event.target.value)
                    }
                    autoComplete="new-password"
                    className="w-full rounded-xl border border-white/80 bg-white/75 px-3.5 py-3 pr-11 text-sm text-slate-900 shadow-[0_2px_8px_rgba(15,23,42,0.07)] outline-none backdrop-blur-sm transition placeholder:text-slate-400 focus:border-igcc-700 focus:bg-white focus:ring-2 focus:ring-igcc-700/10"
                  />

                  <button
                    type="button"
                    onClick={() => setShowNew((value) => !value)}
                    className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-slate-400 transition hover:bg-white/80 hover:text-slate-700"
                    aria-label={
                      showNew
                        ? "Hide new password"
                        : "Show new password"
                    }
                  >
                    {showNew ? (
                      <EyeOff size={17} />
                    ) : (
                      <Eye size={17} />
                    )}
                  </button>
                </div>

                <p className="mt-1.5 text-xs text-slate-400">
                  Minimum 8 characters.
                </p>
              </div>

              {/* Confirm New Password */}
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500"
                >
                  Confirm New Password
                </label>

                <div className="relative">
                  <input
                    id="confirmPassword"
                    type={showConfirm ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(event) =>
                      setConfirmPassword(event.target.value)
                    }
                    autoComplete="new-password"
                    className="w-full rounded-xl border border-white/80 bg-white/75 px-3.5 py-3 pr-11 text-sm text-slate-900 shadow-[0_2px_8px_rgba(15,23,42,0.07)] outline-none backdrop-blur-sm transition placeholder:text-slate-400 focus:border-igcc-700 focus:bg-white focus:ring-2 focus:ring-igcc-700/10"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirm((value) => !value)
                    }
                    className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-slate-400 transition hover:bg-white/80 hover:text-slate-700"
                    aria-label={
                      showConfirm
                        ? "Hide confirmation password"
                        : "Show confirmation password"
                    }
                  >
                    {showConfirm ? (
                      <EyeOff size={17} />
                    ) : (
                      <Eye size={17} />
                    )}
                  </button>
                </div>
              </div>
            </div>
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
              <KeyRound size={16} strokeWidth={1.8} />
              {saving ? "Changing..." : "Change Password"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}