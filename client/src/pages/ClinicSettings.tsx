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
    <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
      <div className="space-y-6">
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
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-igcc-900 text-white shadow-sm">
            <Building2 size={23} strokeWidth={1.8} />
          </div>

          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Clinic Settings
            </h1>

            <p className="mt-0.5 text-sm text-slate-500">
              Manage clinic information and branding.
            </p>
          </div>
        </div>

        {/* Messages */}
        {message && (
          <div className="flex items-start gap-3 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
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
        <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-6 py-5">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
                <Building2 size={18} strokeWidth={1.8} />
              </div>

              <div>
                <h2 className="text-base font-semibold text-slate-900">
                  Clinic Information
                </h2>

                <p className="mt-0.5 text-xs text-slate-500">
                  This information can be used throughout the clinic management system.
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="px-6 py-6">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                {/* Clinic Name */}
                <div className="sm:col-span-2">
                  <label
                    htmlFor="clinicName"
                    className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500"
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
                      className="w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-9 pr-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-igcc-800 focus:ring-2 focus:ring-igcc-800/10"
                    />
                  </div>
                </div>

                {/* Address */}
                <div className="sm:col-span-2">
                  <label
                    htmlFor="address"
                    className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500"
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
                      className="w-full resize-y rounded-lg border border-slate-300 bg-white py-2.5 pl-9 pr-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-igcc-800 focus:ring-2 focus:ring-igcc-800/10"
                    />
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <label
                    htmlFor="phone"
                    className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500"
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
                      className="w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-9 pr-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-igcc-800 focus:ring-2 focus:ring-igcc-800/10"
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
                      value={settings.email}
                      onChange={(event) =>
                        updateField("email", event.target.value)
                      }
                      placeholder="Enter clinic email"
                      className="w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-9 pr-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-igcc-800 focus:ring-2 focus:ring-igcc-800/10"
                    />
                  </div>
                </div>

                {/* Logo */}
                <div className="sm:col-span-2">
                  <label
                    htmlFor="logo"
                    className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500"
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
                      className="w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-9 pr-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-igcc-800 focus:ring-2 focus:ring-igcc-800/10"
                    />
                  </div>

                  <p className="mt-1.5 text-xs text-slate-400">
                    Logo upload can be added during the final branding stage.
                  </p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col-reverse gap-3 border-t border-slate-200 bg-slate-50/60 px-6 py-5 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => navigate("/dashboard")}
                disabled={saving}
                className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-igcc-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-igcc-800 disabled:cursor-not-allowed disabled:bg-slate-400"
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