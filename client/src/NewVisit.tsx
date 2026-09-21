import { apiUrl } from "./api";
import { useEffect, useState } from "react";
import type { FormEvent, ReactNode } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Activity,
  ArrowLeft,
  CalendarDays,
  ClipboardList,
  FileText,
  HeartPulse,
  Save,
  ShieldAlert,
  Stethoscope,
  User,
} from "lucide-react";

import AppShell from "./components/layout/AppShell";

type Patient = {
  patientId: string;
  displayId: string;
  fullName: string;
};

type CurrentUser = {
  fullName?: string;
  role?: "ADMIN" | "CLINIC_STAFF";
};

function NewVisit() {
  const { patientId } = useParams();
  const navigate = useNavigate();

  const [patient, setPatient] = useState<Patient | null>(null);
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [loadingPatient, setLoadingPatient] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [visitDateTime, setVisitDateTime] = useState(() => {
    const now = new Date();
    const offset = now.getTimezoneOffset();

    return new Date(now.getTime() - offset * 60000)
      .toISOString()
      .slice(0, 16);
  });

  const [reasonForVisit, setReasonForVisit] = useState("");
  const [complaintSymptoms, setComplaintSymptoms] = useState("");
  const [bloodPressure, setBloodPressure] = useState("");
  const [pulse, setPulse] = useState("");
  const [bloodSugar, setBloodSugar] = useState("");
  const [respiration, setRespiration] = useState("");
  const [temperature, setTemperature] = useState("");
  const [assessmentObservation, setAssessmentObservation] =
    useState("");
  const [treatment, setTreatment] = useState("");
  const [actionTaken, setActionTaken] = useState("");
  const [additionalNotes, setAdditionalNotes] = useState("");
  const [recommendationsFollowUp, setRecommendationsFollowUp] =
    useState("");

  useEffect(() => {
    async function loadPatient() {
      if (!patientId) {
        setError("Patient ID is missing.");
        setLoadingPatient(false);
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
          setError(data.error || "Could not load patient.");
          return;
        }

        setPatient({
          patientId: data.patientId,
          displayId: data.displayId,
          fullName: data.fullName,
        });
      } catch {
        setError("Unable to connect to the clinic server.");
      } finally {
        setLoadingPatient(false);
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
        setCurrentUser(data);
      } catch {
        // Keep the page usable if the profile request fails.
      }
    }

    loadPatient();
    loadCurrentUser();
  }, [patientId]);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (!patientId) {
      setError("Patient ID is missing.");
      return;
    }

    if (!reasonForVisit.trim()) {
      setError("Reason for visit is required.");
      return;
    }

    setSaving(true);
    setError("");

    const numericValue = (value: string) =>
      value.trim() === "" ? undefined : Number(value);

    const payload = {
      patientId,
      visitDateTime: new Date(visitDateTime).toISOString(),
      reasonForVisit,
      complaintSymptoms,
      bloodPressure,
      pulse: numericValue(pulse),
      bloodSugar: numericValue(bloodSugar),
      respiration: numericValue(respiration),
      temperature: numericValue(temperature),
      assessmentObservation,
      treatment,
      actionTaken,
      additionalNotes,
      recommendationsFollowUp,
    };

    try {
      const response = await fetch(
        apiUrl("/api/visits"),
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Could not record visit.");
        return;
      }

      navigate(`/patients/${patientId}`);
    } catch {
      setError("Unable to connect to the clinic server.");
    } finally {
      setSaving(false);
    }
  }

  if (loadingPatient) {
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
        <div className="space-y-6">
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
      <div className="space-y-6">
        <button
          type="button"
          onClick={() =>
            navigate(`/patients/${patient.patientId}`)
          }
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-igcc-700"
        >
          <ArrowLeft size={17} />
          Back to Patient Profile
        </button>

        <section className="overflow-hidden rounded-xl border border-igcc-border bg-white shadow-igcc-sm">
          <div className="h-2 bg-igcc-800" />

          <div className="p-6 sm:p-8">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-igcc-50 text-igcc-700">
                <ClipboardList size={24} />
              </div>

              <div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                  Record New Visit
                </h1>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                  Record the details of the patient's current
                  clinic visit, including symptoms, vital signs,
                  assessment, treatment, and follow-up.
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

        <section className="rounded-xl border border-igcc-border bg-white shadow-igcc-sm">
          <div className="flex flex-col gap-5 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-igcc-50 text-igcc-700">
                <User size={21} />
              </div>

              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Patient
                </p>

                <p className="mt-0.5 text-lg font-bold text-slate-900">
                  {patient.fullName}
                </p>
              </div>
            </div>

            <div className="rounded-lg bg-igcc-50 px-4 py-3 sm:min-w-[150px]">
              <p className="text-[11px] font-bold uppercase tracking-wider text-igcc-700">
                Patient ID
              </p>

              <p className="mt-0.5 font-semibold text-igcc-900">
                {patient.displayId}
              </p>
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
                  Unable to save visit
                </p>

                <p className="mt-1 text-sm text-red-700">
                  {error}
                </p>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <section className="rounded-xl border border-igcc-border bg-white shadow-igcc-sm">
            <SectionHeader
              number="01"
              icon={<CalendarDays size={18} />}
              title="Visit Information"
              description="Record when the visit occurred and why the patient came to the clinic."
            />

            <div className="grid gap-5 p-5 sm:grid-cols-2 sm:p-6">
              <Field
                label="Visit Date & Time"
                required
                icon={<CalendarDays size={16} />}
              >
                <input
                  type="datetime-local"
                  value={visitDateTime}
                  onChange={(event) =>
                    setVisitDateTime(event.target.value)
                  }
                  className="form-input"
                />
              </Field>

              <Field
                label="Reason for Visit"
                required
                icon={<ClipboardList size={16} />}
              >
                <input
                  type="text"
                  value={reasonForVisit}
                  onChange={(event) =>
                    setReasonForVisit(event.target.value)
                  }
                  placeholder="e.g. Routine check, headache, dizziness..."
                  className="form-input"
                />
              </Field>

              <Field
                label="Patient's Description / Complaint"
                required
                icon={<FileText size={16} />}
                fullWidth
              >
                <textarea
                  value={complaintSymptoms}
                  onChange={(event) =>
                    setComplaintSymptoms(event.target.value)
                  }
                  placeholder="Describe the patient's complaint, symptoms, or reason for seeking care..."
                  rows={5}
                  className="form-input resize-y"
                />
              </Field>
            </div>
          </section>

          <section className="rounded-xl border border-igcc-border bg-white shadow-igcc-sm">
            <SectionHeader
              number="02"
              icon={<Activity size={18} />}
              title="Vital Signs"
              description="Record the patient's vital measurements taken during the visit."
            />

            <div className="grid gap-5 p-5 sm:grid-cols-2 lg:grid-cols-5 sm:p-6">
              <Field
                label="Blood Pressure"
                icon={<HeartPulse size={16} />}
              >
                <input
                  type="text"
                  value={bloodPressure}
                  onChange={(event) =>
                    setBloodPressure(event.target.value)
                  }
                  placeholder="e.g. 130/80"
                  className="form-input"
                />
              </Field>

              <Field
                label="Pulse"
                icon={<Activity size={16} />}
              >
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={pulse}
                  onChange={(event) =>
                    setPulse(event.target.value)
                  }
                  placeholder="bpm"
                  className="form-input"
                />
              </Field>

              <Field
                label="Blood Sugar"
                icon={<Activity size={16} />}
              >
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={bloodSugar}
                  onChange={(event) =>
                    setBloodSugar(event.target.value)
                  }
                  placeholder="e.g. 5.4"
                  className="form-input"
                />
              </Field>

              <Field
                label="Respiration"
                icon={<Activity size={16} />}
              >
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={respiration}
                  onChange={(event) =>
                    setRespiration(event.target.value)
                  }
                  placeholder="breaths/min"
                  className="form-input"
                />
              </Field>

              <Field
                label="Temperature"
                icon={<HeartPulse size={16} />}
              >
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={temperature}
                  onChange={(event) =>
                    setTemperature(event.target.value)
                  }
                  placeholder="°C"
                  className="form-input"
                />
              </Field>
            </div>
          </section>

          <section className="rounded-xl border border-igcc-border bg-white shadow-igcc-sm">
            <SectionHeader
              number="03"
              icon={<Stethoscope size={18} />}
              title="Clinical Record"
              description="Document your assessment, treatment, actions, notes, and follow-up."
            />

            <div className="space-y-5 p-5 sm:p-6">
              <TextAreaField
                label="Assessment / Observation"
                value={assessmentObservation}
                onChange={setAssessmentObservation}
                placeholder="Record your clinical observation or assessment..."
                icon={<Stethoscope size={16} />}
              />

              <TextAreaField
                label="Treatment"
                value={treatment}
                onChange={setTreatment}
                placeholder="Describe treatment provided..."
                icon={<HeartPulse size={16} />}
              />

              <TextAreaField
                label="Action Taken"
                value={actionTaken}
                onChange={setActionTaken}
                placeholder="Record the action taken during the visit..."
                icon={<ClipboardList size={16} />}
              />

              <TextAreaField
                label="Additional Notes"
                value={additionalNotes}
                onChange={setAdditionalNotes}
                placeholder="Add any other relevant information..."
                icon={<FileText size={16} />}
              />

              <TextAreaField
                label="Recommendations / Follow-up"
                value={recommendationsFollowUp}
                onChange={setRecommendationsFollowUp}
                placeholder="Record recommendations, monitoring instructions, or follow-up..."
                icon={<CalendarDays size={16} />}
              />
            </div>
          </section>

          <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() =>
                navigate(`/patients/${patient.patientId}`)
              }
              className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
              disabled={saving}
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-igcc-700 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-igcc-800 disabled:cursor-not-allowed disabled:bg-slate-400"
            >
              <Save size={17} />
              {saving ? "Saving Visit..." : "Save Visit"}
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
  number,
  icon,
  title,
  description,
}: {
  number: string;
  icon: ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="border-b border-igcc-border px-5 py-4 sm:px-6">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-igcc-50 text-igcc-700">
          {icon}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-bold tracking-wider text-slate-400">
              {number}
            </span>

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
  input,
  children,
  fullWidth = false,
}: {
  label: string;
  required?: boolean;
  icon?: ReactNode;
  input?: ReactNode;
  children?: ReactNode;
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

      {input || children}
    </div>
  );
}

function TextAreaField({
  label,
  value,
  onChange,
  placeholder,
  icon,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  icon?: ReactNode;
}) {
  return (
    <div>
      <label className="mb-2 block">
        <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-600">
          {icon && (
            <span className="text-slate-400">
              {icon}
            </span>
          )}

          {label}
        </span>
      </label>

      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        rows={5}
        className="form-input resize-y"
      />
    </div>
  );
}

export default NewVisit;
