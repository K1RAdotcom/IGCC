import { apiUrl } from "./api";
import { useEffect, useState } from "react";
import type { FormEvent, ReactNode } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Activity,
  ArrowLeft,
  CalendarDays,
  ClipboardList,
  Edit3,
  FileText,
  HeartPulse,
  Save,
  ShieldAlert,
  Stethoscope,
  User,
  X,
} from "lucide-react";

import AppShell from "./components/layout/AppShell";

type Visit = {
  visitId: string;
  displayId: string;
  visitDateTime: string;
  reasonForVisit: string;
  complaintSymptoms?: string | null;
  bloodPressure?: string | null;
  pulse?: number | null;
  bloodSugar?: number | null;
  respiration?: number | null;
  temperature?: number | null;
  assessmentObservation?: string | null;
  treatment?: string | null;
  actionTaken?: string | null;
  additionalNotes?: string | null;
  recommendationsFollowUp?: string | null;
  createdAt: string;
  updatedAt: string;
  patient: {
    patientId: string;
    displayId: string;
    fullName: string;
  };
  staff: {
    displayId: string;
    fullName: string;
    username: string;
  };
};

type CurrentUser = {
  fullName?: string;
  role?: "ADMIN" | "CLINIC_STAFF";
};

type FormData = {
  visitDateTime: string;
  reasonForVisit: string;
  complaintSymptoms: string;
  bloodPressure: string;
  pulse: string;
  bloodSugar: string;
  respiration: string;
  temperature: string;
  assessmentObservation: string;
  treatment: string;
  actionTaken: string;
  additionalNotes: string;
  recommendationsFollowUp: string;
};

function formatDateTime(value: string) {
  return new Date(value).toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).replace(",", " Ã‚Â·");
}

function toDateTimeLocal(value: string) {
  const date = new Date(value);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

function createFormData(visit: Visit): FormData {
  return {
    visitDateTime: toDateTimeLocal(visit.visitDateTime),
    reasonForVisit: visit.reasonForVisit || "",
    complaintSymptoms: visit.complaintSymptoms || "",
    bloodPressure: visit.bloodPressure || "",
    pulse:
      visit.pulse !== null && visit.pulse !== undefined
        ? String(visit.pulse)
        : "",
    bloodSugar:
      visit.bloodSugar !== null && visit.bloodSugar !== undefined
        ? String(visit.bloodSugar)
        : "",
    respiration:
      visit.respiration !== null && visit.respiration !== undefined
        ? String(visit.respiration)
        : "",
    temperature:
      visit.temperature !== null && visit.temperature !== undefined
        ? String(visit.temperature)
        : "",
    assessmentObservation: visit.assessmentObservation || "",
    treatment: visit.treatment || "",
    actionTaken: visit.actionTaken || "",
    additionalNotes: visit.additionalNotes || "",
    recommendationsFollowUp: visit.recommendationsFollowUp || "",
  };
}

function DisplayField({
  label,
  value,
  icon,
}: {
  label: string;
  value?: string | number | null;
  icon?: ReactNode;
}) {
  const hasValue =
    value !== null &&
    value !== undefined &&
    String(value).trim() !== "";

  return (
    <div>
      <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-slate-500">
        {icon && <span className="text-slate-400">{icon}</span>}
        {label}
      </p>

      <div className="min-h-[24px] whitespace-pre-wrap text-sm leading-6 text-slate-800">
        {hasValue ? String(value) : (
          <span className="text-slate-400">Not recorded</span>
        )}
      </div>
    </div>
  );
}

function InputField({
  label,
  value,
  onChange,
  type = "text",
  required = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="mb-2 block">
        <span className="text-xs font-semibold text-slate-600">
          {label}
          {required && (
            <span className="ml-1 font-bold text-red-500">*</span>
          )}
        </span>
      </label>

      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        required={required}
        className="form-input"
      />
    </div>
  );
}

function TextAreaField({
  label,
  value,
  onChange,
  rows = 5,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  rows?: number;
}) {
  return (
    <div>
      <label className="mb-2 block">
        <span className="text-xs font-semibold text-slate-600">
          {label}
        </span>
      </label>

      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        rows={rows}
        className="form-input resize-y"
      />
    </div>
  );
}

function SectionHeader({  icon,
  title,
  description,
}: {  icon: ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="border-b border-igcc-border px-4 py-3.5 sm:px-6 sm:py-4">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-igcc-50 text-igcc-700">
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

function VitalCard({
  label,
  value,
  unit,
  icon,
}: {
  label: string;
  value?: string | number | null;
  unit?: string;
  icon: ReactNode;
}) {
  const hasValue =
    value !== null &&
    value !== undefined &&
    String(value).trim() !== "";

  return (
    <div className="min-h-[88px] rounded-lg border border-slate-200 bg-slate-50 p-3.5 sm:min-h-[108px] sm:p-4">
      <div className="mb-2 flex items-center gap-2 sm:mb-3">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white text-igcc-700 shadow-sm sm:h-8 sm:w-8">
          {icon}
        </div>

        <span className="text-xs font-semibold text-slate-500">
          {label}
        </span>
      </div>

      <div className="text-lg font-bold tracking-tight text-slate-900 sm:text-xl">
        {hasValue ? String(value) : "Not recorded"}
        {hasValue && unit && (
          <span className="ml-1 text-xs font-medium text-slate-500">
            {unit}
          </span>
        )}
      </div>
    </div>
  );
}

export default function VisitDetails() {
  const navigate = useNavigate();

  const { patientId, visitId } = useParams<{
    patientId: string;
    visitId: string;
  }>();

  const [visit, setVisit] = useState<Visit | null>(null);
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");
  const [formData, setFormData] = useState<FormData | null>(null);

  useEffect(() => {
    async function loadVisit() {
      if (!patientId || !visitId) {
        setError("Invalid visit information.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          apiUrl(`/api/visits/${visitId}`),
          {
            credentials: "include",
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Could not load visit.");
        }

        setVisit(data);
        setFormData(createFormData(data));
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Could not load visit."
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

    loadVisit();
    loadCurrentUser();
  }, [patientId, visitId]);

  function updateField(field: keyof FormData, value: string) {
    setFormData((current) =>
      current
        ? {
            ...current,
            [field]: value,
          }
        : current
    );
  }

  function startEditing() {
    if (!visit) return;

    setFormData(createFormData(visit));
    setFormError("");
    setEditMode(true);
  }

  function cancelEditing() {
    if (visit) {
      setFormData(createFormData(visit));
    }

    setFormError("");
    setEditMode(false);
  }

  async function saveChanges(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (!visitId || !formData) {
      return;
    }

    if (!formData.reasonForVisit.trim()) {
      setFormError("Reason for visit is required.");
      return;
    }

    setSaving(true);
    setFormError("");

    try {
      const response = await fetch(
        apiUrl(`/api/visits/${visitId}`),
        {
          method: "PATCH",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            visitDateTime: formData.visitDateTime,
            reasonForVisit: formData.reasonForVisit.trim(),
            complaintSymptoms: formData.complaintSymptoms.trim(),
            bloodPressure: formData.bloodPressure.trim(),
            pulse: formData.pulse
              ? Number(formData.pulse)
              : undefined,
            bloodSugar: formData.bloodSugar
              ? Number(formData.bloodSugar)
              : undefined,
            respiration: formData.respiration
              ? Number(formData.respiration)
              : undefined,
            temperature: formData.temperature
              ? Number(formData.temperature)
              : undefined,
            assessmentObservation:
              formData.assessmentObservation.trim(),
            treatment: formData.treatment.trim(),
            actionTaken: formData.actionTaken.trim(),
            additionalNotes: formData.additionalNotes.trim(),
            recommendationsFollowUp:
              formData.recommendationsFollowUp.trim(),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Could not update visit."
        );
      }

      const updatedVisit = await fetch(
        apiUrl(`/api/visits/${visitId}`),
        {
          credentials: "include",
        }
      );

      const updatedData = await updatedVisit.json();

      if (!updatedVisit.ok) {
        throw new Error(
          updatedData.error ||
            "Visit was updated but could not be reloaded."
        );
      }

      setVisit(updatedData);
      setFormData(createFormData(updatedData));
      setEditMode(false);
    } catch (err) {
      setFormError(
        err instanceof Error
          ? err.message
          : "Could not update visit."
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
            <div className="h-6 w-52 rounded bg-slate-200" />
            <div className="h-4 w-72 rounded bg-slate-200" />
            <div className="h-24 rounded-lg bg-slate-100" />
            <div className="h-48 rounded-lg bg-slate-100" />
          </div>
        </div>
      </AppShell>
    );
  }

  if (error || !visit) {
    return (
      <AppShell
        userRole={currentUser?.role ?? null}
        userName={currentUser?.fullName ?? "Clinic Staff"}
      >
        <div className="space-y-4 sm:space-y-6">
          <button
            type="button"
            onClick={() => navigate(`/patients/${patientId}`)}
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-igcc-700"
          >
            <ArrowLeft size={17} />
            Back to Patient Profile
          </button>

          <div className="rounded-xl border border-red-200 bg-red-50 p-5">
            <div className="flex items-start gap-3">
              <ShieldAlert
                size={20}
                className="mt-0.5 shrink-0 text-red-600"
              />

              <div>
                <p className="font-semibold text-red-800">
                  Visit could not be loaded
                </p>

                <p className="mt-1 text-sm text-red-700">
                  {error || "Visit not found."}
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
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
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

          {!editMode && (
            <button
              type="button"
              onClick={startEditing}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-igcc-700 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-igcc-800"
            >
              <Edit3 size={17} />
              Edit Visit
            </button>
          )}
        </div>

        <section className="overflow-hidden group relative overflow-hidden rounded-2xl border border-white/70 bg-white/65 shadow-[0_10px_35px_rgba(15,23,42,0.08)] backdrop-blur-2xl">
          <div className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-igcc-200/25 blur-3xl transition-all duration-300 group-hover:bg-igcc-200/40" />

          <div className="p-4 sm:p-8">
            <div className="flex flex-col gap-4 sm:gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-igcc-50 text-igcc-700">
                  <ClipboardList size={24} />
                </div>

                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Visit Details
                  </p>

                  <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                    Visit Details
                  </h1>

                  <p className="mt-2 text-sm font-medium text-slate-600">
                    {visit.reasonForVisit}
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    Visit ID:{" "}
                    <span className="font-semibold text-slate-700">
                      {visit.displayId}
                    </span>
                  </p>
                </div>
              </div>

              <div className="rounded-lg bg-igcc-50 px-4 py-3 lg:min-w-[220px]">
                <div className="flex items-center gap-2 text-igcc-700">
                  <CalendarDays size={17} />
                  <span className="text-xs font-bold uppercase tracking-wider">
                    Visit Date & Time
                  </span>
                </div>

                <p className="mt-1 font-semibold text-igcc-900">
                  {formatDateTime(visit.visitDateTime)}
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="group relative overflow-hidden rounded-2xl border border-white/70 bg-white/65 shadow-[0_10px_35px_rgba(15,23,42,0.08)] backdrop-blur-2xl">
          <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between sm:gap-5 sm:p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-igcc-50 text-igcc-700">
                <User size={21} />
              </div>

              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Patient
                </p>

                <p className="mt-0.5 text-lg font-bold text-slate-900">
                  {visit.patient.fullName}
                </p>
              </div>
            </div>

            <div className="rounded-lg bg-igcc-50 px-4 py-3">
              <p className="text-[11px] font-bold uppercase tracking-wider text-igcc-700">
                Patient ID
              </p>

              <p className="mt-0.5 font-semibold text-igcc-900">
                {visit.patient.displayId}
              </p>
            </div>
          </div>
        </section>

        {!editMode ? (
          <>
            <section className="group relative overflow-hidden rounded-2xl border border-white/70 bg-white/65 shadow-[0_10px_35px_rgba(15,23,42,0.08)] backdrop-blur-2xl">
              <SectionHeader
                
                icon={<FileText size={18} />}
                title="Visit Information"
                description="Basic information recorded for this clinic visit."
              />

              <div className="grid gap-4 p-4 sm:grid-cols-2 sm:gap-6 sm:p-6">

                <DisplayField
                  label="Reason for Visit"
                  value={visit.reasonForVisit}
                  icon={<ClipboardList size={15} />}
                />

                <div className="sm:col-span-2">
                  <DisplayField
                    label="Patient's Description / Complaint"
                    value={visit.complaintSymptoms}
                    icon={<FileText size={15} />}
                  />
                </div>
              </div>
            </section>

            <section className="group relative overflow-hidden rounded-2xl border border-white/70 bg-white/65 shadow-[0_10px_35px_rgba(15,23,42,0.08)] backdrop-blur-2xl">
              <SectionHeader
                
                icon={<Activity size={18} />}
                title="Vital Signs"
                description="Vital measurements recorded during the visit."
              />

              <div className="grid gap-3 p-4 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3 xl:grid-cols-5 sm:p-6">
                <VitalCard
                  label="Blood Pressure (mmHg)"
                  value={visit.bloodPressure}
                  icon={<HeartPulse size={16} />}
                />

                <VitalCard
                  label="Pulse (bpm)"
                  value={visit.pulse}
                  unit="bpm"
                  icon={<Activity size={16} />}
                />

                <VitalCard
                  label="Blood Sugar (mmol/L)"
                  value={visit.bloodSugar}
                  icon={<Activity size={16} />}
                />

                <VitalCard
                  label="Respiration (breaths/min)"
                  value={visit.respiration}
                  unit="breaths/min"
                  icon={<Activity size={16} />}
                />

                <VitalCard
                  label="Temperature (Ã‚Â°C)"
                  value={visit.temperature}
                  unit="Ã‚Â°C"
                  icon={<HeartPulse size={16} />}
                />
              </div>
            </section>

            <section className="group relative overflow-hidden rounded-2xl border border-white/70 bg-white/65 shadow-[0_10px_35px_rgba(15,23,42,0.08)] backdrop-blur-2xl">
              <SectionHeader
                
                icon={<Stethoscope size={18} />}
                title="Clinical Record"
                description="Clinical observations, treatment, actions, and follow-up."
              />

              <div className="grid gap-4 p-4 sm:grid-cols-2 sm:gap-6 sm:p-6">
                <DisplayField
                  label="Assessment / Observation"
                  value={visit.assessmentObservation}
                  icon={<Stethoscope size={15} />}
                />

                <DisplayField
                  label="Treatment"
                  value={visit.treatment}
                  icon={<HeartPulse size={15} />}
                />

                <DisplayField
                  label="Action Taken"
                  value={visit.actionTaken}
                  icon={<ClipboardList size={15} />}
                />

                <DisplayField
                  label="Additional Notes"
                  value={visit.additionalNotes}
                  icon={<FileText size={15} />}
                />

                <div className="sm:col-span-2">
                  <DisplayField
                    label="Recommendations / Follow-up"
                    value={visit.recommendationsFollowUp}
                    icon={<CalendarDays size={15} />}
                  />
                </div>
              </div>
            </section>

            <section className="group relative overflow-hidden rounded-2xl border border-white/70 bg-white/65 shadow-[0_10px_35px_rgba(15,23,42,0.08)] backdrop-blur-2xl">
              <SectionHeader
                
                icon={<User size={18} />}
                title="Visit Record Information"
                description="Information about when and by whom this record was created."
              />

              <div className="grid gap-4 p-4 sm:grid-cols-2 sm:gap-6 sm:p-6">
                <DisplayField
                  label="Recorded By"
                  value={visit.staff.fullName}
                  icon={<User size={15} />}
                />

                <DisplayField
                  label="Staff ID"
                  value={visit.staff.displayId}
                  icon={<User size={15} />}
                />

                <DisplayField
                  label="Created"
                  value={formatDateTime(visit.createdAt)}
                  icon={<CalendarDays size={15} />}
                />

                <DisplayField
                  label="Last Updated"
                  value={formatDateTime(visit.updatedAt)}
                  icon={<CalendarDays size={15} />}
                />
              </div>
            </section>
          </>
        ) : (
          <form onSubmit={saveChanges} className="space-y-4 sm:space-y-6">
            {formError && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3.5">
                <div className="flex items-start gap-3">
                  <ShieldAlert
                    size={19}
                    className="mt-0.5 shrink-0 text-red-600"
                  />

                  <div>
                    <p className="text-sm font-semibold text-red-800">
                      Unable to save changes
                    </p>

                    <p className="mt-1 text-sm text-red-700">
                      {formError}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {formData && (
              <>
                <section className="group relative overflow-hidden rounded-2xl border border-white/70 bg-white/65 shadow-[0_10px_35px_rgba(15,23,42,0.08)] backdrop-blur-2xl">
                  <SectionHeader
                    
                    icon={<CalendarDays size={18} />}
                    title="Visit Information"
                    description="Update the date, time, reason, and patient complaint."
                  />

                  <div className="grid gap-5 p-5 sm:grid-cols-2 sm:p-6">
                    <InputField
                      label="Visit Date & Time"
                      value={formData.visitDateTime}
                      onChange={(value) =>
                        updateField("visitDateTime", value)
                      }
                      type="datetime-local"
                    />

                    <InputField
                      label="Reason for Visit"
                      value={formData.reasonForVisit}
                      onChange={(value) =>
                        updateField("reasonForVisit", value)
                      }
                      required
                    />

                    <div className="sm:col-span-2">
                      <TextAreaField
                        label="Patient's Description / Complaint"
                        value={formData.complaintSymptoms}
                        onChange={(value) =>
                          updateField(
                            "complaintSymptoms",
                            value
                          )
                        }
                      />
                    </div>
                  </div>
                </section>

                <section className="group relative overflow-hidden rounded-2xl border border-white/70 bg-white/65 shadow-[0_10px_35px_rgba(15,23,42,0.08)] backdrop-blur-2xl">
                  <SectionHeader
                    
                    icon={<Activity size={18} />}
                    title="Vital Signs"
                    description="Update the patient's recorded vital measurements."
                  />

                  <div className="grid gap-4 p-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-5 sm:p-6">
                    <InputField
                      label="Blood Pressure (mmHg)"
                      value={formData.bloodPressure}
                      onChange={(value) =>
                        updateField("bloodPressure", value)
                      }
                    />

                    <InputField
                      label="Pulse (bpm)"
                      value={formData.pulse}
                      onChange={(value) =>
                        updateField("pulse", value)
                      }
                      type="number"
                    />

                    <InputField
                      label="Blood Sugar (mmol/L)"
                      value={formData.bloodSugar}
                      onChange={(value) =>
                        updateField("bloodSugar", value)
                      }
                      type="number"
                    />

                    <InputField
                      label="Respiration (breaths/min)"
                      value={formData.respiration}
                      onChange={(value) =>
                        updateField("respiration", value)
                      }
                      type="number"
                    />

                    <InputField
                      label="Temperature (Ã‚Â°C)"
                      value={formData.temperature}
                      onChange={(value) =>
                        updateField("temperature", value)
                      }
                      type="number"
                    />
                  </div>
                </section>

                <section className="group relative overflow-hidden rounded-2xl border border-white/70 bg-white/65 shadow-[0_10px_35px_rgba(15,23,42,0.08)] backdrop-blur-2xl">
                  <SectionHeader
                    
                    icon={<Stethoscope size={18} />}
                    title="Clinical Record"
                    description="Update the clinical assessment, treatment, notes, and follow-up."
                  />

                  <div className="space-y-4 p-4 sm:space-y-5 sm:p-6">
                    <TextAreaField
                      label="Assessment / Observation"
                      value={formData.assessmentObservation}
                      onChange={(value) =>
                        updateField(
                          "assessmentObservation",
                          value
                        )
                      }
                    />

                    <TextAreaField
                      label="Treatment"
                      value={formData.treatment}
                      onChange={(value) =>
                        updateField("treatment", value)
                      }
                    />

                    <TextAreaField
                      label="Action Taken"
                      value={formData.actionTaken}
                      onChange={(value) =>
                        updateField("actionTaken", value)
                      }
                    />

                    <TextAreaField
                      label="Additional Notes"
                      value={formData.additionalNotes}
                      onChange={(value) =>
                        updateField(
                          "additionalNotes",
                          value
                        )
                      }
                    />

                    <TextAreaField
                      label="Recommendations / Follow-up"
                      value={formData.recommendationsFollowUp}
                      onChange={(value) =>
                        updateField(
                          "recommendationsFollowUp",
                          value
                        )
                      }
                    />
                  </div>
                </section>

                <div className="flex flex-col-reverse gap-3 rounded-2xl border border-white/70 bg-white/55 p-4 shadow-[0_8px_25px_rgba(15,23,42,0.05)] backdrop-blur-xl sm:flex-row sm:justify-end sm:p-5">
                  <button
                    type="button"
                    onClick={cancelEditing}
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
              </>
            )}
          </form>
        )}
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

        @media (max-width: 639px) {
          .form-input {
            padding-top: 0.75rem;
            padding-bottom: 0.75rem;
          }
        }
      `}</style>
    </AppShell>
  );
}

