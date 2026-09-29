import { apiUrl } from "./api";
import { useEffect, useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import {
  AlertCircle,
  Eye,
  EyeOff,
  ArrowLeft,
  CheckCircle2,
  KeyRound,
  Mail,
  ShieldCheck,
  User,
  UserPlus,
} from "lucide-react";

function Register() {
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [role, setRole] = useState("CLINIC_STAFF");

  const [adminAvailable, setAdminAvailable] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checkingStatus, setCheckingStatus] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    async function checkRegistrationStatus() {
      try {
        const response = await fetch(
          apiUrl("/api/auth/registration-status")
        );

        const data = await response.json();

        if (response.ok) {
          setAdminAvailable(Boolean(data.adminAvailable));
        }
      } catch {
        setError("Unable to connect to the clinic server.");
      } finally {
        setCheckingStatus(false);
      }
    }

    checkRegistrationStatus();
  }, []);

  async function handleRegister(event: FormEvent) {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    if (role === "ADMIN" && !adminAvailable) {
      setError("An Administrator account already exists.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        apiUrl("/api/auth/register"),
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            fullName,
            username,
            email,
            password,
            confirmPassword,
            role,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Could not create account.");
        return;
      }

      setSuccess("Account created successfully. Redirecting to Login...");

      setTimeout(() => {
        navigate("/login");
      }, 1200);
    } catch {
      setError("Unable to connect to the clinic server.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-igcc-background px-4 py-8 sm:px-6">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-xl items-center justify-center">
        <div className="group relative w-full overflow-hidden rounded-2xl border border-white/70 bg-white/65 shadow-[0_10px_35px_rgba(15,23,42,0.08)] backdrop-blur-2xl">
          <div className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-igcc-200/25 blur-3xl transition-all duration-300 group-hover:bg-igcc-200/40" />

          <div className="p-6 sm:p-8">
            {/* Header */}
            <div className="mb-7">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-igcc-50 text-igcc-700">
                  <UserPlus size={23} strokeWidth={1.8} />
                </div>

                <div>
                  <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                    Create Account
                  </h1>

                  <p className="mt-0.5 text-sm text-slate-500">
                    Ikeja Golf Club Clinic
                  </p>
                </div>
              </div>

              <p className="mt-4 text-sm leading-6 text-slate-500">
                Create a new clinic staff or administrator account.
              </p>
            </div>

            {/* Messages */}
            {error && (
              <div className="mb-5 flex items-start gap-3 rounded-xl border border-red-200/80 bg-red-50/75 px-4 py-3 shadow-sm text-sm text-red-700 backdrop-blur-sm">
                <AlertCircle
                  size={18}
                  strokeWidth={1.8}
                  className="mt-0.5 shrink-0"
                />

                <p>{error}</p>
              </div>
            )}

            {success && (
              <div className="mb-5 flex items-start gap-3 rounded-xl border border-emerald-200/80 bg-emerald-50/75 px-4 py-3 shadow-sm text-sm text-emerald-700 backdrop-blur-sm">
                <CheckCircle2
                  size={18}
                  strokeWidth={1.8}
                  className="mt-0.5 shrink-0"
                />

                <p>{success}</p>
              </div>
            )}

            <form onSubmit={handleRegister} className="space-y-4 sm:space-y-5">
              {/* Full Name */}
              <div>
                <label
                  htmlFor="fullName"
                  className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500"
                >
                  Full Name
                </label>

                <div className="relative">
                  <User
                    size={16}
                    strokeWidth={1.8}
                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    id="fullName"
                    type="text"
                    value={fullName}
                    onChange={(event) =>
                      setFullName(event.target.value)
                    }
                    required
                    className="w-full rounded-xl border border-white/80 bg-white/75 py-3 pl-9 pr-11 text-sm text-slate-900 shadow-[0_2px_8px_rgba(15,23,42,0.07)] sm:py-2.5 outline-none backdrop-blur-sm transition placeholder:text-slate-400 focus:border-igcc-700 focus:bg-white focus:ring-2 focus:ring-igcc-700/10"
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

                <div className="relative">
                  <User
                    size={16}
                    strokeWidth={1.8}
                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(event) =>
                      setUsername(event.target.value)
                    }
                    required
                    className="w-full rounded-xl border border-white/80 bg-white/75 py-3 pl-9 pr-11 text-sm text-slate-900 shadow-[0_2px_8px_rgba(15,23,42,0.07)] sm:py-2.5 outline-none backdrop-blur-sm transition placeholder:text-slate-400 focus:border-igcc-700 focus:bg-white focus:ring-2 focus:ring-igcc-700/10"
                  />
                </div>
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
                    className="w-full rounded-xl border border-white/80 bg-white/75 py-3 pl-9 pr-11 text-sm text-slate-900 shadow-[0_2px_8px_rgba(15,23,42,0.07)] sm:py-2.5 outline-none backdrop-blur-sm transition placeholder:text-slate-400 focus:border-igcc-700 focus:bg-white focus:ring-2 focus:ring-igcc-700/10"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500"
                >
                  Password
                </label>

                <div className="relative">
                  <KeyRound
                    size={16}
                    strokeWidth={1.8}
                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(event) =>
                      setPassword(event.target.value)
                    }
                    required
                    minLength={8}
                    className="w-full rounded-xl border border-white/80 bg-white/75 py-3 pl-9 pr-11 text-sm text-slate-900 shadow-[0_2px_8px_rgba(15,23,42,0.07)] sm:py-2.5 outline-none backdrop-blur-sm transition placeholder:text-slate-400 focus:border-igcc-700 focus:bg-white focus:ring-2 focus:ring-igcc-700/10"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((current) => !current)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500"
                >
                  Confirm Password
                </label>

                <div className="relative">
                  <KeyRound
                    size={16}
                    strokeWidth={1.8}
                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(event) =>
                      setConfirmPassword(event.target.value)
                    }
                    required
                    minLength={8}
                    className="w-full rounded-xl border border-white/80 bg-white/75 py-3 pl-9 pr-11 text-sm text-slate-900 shadow-[0_2px_8px_rgba(15,23,42,0.07)] sm:py-2.5 outline-none backdrop-blur-sm transition placeholder:text-slate-400 focus:border-igcc-700 focus:bg-white focus:ring-2 focus:ring-igcc-700/10"
                  />

                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((current) => !current)}
                    aria-label={showConfirmPassword ? "Hide password confirmation" : "Show password confirmation"}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-600"
                  >
                    {showConfirmPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </div>
              </div>

              {/* Account Type */}
              <div>
                <label
                  htmlFor="role"
                  className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500"
                >
                  Account Type
                </label>

                <div className="relative">
                  <ShieldCheck
                    size={16}
                    strokeWidth={1.8}
                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <select
                    id="role"
                    value={role}
                    onChange={(event) =>
                      setRole(event.target.value)
                    }
                    disabled={checkingStatus}
                    className="w-full appearance-none rounded-xl border border-white/80 bg-white/75 py-3 pl-9 pr-3.5 text-sm text-slate-900 shadow-[0_2px_8px_rgba(15,23,42,0.07)] outline-none backdrop-blur-sm transition focus:border-igcc-700 focus:bg-white sm:py-2.5 focus:ring-2 focus:ring-igcc-700/10 disabled:cursor-not-allowed disabled:bg-slate-100/70"
                  >
                    <option value="CLINIC_STAFF">
                      Clinic Staff
                    </option>

                    {adminAvailable && (
                      <option value="ADMIN">
                        Administrator
                      </option>
                    )}
                  </select>
                </div>

                {!checkingStatus && !adminAvailable && (
                  <p className="mt-1.5 text-xs leading-5 text-slate-400">
                    Administrator registration is unavailable because an Administrator account already exists.
                  </p>
                )}
              </div>

              {/* Actions */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading || checkingStatus}
                  className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-igcc-700 px-4 py-3 text-sm font-semibold sm:py-2.5 text-white shadow-[0_8px_20px_rgba(31,107,79,0.18)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-igcc-800 hover:shadow-[0_10px_24px_rgba(31,107,79,0.24)] disabled:cursor-not-allowed disabled:bg-slate-400 disabled:shadow-none"
                >
                  <UserPlus size={17} strokeWidth={1.8} />
                  {loading
                    ? "Creating Account..."
                    : "Create Account"}
                </button>

                <button
                  type="button"
                  onClick={() => navigate("/login")}
                  disabled={loading}
                  className="mt-3 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg border border-white/80 bg-white/70 px-4 py-3 text-sm font-semibold sm:py-2.5 text-slate-700 shadow-sm backdrop-blur-sm transition hover:bg-white hover:text-igcc-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <ArrowLeft size={16} strokeWidth={1.8} />
                  Back to Login
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;