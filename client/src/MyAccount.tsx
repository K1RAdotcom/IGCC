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
          "http://localhost:4000/api/users/me",
          {
            credentials: "include",
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Could not load account.");
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
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-sm text-slate-500">
          Loading account...
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
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
    );
  }

  const roleLabel =
    user.role === "ADMIN" ? "Administrator" : "Clinic Staff";

  const isActive = user.status === "ACTIVE";

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="space-y-6">
        <button
          type="button"
          onClick={() => navigate("/dashboard")}
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-igcc-700"
        >
          <ArrowLeft size={17} />
          Back to Dashboard
        </button>

        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-igcc-900 text-white shadow-sm">
            <UserCircle size={23} strokeWidth={1.8} />
          </div>

          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              My Account
            </h1>

            <p className="mt-0.5 text-sm text-slate-500">
              Manage your personal information and account settings.
            </p>
          </div>
        </div>
      </div>

      {/* Account Information */}
      <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-6 py-5">
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

        <div className="grid grid-cols-1 gap-x-10 gap-y-7 px-6 py-6 sm:grid-cols-2">
          <div>
            <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-slate-400">
              Full Name
            </p>
            <p className="text-sm font-semibold text-slate-900">
              {user.fullName}
            </p>
          </div>

          <div>
            <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-slate-400">
              Username
            </p>
            <p className="text-sm font-semibold text-slate-900">
              {user.username}
            </p>
          </div>

          <div>
            <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-slate-400">
              Staff ID
            </p>
            <p className="text-sm font-semibold text-slate-900">
              {user.displayId}
            </p>
          </div>

          <div>
            <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-slate-400">
              Role
            </p>

            <div className="flex items-center gap-2">
              <ShieldCheck
                size={16}
                strokeWidth={1.8}
                className="text-slate-400"
              />

              <p className="text-sm font-semibold text-slate-900">
                {roleLabel}
              </p>
            </div>
          </div>

          <div>
            <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-slate-400">
              Email
            </p>

            <div className="flex items-center gap-2">
              <Mail
                size={15}
                strokeWidth={1.8}
                className="text-slate-400"
              />

              <p className="text-sm font-semibold text-slate-900">
                {user.email || "Not provided"}
              </p>
            </div>
          </div>

          <div>
            <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-slate-400">
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
      <section className="mt-5 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-6 py-5">
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

        <div className="flex flex-col gap-3 px-6 py-5 sm:flex-row">
          <button
            type="button"
            onClick={() => navigate("/account/edit")}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-igcc-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-igcc-800"
          >
            <Pencil size={16} strokeWidth={1.8} />
            Edit Profile
          </button>

          <button
            type="button"
            onClick={() =>
              navigate("/account/change-password")
            }
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            <KeyRound size={16} strokeWidth={1.8} />
            Change Password
          </button>
        </div>
      </section>
    </div>
  );
}

