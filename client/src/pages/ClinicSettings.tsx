import { apiUrl } from "../api";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AlertCircle,
  ArrowLeft,
  Building2,
  CheckCircle2,
  Image,
  Mail,
  MapPin,
  Phone,
  Save,
} from "lucide-react";

import AppShell from "../components/layout/AppShell";

type ClinicSettingsData = {
  clinicName: string;
  address: string;
  phone: string;
  email: string;
  logo: string;
};

export default function ClinicSettings() {
  const navigate = useNavigate();

  const [settings, setSettings] = useState<ClinicSettingsData>({
    clinicName: "",
    address: "",
    phone: "",
    email: "",
    logo: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    loadSettings();
  }, []);

  async function loadSettings() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        apiUrl("/api/clinic-settings"),
        {
          credentials: "include",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Could not load clinic settings."
        );
      }

      if (data.settings) {
        setSettings({
          clinicName: data.settings.clinicName || "",
          address: data.settings.address || "",
          phone: data.settings.phone || "",
          email: data.settings.email || "",
          logo: data.settings.logo || "",
        });
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Could not load clinic settings."
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    try {
      setSaving(true);
      setMessage("");
      setError("");

      const response = await fetch(
        apiUrl("/api/clinic-settings"),
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(settings),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Could not update clinic settings."
        );
      }

      setMessage("Clinic settings updated successfully.");

      if (data.settings) {
        setSettings({
          clinicName: data.settings.clinicName || "",
          address: data.settings.address || "",
          phone: data.settings.phone || "",
          email: data.settings.email || "",
          logo: data.settings.logo || "",
        });
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Could not update clinic settings."
      );
    } finally {
      setSaving(false);
    }
  }

  function updateField(
    field: keyof ClinicSettingsData,
    value: string
  ) {
    setSettings((current) => ({
      ...current,
      [field]: value,
    }));
  }

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-sm text-slate-500">
          Loading clinic settings...
        </div>
      </div>
    );
  }

  return (
    <AppShell userRole="ADMIN" userName="Administrator">
    <div className="mx-auto max-w-5xl px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
      <div className="space-y-4 sm:space-y-6">
        {/* Back Navigation */}
        <button
          type="button"
          onClick={() => navigate("/dashboard")}
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-igcc-700"
        >
          <ArrowLeft size={17} />
          Back to Dashboard
        </button>

        {/* Page Header */}
        <div className="group relative overflow-hidden rounded-2xl border border-white/70 bg-white/65 p-5 shadow-[0_10px_35px_rgba(15,23,42,0.08)] backdrop-blur-2xl sm:p-6">
          <div className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-igcc-200/25 blur-3xl transition-all duration-300 group-hover:bg-igcc-200/40" />

          <div className="relative flex items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-igcc-900 text-white shadow-sm">
              <Building2 size={23} strokeWidth={1.8} />
            </div>

            <div>
              <h1 className="text-xl font-bold leading-tight tracking-tight text-slate-900 sm:text-2xl">
                Clinic Settings
              </h1>

              <p className="mt-0.5 text-xs leading-5 text-slate-500 sm:text-sm">
                Manage clinic information and branding.
              </p>
            </div>
          </div>
        </div>

        {/* Messages */}
        {message && (
          <div className="flex items-start gap-3 rounded-xl border border-emerald-200/80 bg-emerald-50/75 px-4 py-3 text-sm text-emerald-700 shadow-sm backdrop-blur-sm">
            <CheckCircle2
              size={18}
              strokeWidth={1.8}
              className="mt-0.5 shrink-0"
            />
            <p>{message}</p>
          </div>
        )}

        {error && (
          <div className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            <AlertCircle
              size={18}
              strokeWidth={1.8}
              className="mt-0.5 shrink-0"
            />
            <p>{error}</p>
          </div>
        )}

        {/* Clinic Information */}
        <section className="group relative overflow-hidden rounded-2xl border border-white/70 bg-white/65 shadow-[0_10px_35px_rgba(15,23,42,0.08)] backdrop-blur-2xl">
          <div className="border-b border-white/70 bg-white/35 px-4 py-4 backdrop-blur-xl sm:px-6 sm:py-5">
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-700 sm:h-10 sm:w-10">
                <Building2 size={17} strokeWidth={1.8} />
              </div>

              <div>
                <h2 className="text-sm font-semibold text-slate-900 sm:text-base">
                  Clinic Information
                </h2>

                <p className="mt-0.5 text-[11px] leading-5 text-slate-500 sm:text-xs">
                  This information can be used throughout the clinic management system.
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="px-4 py-5 sm:px-6 sm:py-7">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
                {/* Clinic Name */}
                <div className="sm:col-span-2">
                  <label
                    htmlFor="clinicName"
                    className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500 sm:mb-2"
                  >
                    Clinic Name <span className="text-red-500">*</span>
                  </label>

                  <div className="relative">
                    <Building2
                      size={16}
                      strokeWidth={1.8}
                      className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      id="clinicName"
                      type="text"
                      value={settings.clinicName}
                      onChange={(event) =>
                        updateField("clinicName", event.target.value)
                      }
                      required
                      className="w-full rounded-xl border border-white/80 bg-white/75 py-3 pl-9 pr-3.5 text-sm text-slate-900 shadow-sm outline-none backdrop-blur-sm transition placeholder:text-slate-400 focus:border-igcc-700 focus:bg-white focus:ring-2 focus:ring-igcc-700/10 sm:py-2.5"
                    />
                  </div>
                </div>

                {/* Address */}
                <div className="sm:col-span-2">
                  <label
                    htmlFor="address"
                    className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500 sm:mb-2"
                  >
                    Address
                  </label>

                  <div className="relative">
                    <MapPin
                      size={16}
                      strokeWidth={1.8}
                      className="pointer-events-none absolute left-3 top-3.5 text-slate-400"
                    />

                    <textarea
                      id="address"
                      value={settings.address}
                      onChange={(event) =>
                        updateField("address", event.target.value)
                      }
                      rows={3}
                      placeholder="Enter clinic address"
                      className="w-full resize-y rounded-xl border border-white/80 bg-white/75 py-3 pl-9 pr-3.5 text-sm text-slate-900 shadow-sm outline-none backdrop-blur-sm transition placeholder:text-slate-400 focus:border-igcc-700 focus:bg-white focus:ring-2 focus:ring-igcc-700/10 sm:py-2.5"
                    />
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <label
                    htmlFor="phone"
                    className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500 sm:mb-2"
                  >
                    Phone
                  </label>

                  <div className="relative">
                    <Phone
                      size={16}
                      strokeWidth={1.8}
                      className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      id="phone"
                      type="text"
                      value={settings.phone}
                      onChange={(event) =>
                        updateField("phone", event.target.value)
                      }
                      placeholder="Enter clinic phone number"
                      className="w-full rounded-xl border border-white/80 bg-white/75 py-3 pl-9 pr-3.5 text-sm text-slate-900 shadow-sm outline-none backdrop-blur-sm transition placeholder:text-slate-400 focus:border-igcc-700 focus:bg-white focus:ring-2 focus:ring-igcc-700/10 sm:py-2.5"
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500 sm:mb-2"
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
                      value={settings.email}
                      onChange={(event) =>
                        updateField("email", event.target.value)
                      }
                      placeholder="Enter clinic email"
                      className="w-full rounded-xl border border-white/80 bg-white/75 py-3 pl-9 pr-3.5 text-sm text-slate-900 shadow-sm outline-none backdrop-blur-sm transition placeholder:text-slate-400 focus:border-igcc-700 focus:bg-white focus:ring-2 focus:ring-igcc-700/10 sm:py-2.5"
                    />
                  </div>
                </div>

                {/* Logo */}
                <div className="sm:col-span-2">
                  <label
                    htmlFor="logo"
                    className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500 sm:mb-2"
                  >
                    Logo
                  </label>

                  <div className="relative">
                    <Image
                      size={16}
                      strokeWidth={1.8}
                      className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      id="logo"
                      type="text"
                      value={settings.logo}
                      onChange={(event) =>
                        updateField("logo", event.target.value)
                      }
                      placeholder="Enter logo path or URL"
                      className="w-full rounded-xl border border-white/80 bg-white/75 py-3 pl-9 pr-3.5 text-sm text-slate-900 shadow-sm outline-none backdrop-blur-sm transition placeholder:text-slate-400 focus:border-igcc-700 focus:bg-white focus:ring-2 focus:ring-igcc-700/10 sm:py-2.5"
                    />
                  </div>

                  <p className="mt-1.5 text-xs text-slate-400">
                    Logo upload can be added during the final branding stage.
                  </p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col-reverse gap-3 border-t border-white/70 bg-white/35 px-4 py-4 backdrop-blur-xl sm:flex-row sm:justify-end sm:px-6 sm:py-5">
              <button
                type="button"
                onClick={() => navigate("/dashboard")}
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
                <Save size={16} strokeWidth={1.8} />
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </section>
      </div>
    </div>
    </AppShell>
  );
}