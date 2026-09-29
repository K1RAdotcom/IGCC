import { apiUrl } from "./api";
import { useEffect, useState } from "react";
import type { FormEvent, ReactNode } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  CalendarDays,
  FileText,
  HeartPulse,
  Save,
  ShieldAlert,
  User,
  Users,
  X,
} from "lucide-react";

import AppShell from "./components/layout/AppShell";

type Patient = {
  patientId: string;
  displayId: string;
  fullName: string;
  dateOfBirth: string;
  phone: string;
  email?: string | null;
  gender?: string | null;
  address?: string | null;
  secondaryPhone?: string | null;
  patientCategory: "MEMBER" | "STAFF" | "GUEST" | "OTHER";
  emergencyContactName: string;
  emergencyContactPhone: string;
  profilePhoto?: string | null;
  golfClubMembership?: string | null;
  medicalPhysicalInformation?: string | null;
  additionalNotes?: string | null;
};

type CurrentUser = {
  fullName?: string;
  role?: "ADMIN" | "CLINIC_STAFF";
};

function SectionHeader({
  icon,
  title,
  description,
}: {
  icon: ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="border-b border-igcc-border px-4 py-3.5 sm:px-6 sm:py-4">
      <div className="flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-igcc-50 text-igcc-700 sm:h-10 sm:w-10">
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

export default function EditPatient() {
  const { patientId } = useParams();
  const navigate = useNavigate();

  const [patient, setPatient] = useState<Patient | null>(null);
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    fullName: "",
    dateOfBirth: "",
    phone: "",
    email: "",
    gender: "",
    address: "",
    secondaryPhone: "",
    patientCategory: "MEMBER",
    emergencyContactName: "",
    emergencyContactPhone: "",
    profilePhoto: "",
    golfClubMembership: "",
    medicalPhysicalInformation: "",
    additionalNotes: "",
  });

  useEffect(() => {
    async function loadPatient() {
      if (!patientId) {
        setError("Patient ID is missing.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          apiUrl(`/api/patient-profile/${patientId}`),
          {
            credentials: "include",
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.error || "Could not load patient."
          );
        }

        setPatient(data);

        setForm({
          fullName: data.fullName || "",
          dateOfBirth: data.dateOfBirth
            ? new Date(data.dateOfBirth)
                .toISOString()
                .split("T")[0]
            : "",
          phone: data.phone || "",
          email: data.email || "",
          gender: data.gender || "",
          address: data.address || "",
          secondaryPhone: data.secondaryPhone || "",
          patientCategory:
            data.patientCategory || "MEMBER",
          emergencyContactName:
            data.emergencyContactName || "",
          emergencyContactPhone:
            data.emergencyContactPhone || "",
          profilePhoto: data.profilePhoto || "",
          golfClubMembership:
            data.golfClubMembership || "",
          medicalPhysicalInformation:
            data.medicalPhysicalInformation || "",
          additionalNotes:
            data.additionalNotes || "",
        });
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Could not load patient."
        );
      } finally {
        setLoading(false);
      }
    }

    async function loadCurrentUser() {
      try {
        const response = await fetch(
          apiUrl("/api/users/me"),
          {
            credentials: "include",
          }
        );

        if (!response.ok) return;

        const data = await response.json();
        setCurrentUser(data.user);
      } catch {
        // Keep the page usable if the profile request fails.
      }
    }

    loadPatient();
    loadCurrentUser();
  }, [patientId]);

  function updateField(name: string, value: string) {
    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!patientId) {
      setError("Patient ID is missing.");
      return;
    }

    setSaving(true);
    setError("");

    try {
      const response = await fetch(
        apiUrl(`/api/patients/${patientId}`),
        {
          method: "PATCH",
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
          data.error || "Could not update patient."
        );
      }

      navigate(`/patients/${patientId}`);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Could not update patient."
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <AppShell
        userRole={currentUser?.role ?? null}
        userName={currentUser?.fullName ?? "Clinic Staff"}
      >
        <div className="rounded-xl border border-igcc-border bg-white p-8 shadow-igcc-sm">
          <div className="animate-pulse space-y-4">
            <div className="h-6 w-48 rounded bg-slate-200" />
            <div className="h-4 w-72 rounded bg-slate-200" />
            <div className="h-24 rounded-lg bg-slate-100" />
            <div className="h-48 rounded-lg bg-slate-100" />
          </div>
        </div>
      </AppShell>
    );
  }

  if (!patient) {
    return (
      <AppShell
        userRole={currentUser?.role ?? null}
        userName={currentUser?.fullName ?? "Clinic Staff"}
      >
        <div className="space-y-4 sm:space-y-6">
          <button
            type="button"
            onClick={() => navigate("/patients")}
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-igcc-700"
          >
            <ArrowLeft size={17} />
            Back to Patients
          </button>

          <div className="rounded-xl border border-red-200 bg-red-50 p-5">
            <div className="flex items-start gap-3">
              <ShieldAlert
                size={20}
                className="mt-0.5 shrink-0 text-red-600"
              />

              <div>
                <p className="font-semibold text-red-800">
                  Patient could not be loaded
                </p>

                <p className="mt-1 text-sm text-red-700">
                  {error || "Patient not found."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell
      userRole={currentUser?.role ?? null}
      userName={currentUser?.fullName ?? "Clinic Staff"}
    >
      <div className="space-y-4 sm:space-y-6">
        <button
          type="button"
          onClick={() =>
            navigate(`/patients/${patientId}`)
          }
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-igcc-700"
        >
          <ArrowLeft size={17} />
          Back to Patient Profile
        </button>

        <section className="group relative overflow-hidden rounded-2xl border border-white/70 bg-white/65 shadow-[0_10px_35px_rgba(15,23,42,0.08)] backdrop-blur-2xl">
          <div className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-igcc-200/25 blur-3xl transition-all duration-300 group-hover:bg-igcc-200/40" />

          <div className="p-4 sm:p-8">
            <div className="flex items-start gap-3 sm:gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-igcc-50 text-igcc-700">
                <User size={24} />
              </div>

              <div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                  Edit Patient
                </h1>

                <p className="mt-1.5 max-w-2xl text-sm leading-5 text-slate-500 sm:mt-2 sm:leading-6">
                  Update the patient's personal, contact,
                  emergency, and medical information.
                </p>

                <p className="mt-2.5 text-xs text-slate-400 sm:mt-3">
                  Patient ID:{" "}
                  <span className="font-semibold text-slate-600">
                    {patient.displayId}
                  </span>
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  Fields marked with{" "}
                  <span className="font-bold text-red-500">*</span>{" "}
                  are required.
                </p>
              </div>
            </div>
          </div>
        </section>

        {error && (
          <div className="rounded-xl border border-red-200/80 bg-red-50/75 px-4 py-3.5 shadow-sm backdrop-blur-sm">
            <div className="flex items-start gap-3">
              <ShieldAlert
                size={19}
                className="mt-0.5 shrink-0 text-red-600"
              />

              <div>
                <p className="text-sm font-semibold text-red-800">
                  Unable to update patient
                </p>

                <p className="mt-1 text-sm text-red-700">
                  {error}
                </p>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          <section className="group relative overflow-hidden rounded-2xl border border-white/70 bg-white/65 shadow-[0_10px_35px_rgba(15,23,42,0.08)] backdrop-blur-2xl">
            <SectionHeader
              icon={<User size={18} />}
              title="Personal Information"
              description="Update the patient's basic identity and contact details."
            />

            <div className="grid gap-4 p-4 sm:grid-cols-2 sm:gap-5 sm:p-6">
              <Field
                label="Full Name"
                required
                icon={<User size={16} />}
              >
                <input
                  value={form.fullName}
                  onChange={(event) =>
                    updateField("fullName", event.target.value)
                  }
                  className="form-input"
                  required
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
                  onChange={(event) =>
                    updateField(
                      "dateOfBirth",
                      event.target.value
                    )
                  }
                  className="form-input"
                  required
                />
              </Field>

              <Field
                label="Phone"
                required
                icon={<FileText size={16} />}
              >
                <input
                  value={form.phone}
                  onChange={(event) =>
                    updateField("phone", event.target.value)
                  }
                  className="form-input"
                  required
                />
              </Field>

              <Field
                label="Patient Category"
                required
                icon={<Users size={16} />}
              >
                <select
                  value={form.patientCategory}
                  onChange={(event) =>
                    updateField(
                      "patientCategory",
                      event.target.value
                    )
                  }
                  className="form-input"
                  required
                >
                  <option value="MEMBER">Club Member</option>
                  <option value="STAFF">Staff</option>
                  <option value="GUEST">Guest / Visitor</option>
                  <option value="OTHER">Other</option>
                </select>
              </Field>

              <Field
                label="Gender"
                icon={<User size={16} />}
              >
                <select
                  value={form.gender}
                  onChange={(event) =>
                    updateField("gender", event.target.value)
                  }
                  className="form-input"
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </Field>

              <Field
                label="Email"
                icon={<FileText size={16} />}
              >
                <input
                  type="email"
                  value={form.email}
                  onChange={(event) =>
                    updateField("email", event.target.value)
                  }
                  className="form-input"
                />
              </Field>

              <Field
                label="Secondary Phone"
                icon={<FileText size={16} />}
              >
                <input
                  value={form.secondaryPhone}
                  onChange={(event) =>
                    updateField(
                      "secondaryPhone",
                      event.target.value
                    )
                  }
                  className="form-input"
                />
              </Field>

              <Field
                label="Golf Club Membership"
                icon={<Users size={16} />}
              >
                <input
                  value={form.golfClubMembership}
                  onChange={(event) =>
                    updateField(
                      "golfClubMembership",
                      event.target.value
                    )
                  }
                  className="form-input"
                />
              </Field>

              <Field
                label="Address"
                icon={<FileText size={16} />}
                fullWidth
              >
                <textarea
                  value={form.address}
                  onChange={(event) =>
                    updateField("address", event.target.value)
                  }
                  rows={3}
                  className="form-input resize-y"
                />
              </Field>
            </div>
          </section>

          <section className="group relative overflow-hidden rounded-2xl border border-white/70 bg-white/65 shadow-[0_10px_35px_rgba(15,23,42,0.08)] backdrop-blur-2xl">
            <SectionHeader
              icon={<ShieldAlert size={18} />}
              title="Emergency Contact"
              description="Keep the patient's emergency contact information current."
            />

            <div className="grid gap-4 p-4 sm:grid-cols-2 sm:gap-5 sm:p-6">
              <Field
                label="Emergency Contact Name"
                required
                icon={<User size={16} />}
              >
                <input
                  value={form.emergencyContactName}
                  onChange={(event) =>
                    updateField(
                      "emergencyContactName",
                      event.target.value
                    )
                  }
                  className="form-input"
                  required
                />
              </Field>

              <Field
                label="Emergency Contact Phone"
                required
                icon={<FileText size={16} />}
              >
                <input
                  value={form.emergencyContactPhone}
                  onChange={(event) =>
                    updateField(
                      "emergencyContactPhone",
                      event.target.value
                    )
                  }
                  className="form-input"
                  required
                />
              </Field>
            </div>
          </section>

          <section className="group relative overflow-hidden rounded-2xl border border-white/70 bg-white/65 shadow-[0_10px_35px_rgba(15,23,42,0.08)] backdrop-blur-2xl">
            <SectionHeader
              icon={<HeartPulse size={18} />}
              title="Medical / Additional Information"
              description="Update relevant medical, physical, and other patient information."
            />

            <div className="space-y-4 p-4 sm:space-y-5 sm:p-6">
              <Field
                label="Relevant Medical / Physical Information"
                icon={<HeartPulse size={16} />}
              >
                <textarea
                  value={form.medicalPhysicalInformation}
                  onChange={(event) =>
                    updateField(
                      "medicalPhysicalInformation",
                      event.target.value
                    )
                  }
                  rows={5}
                  className="form-input resize-y"
                />
              </Field>

              <Field
                label="Additional Notes"
                icon={<FileText size={16} />}
              >
                <textarea
                  value={form.additionalNotes}
                  onChange={(event) =>
                    updateField(
                      "additionalNotes",
                      event.target.value
                    )
                  }
                  rows={5}
                  className="form-input resize-y"
                />
              </Field>
            </div>
          </section>

          <div className="flex flex-col-reverse gap-3 rounded-2xl border border-white/70 bg-white/55 p-4 shadow-[0_8px_25px_rgba(15,23,42,0.05)] backdrop-blur-xl sm:flex-row sm:justify-end sm:p-5">
            <button
              type="button"
              onClick={() =>
                navigate(`/patients/${patientId}`)
              }
              disabled={saving}
              className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg border border-white/80 bg-white/70 px-5 py-3 text-sm font-semibold text-slate-700 shadow-sm backdrop-blur-sm transition hover:bg-white hover:text-igcc-700 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto sm:py-2.5"
            >
              <X size={17} />
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-igcc-700 px-5 py-3 text-sm font-semibold text-white shadow-[0_8px_20px_rgba(31,107,79,0.18)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-igcc-800 hover:shadow-[0_10px_24px_rgba(31,107,79,0.24)] disabled:cursor-not-allowed disabled:bg-slate-400 disabled:shadow-none sm:w-auto sm:py-2.5"
            >
              <Save size={17} />
              {saving ? "Saving Changes..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>

      <style>{`
        .form-input {
  width: 100%;
  border: 1px solid rgba(148, 163, 184, 0.55);
  border-radius: 0.75rem;
  background: rgba(255, 255, 255, 0.9);
  padding: 0.7rem 0.8rem;
  font-size: 0.875rem;
  line-height: 1.5rem;
  color: #1e293b;
  outline: none;
  box-shadow:
    0 1px 2px rgba(15, 23, 42, 0.04),
    0 3px 10px rgba(15, 23, 42, 0.06);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  transition:
    border-color 150ms ease,
    box-shadow 150ms ease,
    background-color 150ms ease;
  box-sizing: border-box;
}

.form-input::placeholder {
  color: #64748b;
}

.form-input:hover {
  border-color: rgba(100, 116, 139, 0.65);
}

.form-input:focus {
  border-color: #1f6b4f;
  background: rgba(255, 255, 255, 0.96);
  box-shadow:
    0 0 0 3px rgba(31, 107, 79, 0.12),
    0 3px 10px rgba(15, 23, 42, 0.06);
}

.form-input:disabled {
  background: rgba(241, 245, 249, 0.75);
  border-color: rgba(203, 213, 225, 0.7);
  color: #64748b;
  cursor: not-allowed;
}
      `}</style>
    </AppShell>
  );
}
