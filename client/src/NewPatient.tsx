import { useEffect, useState } from "react";
import type { FormEvent, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  CalendarDays,
  FileText,
  HeartPulse,
  Mail,
  MapPin,
  Phone,
  Save,
  ShieldAlert,
  User,
  Users,
} from "lucide-react";

import AppShell from "./components/layout/AppShell";

type PatientCategory = "MEMBER" | "STAFF" | "GUEST" | "OTHER";

type CurrentUser = {
  fullName?: string;
  role?: "ADMIN" | "CLINIC_STAFF";
};

const categoryLabels: Record<PatientCategory, string> = {
  MEMBER: "Club Member",
  STAFF: "Staff",
  GUEST: "Guest / Visitor",
  OTHER: "Other",
};

export default function NewPatient() {
  const navigate = useNavigate();

  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);

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
    async function loadCurrentUser() {
      try {
        const response = await fetch(
          "http://localhost:4000/api/users/me",
          {
            credentials: "include",
          }
        );

        if (!response.ok) return;

        const data = await response.json();
        setCurrentUser(data);
      } catch {
        // Keep the page usable if the user profile request fails.
      }
    }

    loadCurrentUser();
  }, []);

  function updateField(
    field: keyof typeof form,
    value: string
  ) {
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

  return (
    <AppShell
      userRole={currentUser?.role ?? null}
      userName={currentUser?.fullName ?? "Clinic Staff"}
    >
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="button"
            onClick={() => navigate("/patients")}
            className="inline-flex w-fit items-center gap-2 rounded-lg px-2 py-1.5 text-sm font-semibold text-slate-500 transition hover:bg-igcc-50 hover:text-igcc-700"
          >
            <ArrowLeft size={17} />
            Back to Patients
          </button>
        </div>

        <section className="overflow-hidden rounded-xl border border-igcc-border bg-white shadow-igcc-sm">
          <div className="h-2 bg-igcc-800" />

          <div className="p-6 sm:p-8">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-igcc-50 text-igcc-700">
                <User size={24} />
              </div>

              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-igcc-50 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-igcc-700">
                    Patient Registration
                  </span>
                </div>

                <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                  Register New Patient
                </h1>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                  Create a new patient record for the Ikeja Golf Club Clinic.
                  Enter the patient's personal, contact, emergency, and
                  relevant medical information below.
                </p>

                <p className="mt-3 text-xs text-slate-400">
                  Fields marked with{" "}
                  <span className="font-bold text-red-500">*</span>{" "}
                  are required.
                </p>
              </div>
            </div>
          </div>
        </section>

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3.5">
            <div className="flex items-start gap-3">
              <ShieldAlert
                size={19}
                className="mt-0.5 shrink-0 text-red-600"
              />

              <div>
                <p className="text-sm font-semibold text-red-800">
                  Unable to register patient
                </p>

                <p className="mt-1 text-sm text-red-700">
                  {error}
                </p>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <section className="overflow-hidden rounded-xl border border-igcc-border bg-white shadow-igcc-sm">
            <SectionHeader
              icon={<User size={18} />}
              title="Basic Information"
              description="Enter the patient's primary identification details."
            />

            <div className="grid gap-5 p-5 sm:grid-cols-2 sm:p-6">
              <Field
                label="Full Name"
                required
                icon={<User size={16} />}
              >
                <input
                  type="text"
                  value={form.fullName}
                  onChange={(e) =>
                    updateField("fullName", e.target.value)
                  }
                  placeholder="Enter patient's full name"
                  className="form-input"
                />
              </Field>

              <Field
                label="Date of Birth"
                required
                icon={<CalendarDays size={16} />}
              >
                <input
                  type="date"
                  value={form.dateOfBirth}
                  onChange={(e) =>
                    updateField("dateOfBirth", e.target.value)
                  }
                  className="form-input"
                />
              </Field>

              <Field
                label="Phone"
                required
                icon={<Phone size={16} />}
              >
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) =>
                    updateField("phone", e.target.value)
                  }
                  placeholder="Enter phone number"
                  className="form-input"
                />
              </Field>

              <Field
                label="Patient Category"
                required
                icon={<Users size={16} />}
              >
                <select
                  value={form.patientCategory}
                  onChange={(e) =>
                    updateField(
                      "patientCategory",
                      e.target.value
                    )
                  }
                  className="form-input"
                >
                  <option value="MEMBER">Club Member</option>
                  <option value="STAFF">Staff</option>
                  <option value="GUEST">Guest / Visitor</option>
                  <option value="OTHER">Other</option>
                </select>

                <p className="mt-1.5 text-xs text-slate-400">
                  Current selection:{" "}
                  <span className="font-medium text-slate-500">
                    {categoryLabels[form.patientCategory]}
                  </span>
                </p>
              </Field>

              <Field
                label="Gender"
                icon={<User size={16} />}
              >
                <select
                  value={form.gender}
                  onChange={(e) =>
                    updateField("gender", e.target.value)
                  }
                  className="form-input"
                >
                  <option value="">Select gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                  <option value="Prefer not to say">
                    Prefer not to say
                  </option>
                </select>
              </Field>

              <Field
                label="Email"
                icon={<Mail size={16} />}
              >
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) =>
                    updateField("email", e.target.value)
                  }
                  placeholder="Enter email address"
                  className="form-input"
                />
              </Field>
            </div>
          </section>

          <section className="overflow-hidden rounded-xl border border-igcc-border bg-white shadow-igcc-sm">
            <SectionHeader
              icon={<Phone size={18} />}
              title="Contact Information"
              description="Add additional ways to contact and identify the patient."
            />

            <div className="grid gap-5 p-5 sm:grid-cols-2 sm:p-6">
              <Field
                label="Secondary Phone"
                icon={<Phone size={16} />}
              >
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
                  className="form-input"
                />
              </Field>

              <Field
                label="Golf Club Membership"
                icon={<Users size={16} />}
              >
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
                  className="form-input"
                />
              </Field>

              <Field
                label="Address"
                icon={<MapPin size={16} />}
                fullWidth
              >
                <textarea
                  value={form.address}
                  onChange={(e) =>
                    updateField("address", e.target.value)
                  }
                  placeholder="Enter patient's address"
                  rows={3}
                  className="form-input resize-y"
                />
              </Field>
            </div>
          </section>

          <section className="overflow-hidden rounded-xl border border-igcc-border bg-white shadow-igcc-sm">
            <SectionHeader
              icon={<ShieldAlert size={18} />}
              title="Emergency Contact"
              description="Provide someone the clinic can contact in an emergency."
              alert
            />

            <div className="grid gap-5 p-5 sm:grid-cols-2 sm:p-6">
              <Field
                label="Emergency Contact Name"
                required
                icon={<User size={16} />}
              >
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
                  className="form-input"
                />
              </Field>

              <Field
                label="Emergency Contact Phone"
                required
                icon={<Phone size={16} />}
              >
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
                  className="form-input"
                />
              </Field>
            </div>
          </section>

          <section className="overflow-hidden rounded-xl border border-igcc-border bg-white shadow-igcc-sm">
            <SectionHeader
              icon={<HeartPulse size={18} />}
              title="Medical / Physical Information"
              description="Record relevant information that may assist with future clinic visits."
            />

            <div className="space-y-5 p-5 sm:p-6">
              <Field
                label="Relevant Medical / Physical Information"
                icon={<HeartPulse size={16} />}
                fullWidth
              >
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
                  className="form-input resize-y"
                />
              </Field>

              <Field
                label="Additional Notes"
                icon={<FileText size={16} />}
                fullWidth
              >
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
                  className="form-input resize-y"
                />
              </Field>
            </div>
          </section>

          <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() => navigate("/patients")}
              className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-400 hover:bg-slate-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-igcc-700 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-igcc-800 disabled:cursor-not-allowed disabled:bg-slate-400"
            >
              <Save size={17} />
              {saving ? "Registering..." : "Register Patient"}
            </button>
          </div>
        </form>
      </div>

      <style>{`
        .form-input {
          width: 100%;
          border: 1px solid #cbd5e1;
          border-radius: 0.5rem;
          background: #ffffff;
          padding: 0.7rem 0.8rem;
          font-size: 0.875rem;
          line-height: 1.5rem;
          color: #1e293b;
          outline: none;
          transition:
            border-color 150ms ease,
            box-shadow 150ms ease,
            background-color 150ms ease;
          box-sizing: border-box;
        }

        .form-input::placeholder {
          color: #94a3b8;
        }

        .form-input:hover {
          border-color: #94a3b8;
        }

        .form-input:focus {
          border-color: #1f6b4f;
          box-shadow: 0 0 0 3px rgba(31, 107, 79, 0.12);
        }

        .form-input:disabled {
          background: #f8fafc;
          cursor: not-allowed;
        }
      `}</style>
    </AppShell>
  );
}

function SectionHeader({
  icon,
  title,
  description,
  alert = false,
}: {
    icon: ReactNode;
  title: string;
  description: string;
  alert?: boolean;
}) {
  return (
    <div className="border-b border-igcc-border px-5 py-4 sm:px-6">
      <div className="flex items-start gap-3">
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${
            alert
              ? "bg-red-50 text-red-600"
              : "bg-igcc-50 text-igcc-700"
          }`}
        >
          {icon}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">

            <h2 className="font-semibold text-slate-900">
              {title}
            </h2>
          </div>

          <p className="mt-1 text-xs leading-5 text-slate-500">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  required = false,
  icon,
  children,
  fullWidth = false,
}: {
  label: string;
  required?: boolean;
  icon?: ReactNode;
  children: ReactNode;
  fullWidth?: boolean;
}) {
  return (
    <div className={fullWidth ? "sm:col-span-2" : ""}>
      <label className="mb-2 block">
        <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-600">
          {icon && (
            <span className="text-slate-400">
              {icon}
            </span>
          )}

          {label}

          {required && (
            <span className="font-bold text-red-500">*</span>
          )}
        </span>
      </label>

      {children}
    </div>
  );
}


