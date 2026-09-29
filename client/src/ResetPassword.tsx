import React, { useState } from "react";
import {
  ArrowLeft,
  Eye,
  EyeOff,
  KeyRound,
} from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { apiUrl } from "./api";

function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token")?.trim() || "";

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!token) {
      setError("This password reset link is invalid.");
      return;
    }

    if (newPassword.length < 8) {
      setError("New password must be at least 8 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(apiUrl("/api/auth/reset-password"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
          newPassword,
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.error || "Could not reset your password.");
      }

      setSuccess(
        data.message || "Password reset successfully. Please log in."
      );
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Could not reset your password."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-igcc-background px-4 py-8 sm:px-6 sm:py-10">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-md items-center">
        <div className="w-full">
          <div className="mb-6 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-white/80 bg-white/75 text-igcc-700 shadow-[0_8px_24px_rgba(15,23,42,0.06)] backdrop-blur-xl">
              <KeyRound size={22} strokeWidth={1.8} />
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Reset Password
            </h1>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Choose a new password for your IGCC account.
            </p>
          </div>

          <div className="group relative overflow-hidden rounded-2xl border border-white/70 bg-white/65 p-5 shadow-[0_10px_35px_rgba(15,23,42,0.08)] backdrop-blur-2xl sm:p-8">
          <div className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-igcc-200/25 blur-3xl transition-all duration-300 group-hover:bg-igcc-200/40" />
            {success ? (
              <>
                <div
                  className="rounded-xl border border-igcc-200/70 bg-igcc-50/75 px-4 py-4 text-sm leading-6 text-igcc-800 shadow-sm backdrop-blur-sm"
                  role="status"
                >
                  {success}
                </div>

                <button
                  type="button"
                  onClick={() => navigate("/login")}
                  className="mt-5 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-igcc-700 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-igcc-800 sm:py-2.5"
                >
                  Go to Login
                </button>
              </>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                {!token && (
                  <div
                    className="rounded-xl border border-red-200/80 bg-red-50/75 px-4 py-3 text-sm text-red-700 shadow-sm backdrop-blur-sm"
                    role="alert"
                  >
                    This password reset link is invalid or incomplete.
                  </div>
                )}

                <div>
                  <label
                    htmlFor="reset-password"
                    className="mb-2 block text-sm font-medium text-slate-700"
                  >
                    New Password
                  </label>

                  <div className="relative">
                    <KeyRound
                      size={17}
                      strokeWidth={1.8}
                      className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      id="reset-password"
                      type={showPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(event) =>
                        setNewPassword(event.target.value)
                      }
                      placeholder="Enter your new password"
                      autoComplete="new-password"
                      minLength={8}
                      required
                      disabled={!token}
                      className="w-full rounded-xl border border-slate-300/70 bg-white/90 py-3 pl-10 pr-11 text-sm text-slate-900 shadow-[0_1px_2px_rgba(15,23,42,0.04),0_3px_10px_rgba(15,23,42,0.06)] outline-none backdrop-blur-sm transition placeholder:text-slate-500 focus:border-igcc-700 focus:bg-white focus:ring-2 focus:ring-igcc-700/10 disabled:cursor-not-allowed disabled:bg-slate-100/70 sm:py-2.5"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword((current) => !current)
                      }
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                      disabled={!token}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-600 disabled:cursor-not-allowed"
                    >
                      {showPassword ? (
                        <EyeOff size={17} />
                      ) : (
                        <Eye size={17} />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="reset-confirm-password"
                    className="mb-2 block text-sm font-medium text-slate-700"
                  >
                    Confirm New Password
                  </label>

                  <div className="relative">
                    <KeyRound
                      size={17}
                      strokeWidth={1.8}
                      className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      id="reset-confirm-password"
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(event) =>
                        setConfirmPassword(event.target.value)
                      }
                      placeholder="Confirm your new password"
                      autoComplete="new-password"
                      minLength={8}
                      required
                      disabled={!token}
                      className="w-full rounded-xl border border-slate-300/70 bg-white/90 py-3 pl-10 pr-11 text-sm text-slate-900 shadow-[0_1px_2px_rgba(15,23,42,0.04),0_3px_10px_rgba(15,23,42,0.06)] outline-none backdrop-blur-sm transition placeholder:text-slate-500 focus:border-igcc-700 focus:bg-white focus:ring-2 focus:ring-igcc-700/10 disabled:cursor-not-allowed disabled:bg-slate-100/70 sm:py-2.5"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(
                          (current) => !current
                        )
                      }
                      aria-label={
                        showConfirmPassword
                          ? "Hide password confirmation"
                          : "Show password confirmation"
                      }
                      disabled={!token}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-600 disabled:cursor-not-allowed"
                    >
                      {showConfirmPassword ? (
                        <EyeOff size={17} />
                      ) : (
                        <Eye size={17} />
                      )}
                    </button>
                  </div>
                </div>

                {error && (
                  <div
                    className="rounded-xl border border-red-200/80 bg-red-50/75 px-4 py-3 text-sm text-red-700 shadow-sm backdrop-blur-sm"
                    role="alert"
                  >
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading || !token}
                  className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-igcc-700 px-4 py-3 text-sm font-semibold text-white shadow-[0_8px_20px_rgba(31,107,79,0.18)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-igcc-800 hover:shadow-[0_10px_24px_rgba(31,107,79,0.24)] disabled:cursor-not-allowed disabled:bg-slate-400 disabled:shadow-none sm:py-2.5"
                >
                  <KeyRound size={17} strokeWidth={1.8} />
                  {loading ? "Resetting..." : "Reset Password"}
                </button>
              </form>
            )}

            <button
              type="button"
              onClick={() => navigate("/login")}
              className="mt-5 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg border border-white/80 bg-white/70 px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm backdrop-blur-sm transition hover:bg-white hover:text-igcc-700 sm:py-2.5"
            >
              <ArrowLeft size={17} strokeWidth={1.8} />
              Back to Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;