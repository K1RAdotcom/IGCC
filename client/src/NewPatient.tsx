import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  ClipboardList,
  FileText,
  HeartPulse,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  UserPlus,
  Users,
} from "lucide-react";
import AppShell from "./components/layout/AppShell";

type PatientCategory = "MEMBER" | "STAFF" | "GUEST" | "OTHER";

type CurrentUser = {
  fullName: string;
  role: "ADMIN" | "CLINIC_STAFF";
};

export default function NewPatient() {
  const navigate = useNavigate();

  const [user, setUser] = useState<CurrentUser | null>(null);

  const [form, setForm] = useState({
    fullName: "",
    dateOfBirth: "",
    phone: "",
    email: "",
    gender: "",
    address: "",
    secondaryPhone: "",
    patientCategory: "MEMBER" as PatientCategory,
    emergencyContactName: "",
    emergencyContactPhone: "",
    golfClubMembership: "",
    medicalPhysicalInformation: "",
    additionalNotes: "",
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadUser() {
      try {
        const response = await fetch("http://localhost:4000/api/users/me", {
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Could not load user.");
        }

        const data = await response.json();

        setUser({
          fullName: data.user?.fullName ?? "",
          role: data.user?.role ?? "CLINIC_STAFF",
        });
      } catch {
        setUser({
          fullName: "",
          role: "CLINIC_STAFF",
        });
      }
    }

    loadUser();
  }, []);

  function updateField(field: keyof typeof form, value: string) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");

    if (!form.fullName.trim()) {
      setError("Full name is required.");
      return;
    }

    if (!form.dateOfBirth) {
      setError("Date of birth is required.");
      return;
    }

    if (!form.phone.trim()) {
      setError("Phone number is required.");
      return;
    }

    if (!form.emergencyContactName.trim()) {
      setError("Emergency contact name is required.");
      return;
    }

    if (!form.emergencyContactPhone.trim()) {
      setError("Emergency contact phone is required.");
      return;
    }

    setSaving(true);

    try {
      const response = await fetch(
        "http://localhost:4000/api/patients",
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Could not register patient."
        );
      }

      navigate(`/patients/${data.patient.patientId}`);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Could not register patient."
      );
    } finally {
      setSaving(false);
    }
  }

  const inputClass =
    "w-full rounded-lg border border-igcc-border bg-white px-3.5 py-2.5 text-sm text-slate-900 shadow-sm transition placeholder:text-slate-400 focus:border-igcc-500 focus:outline-none focus:ring-2 focus:ring-igcc-500/15 disabled:bg-slate-50";

  const labelClass =
    "mb-1.5 block text-sm font-semibold text-slate-700";

  const sectionClass =
    "rounded-xl border border-igcc-border bg-white shadow-igcc-sm";

  return (
    <AppShell
      userRole={user?.role}
      userName={user?.fullName}
    >
      <div className="mx-auto max-w-5xl">
        <button
          type="button"
          onClick={() => navigate("/patients")}
          className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-igcc-700 transition hover:text-igcc-900"
        >
          <ArrowLeft size={17} />
          Back to Patients
        </button>

        <div className="mb-7">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-igcc-100 text-igcc-700">
              <UserPlus size={24} />
            </div>

            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                Register New Patient
              </h1>
              <p className="mt-1.5 max-w-2xl text-sm leading-6 text-slate-500">
                Create a new patient record for the Ikeja Golf Club Clinic.
                Required information is marked with an asterisk.
              </p>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3.5 text-sm text-red-800">
            <ShieldCheck
              size={19}
              className="mt-0.5 shrink-0 text-red-600"
            />
            <div>
              <p className="font-semibold">Unable to register patient</p>
              <p className="mt-0.5">{error}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <section className={sectionClass}>
            <div className="border-b border-igcc-border px-5 py-4 sm:px-6">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-igcc-50 text-igcc-700">
                  <ClipboardList size={19} />
                </div>
                <div>
                  <h2 className="font-bold text-slate-900">
                    Basic Information
                  </h2>
                  <p className="mt-0.5 text-xs text-slate-500">
                    Core details used to identify the patient.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid gap-5 p-5 sm:grid-cols-2 sm:p-6">
              <div>
                <label className={labelClass}>
                  Full Name <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  value={form.fullName}
                  onChange={(e) =>
                    updateField("fullName", e.target.value)
                  }
                  placeholder="Enter patient's full name"
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>
                  Date of Birth <span className="text-red-600">*</span>
                </label>
                <div className="relative">
                  <CalendarDays
                    size={17}
                    className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    type="date"
                    value={form.dateOfBirth}
                    onChange={(e) =>
                      updateField("dateOfBirth", e.target.value)
                    }
                    className={`${inputClass} pl-10`}
                  />
                </div>
              </div>

              <div>
                <label className={labelClass}>
                  Phone <span className="text-red-600">*</span>
                </label>
                <div className="relative">
                  <Phone
                    size={17}
                    className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) =>
                      updateField("phone", e.target.value)
                    }
                    placeholder="Enter phone number"
                    className={`${inputClass} pl-10`}
                  />
                </div>
              </div>

              <div>
                <label className={labelClass}>
                  Patient Category <span className="text-red-600">*</span>
                </label>
                <select
                  value={form.patientCategory}
                  onChange={(e) =>
                    updateField(
                      "patientCategory",
                      e.target.value
                    )
                  }
                  className={inputClass}
                >
                  <option value="MEMBER">Club Member</option>
                  <option value="STAFF">Staff</option>
                  <option value="GUEST">Guest / Visitor</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>

              <div>
                <label className={labelClass}>Gender</label>
                <select
                  value={form.gender}
                  onChange={(e) =>
                    updateField("gender", e.target.value)
                  }
                  className={inputClass}
                >
                  <option value="">Select gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                  <option value="Prefer not to say">
                    Prefer not to say
                  </option>
                </select>
              </div>

              <div>
                <label className={labelClass}>Email</label>
                <div className="relative">
                  <Mail
                    size={17}
                    className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) =>
                      updateField("email", e.target.value)
                    }
                    placeholder="Enter email address"
                    className={`${inputClass} pl-10`}
                  />
                </div>
              </div>
            </div>
          </section>

          <section className={sectionClass}>
            <div className="border-b border-igcc-border px-5 py-4 sm:px-6">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-igcc-50 text-igcc-700">
                  <MapPin size={19} />
                </div>
                <div>
                  <h2 className="font-bold text-slate-900">
                    Contact Information
                  </h2>
                  <p className="mt-0.5 text-xs text-slate-500">
                    Additional contact and membership details.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid gap-5 p-5 sm:grid-cols-2 sm:p-6">
              <div>
                <label className={labelClass}>
                  Secondary Phone
                </label>
                <input
                  type="tel"
                  value={form.secondaryPhone}
                  onChange={(e) =>
                    updateField(
                      "secondaryPhone",
                      e.target.value
                    )
                  }
                  placeholder="Optional"
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>
                  Golf Club Membership
                </label>
                <input
                  type="text"
                  value={form.golfClubMembership}
                  onChange={(e) =>
                    updateField(
                      "golfClubMembership",
                      e.target.value
                    )
                  }
                  placeholder="Membership number or details"
                  className={inputClass}
                />
              </div>

              <div className="sm:col-span-2">
                <label className={labelClass}>Address</label>
                <textarea
                  value={form.address}
                  onChange={(e) =>
                    updateField("address", e.target.value)
                  }
                  placeholder="Enter patient's address"
                  rows={3}
                  className={`${inputClass} resize-y`}
                />
              </div>
            </div>
          </section>

          <section className={sectionClass}>
            <div className="border-b border-igcc-border px-5 py-4 sm:px-6">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-50 text-amber-700">
                  <Users size={19} />
                </div>
                <div>
                  <h2 className="font-bold text-slate-900">
                    Emergency Contact
                  </h2>
                  <p className="mt-0.5 text-xs text-slate-500">
                    A contact person for urgent situations.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid gap-5 p-5 sm:grid-cols-2 sm:p-6">
              <div>
                <label className={labelClass}>
                  Emergency Contact Name{" "}
                  <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  value={form.emergencyContactName}
                  onChange={(e) =>
                    updateField(
                      "emergencyContactName",
                      e.target.value
                    )
                  }
                  placeholder="Enter contact name"
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>
                  Emergency Contact Phone{" "}
                  <span className="text-red-600">*</span>
                </label>
                <div className="relative">
                  <Phone
                    size={17}
                    className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    type="tel"
                    value={form.emergencyContactPhone}
                    onChange={(e) =>
                      updateField(
                        "emergencyContactPhone",
                        e.target.value
                      )
                    }
                    placeholder="Enter contact phone"
                    className={`${inputClass} pl-10`}
                  />
                </div>
              </div>
            </div>
          </section>

          <section className={sectionClass}>
            <div className="border-b border-igcc-border px-5 py-4 sm:px-6">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-rose-50 text-rose-700">
                  <HeartPulse size={19} />
                </div>
                <div>
                  <h2 className="font-bold text-slate-900">
                    Medical / Physical Information
                  </h2>
                  <p className="mt-0.5 text-xs text-slate-500">
                    Relevant background information for clinic staff.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-5 p-5 sm:p-6">
              <div>
                <label className={labelClass}>
                  Relevant Medical / Physical Information
                </label>
                <textarea
                  value={form.medicalPhysicalInformation}
                  onChange={(e) =>
                    updateField(
                      "medicalPhysicalInformation",
                      e.target.value
                    )
                  }
                  placeholder="Enter relevant medical or physical information..."
                  rows={5}
                  className={`${inputClass} resize-y`}
                />
              </div>

              <div>
                <label className={labelClass}>
                  Additional Notes
                </label>
                <textarea
                  value={form.additionalNotes}
                  onChange={(e) =>
                    updateField(
                      "additionalNotes",
                      e.target.value
                    )
                  }
                  placeholder="Enter any additional notes..."
                  rows={4}
                  className={`${inputClass} resize-y`}
                />
              </div>
            </div>
          </section>

          <div className="sticky bottom-0 z-10 -mx-3 border-t border-igcc-border bg-igcc-background/95 px-3 py-4 backdrop-blur sm:static sm:mx-0 sm:border-0 sm:bg-transparent sm:px-0 sm:py-1">
            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => navigate("/patients")}
                disabled={saving}
                className="inline-flex items-center justify-center rounded-lg border border-igcc-border bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-igcc-700 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-igcc-800 disabled:cursor-not-allowed disabled:bg-slate-400"
              >
                {saving ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Registering...
                  </>
                ) : (
                  <>
                    <CheckCircle2 size={17} />
                    Register Patient
                  </>
                )}
              </button>
            </div>
          </div>
        </form>

        <div className="flex items-center justify-center gap-2 pb-8 pt-5 text-xs text-slate-400">
          <FileText size={14} />
          Patient information should be entered accurately and kept up to date.
        </div>
      </div>
    </AppShell>
  );
}
