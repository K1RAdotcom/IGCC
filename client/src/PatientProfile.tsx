import { apiUrl } from "./api";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Activity,
  ArrowLeft,
  CalendarDays,
  ChevronRight,
  Clock3,
  FileText,
  HeartPulse,
  Mail,
  MapPin,
  Phone,
  Plus,
  Pencil,
  ShieldAlert,
  Stethoscope,
  User,
  Users,
} from "lucide-react";

import AppShell from "./components/layout/AppShell";

type Staff = {
  displayId: string;
  fullName: string;
  username: string;
};

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
  staff: Staff;
};

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
  createdAt: string;
  updatedAt: string;
  visits: Visit[];
};

type CurrentUser = {
  fullName?: string;
  role?: "ADMIN" | "CLINIC_STAFF";
};

const categoryStyles: Record<
  Patient["patientCategory"],
  { label: string; className: string }
> = {
  MEMBER: {
    label: "Club Member",
    className: "bg-igcc-50 text-igcc-700 ring-igcc-200",
  },
  STAFF: {
    label: "Staff",
    className: "bg-blue-50 text-blue-700 ring-blue-200",
  },
  GUEST: {
    label: "Guest / Visitor",
    className: "bg-amber-50 text-amber-700 ring-amber-200",
  },
  OTHER: {
    label: "Other",
    className: "bg-slate-100 text-slate-700 ring-slate-200",
  },
};

function PatientProfile() {
  const { patientId } = useParams();
  const navigate = useNavigate();

  const [patient, setPatient] = useState<Patient | null>(null);
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadData() {
      if (!patientId) {
        setError("Patient ID is missing.");
        setLoading(false);
        return;
      }

      try {
        const [patientResponse, userResponse] = await Promise.all([
          fetch(
            apiUrl(`/api/patient-profile/${patientId}`),
            {
              credentials: "include",
            }
          ),
          fetch(apiUrl("/api/users/me"), {
            credentials: "include",
          }),
        ]);

        const patientData = await patientResponse.json();

        if (!patientResponse.ok) {
          setError(
            patientData.error || "Could not load patient profile."
          );
          return;
        }

        setPatient(patientData);

        if (userResponse.ok) {
          const userData = await userResponse.json();
          setCurrentUser(userData);
        }
      } catch {
        setError("Unable to connect to the clinic server.");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [patientId]);

  const sortedVisits = useMemo(() => {
    if (!patient) return [];

    return [...patient.visits].sort(
      (a, b) =>
        new Date(b.visitDateTime).getTime() -
        new Date(a.visitDateTime).getTime()
    );
  }, [patient]);

  const latestVisit = sortedVisits[0] ?? null;

  function calculateAge(dateOfBirth: string) {
    const birthDate = new Date(dateOfBirth);
    const today = new Date();

    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();

    if (
      monthDifference < 0 ||
      (monthDifference === 0 &&
        today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age;
  }

  function formatDate(date: string) {
    return new Date(date).toLocaleDateString(undefined, {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }

  function formatDateTime(date: string) {
    return new Date(date).toLocaleString(undefined, {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  }

  function displayValue(value?: string | number | null) {
    if (value === null || value === undefined || value === "") {
      return "Not recorded";
    }

    return String(value);
  }

  function getInitials(name: string) {
    return name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part.charAt(0).toUpperCase())
      .join("");
  }

  if (loading) {
    return (
      <AppShell
        userRole={currentUser?.role ?? null}
        userName={currentUser?.fullName ?? "Clinic Staff"}
      >
        <div className="space-y-6">
          <div className="h-5 w-28 animate-pulse rounded bg-slate-200" />
          <div className="rounded-xl border border-igcc-border bg-white p-6 shadow-igcc-sm">
            <div className="flex items-center gap-4">
              <div className="h-20 w-20 animate-pulse rounded-full bg-slate-200" />
              <div className="space-y-3">
                <div className="h-6 w-56 animate-pulse rounded bg-slate-200" />
                <div className="h-4 w-36 animate-pulse rounded bg-slate-200" />
              </div>
            </div>
          </div>
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="h-72 animate-pulse rounded-xl bg-white shadow-igcc-sm" />
            <div className="h-72 animate-pulse rounded-xl bg-white shadow-igcc-sm lg:col-span-2" />
          </div>
        </div>
      </AppShell>
    );
  }

  if (error || !patient) {
    return (
      <AppShell
        userRole={currentUser?.role ?? null}
        userName={currentUser?.fullName ?? "Clinic Staff"}
      >
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="w-full max-w-md rounded-xl border border-red-200 bg-white p-8 text-center shadow-igcc-sm">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-600">
              <ShieldAlert size={23} />
            </div>

            <h2 className="mt-4 text-lg font-semibold text-slate-900">
              Unable to load patient
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              {error || "The requested patient profile could not be found."}
            </p>

            <button
              onClick={() => navigate("/patients")}
              className="mt-6 inline-flex items-center gap-2 rounded-lg bg-igcc-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-igcc-800"
            >
              <ArrowLeft size={17} />
              Back to Patients
            </button>
          </div>
        </div>
      </AppShell>
    );
  }

  const category = categoryStyles[patient.patientCategory];
  const age = calculateAge(patient.dateOfBirth);

  return (
    <AppShell
      userRole={currentUser?.role ?? null}
      userName={currentUser?.fullName ?? "Clinic Staff"}
    >
      <div className="space-y-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <button
            onClick={() => navigate("/patients")}
            className="inline-flex w-fit items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-igcc-700"
          >
            <ArrowLeft size={17} />
            Back to Patients
          </button>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => navigate(`/patients/${patient.patientId}/edit`)}
              className="order-2 inline-flex items-center justify-center gap-2 rounded-lg border border-igcc-300 bg-white px-4 py-2.5 text-sm font-semibold text-igcc-700 shadow-sm transition hover:bg-igcc-50 hover:border-igcc-400"
            >
              <Pencil size={17} />
              Edit Patient
            </button>
            <button
              onClick={() => navigate(`/patients/${patient.patientId}/new-visit`)}
            className="order-1 inline-flex items-center justify-center gap-2 rounded-lg bg-igcc-700 px-3 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-igcc-800 sm:order-none sm:px-4 sm:py-2.5"
          >
            <Plus size={17} />
            Record New Visit
          </button>
            </div>
          </div>

        <section className="overflow-hidden rounded-xl border border-igcc-border bg-white shadow-igcc-sm">
          <div className="h-2 bg-igcc-800" />

          <div className="p-5 sm:p-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex min-w-0 items-center gap-4 sm:gap-5">
                {patient.profilePhoto ? (
                  <img
                    src={patient.profilePhoto}
                    alt={patient.fullName}
                    className="h-16 w-16 shrink-0 rounded-full object-cover ring-4 ring-igcc-50 sm:h-20 sm:w-20"
                  />
                ) : (
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-igcc-100 text-lg font-bold text-igcc-800 ring-4 ring-igcc-50 sm:h-20 sm:w-20 sm:text-xl">
                    {getInitials(patient.fullName)}
                  </div>
                )}

                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h1 className="min-w-0 break-words text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                      {patient.fullName}
                    </h1>

                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${category.className}`}
                    >
                      {category.label}
                    </span>
                  </div>

                  <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-500">
                    <span className="font-medium text-slate-700">
                      {patient.displayId}
                    </span>

                    <span className="hidden text-slate-300 sm:inline">
                      \u2022
                    </span>

                    <span className="sm:hidden">{age} yrs</span>
                    <span className="hidden sm:inline">{age} years old</span>

                    {patient.gender && (
                      <>
                        <span className="hidden text-slate-300 sm:inline">
                          \u2022
                        </span>
                        <span>{patient.gender}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 sm:flex sm:gap-3">
                <div className="rounded-lg bg-slate-50 px-3 py-2.5 sm:px-4 sm:py-3">
                  <p className="text-xs font-medium text-slate-500">
                    Total Visits
                  </p>
                  <p className="mt-0.5 text-lg font-bold text-slate-900 sm:mt-1 sm:text-xl">
                    {patient.visits.length}
                  </p>
                </div>

                <div className="rounded-lg bg-igcc-50 px-3 py-2.5 sm:px-4 sm:py-3">
                  <p className="text-xs font-medium text-igcc-700">
                    Latest Visit
                  </p>
                  <p className="mt-0.5 text-sm font-bold text-igcc-900 sm:mt-1">
                    {latestVisit
                      ? formatDate(latestVisit.visitDateTime)
                      : "None"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="space-y-6">
            <section className="rounded-xl border border-igcc-border bg-white shadow-igcc-sm">
              <div className="border-b border-igcc-border px-5 py-4">
                <div className="flex items-center gap-2">
                  <User size={18} className="text-igcc-700" />
                  <h2 className="font-semibold text-slate-900">
                    Personal Information
                  </h2>
                </div>
              </div>

              <div className="space-y-4 p-5">
                <InfoRow
                  icon={<CalendarDays size={16} />}
                  label="Date of Birth"
                  value={`${formatDate(patient.dateOfBirth)} (${age} years)`}
                />

                <InfoRow
                  icon={<Phone size={16} />}
                  label="Primary Phone"
                  value={patient.phone}
                  phone
                />

                <InfoRow
                  icon={<Phone size={16} />}
                  label="Secondary Phone"
                  value={displayValue(patient.secondaryPhone)}
                  phone
                />

                <InfoRow
                  icon={<Mail size={16} />}
                  label="Email"
                  value={displayValue(patient.email)}
                />

                <InfoRow
                  icon={<MapPin size={16} />}
                  label="Address"
                  value={displayValue(patient.address)}
                />

                <InfoRow
                  icon={<Users size={16} />}
                  label="Golf Club Membership"
                  value={displayValue(patient.golfClubMembership)}
                />
              </div>
            </section>

            <section className="rounded-xl border border-igcc-border bg-white shadow-igcc-sm">
              <div className="border-b border-igcc-border px-5 py-4">
                <div className="flex items-center gap-2">
                  <ShieldAlert size={18} className="text-red-600" />
                  <h2 className="font-semibold text-slate-900">
                    Emergency Contact
                  </h2>
                </div>
              </div>

              <div className="space-y-4 p-5">
                <InfoRow
                  icon={<User size={16} />}
                  label="Contact Name"
                  value={patient.emergencyContactName}
                />

                <InfoRow
                  icon={<Phone size={16} />}
                  label="Contact Phone"
                  value={patient.emergencyContactPhone}
                  phone
                />
              </div>
            </section>

            <section className="rounded-xl border border-igcc-border bg-white shadow-igcc-sm">
              <div className="border-b border-igcc-border px-5 py-4">
                <div className="flex items-center gap-2">
                  <FileText size={18} className="text-igcc-700" />
                  <h2 className="font-semibold text-slate-900">
                    Medical & Additional Information
                  </h2>
                </div>
              </div>

              <div className="space-y-5 p-5">
                <TextSection
                  label="Relevant Medical / Physical Information"
                  value={patient.medicalPhysicalInformation}
                />

                <TextSection
                  label="Additional Notes"
                  value={patient.additionalNotes}
                />
              </div>
            </section>
          </div>

          <div className="lg:col-span-2">
            <section className="rounded-xl border border-igcc-border bg-white shadow-igcc-sm">
              <div className="flex flex-col gap-3 border-b border-igcc-border px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <Activity size={18} className="text-igcc-700" />
                    <h2 className="font-semibold text-slate-900">
                      Visit History
                    </h2>
                  </div>

                  <p className="mt-1 text-xs text-slate-500">
                    Complete clinical history for this patient
                  </p>
                </div>

                <span className="w-fit rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
                  {patient.visits.length}{" "}
                  {patient.visits.length === 1 ? "visit" : "visits"}
                </span>
              </div>

              {sortedVisits.length === 0 ? (
                <div className="px-6 py-10 text-center sm:py-16">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-igcc-50 text-igcc-700">
                    <Stethoscope size={22} />
                  </div>

                  <h3 className="mt-4 text-sm font-semibold text-slate-900">
                    No visits recorded
                  </h3>

                  <p className="mx-auto mt-1 max-w-sm text-sm text-slate-500">
                    This patient does not have any recorded clinic visits yet.
                  </p>

                  <button
                    onClick={() =>
                      navigate(`/patients/${patient.patientId}/new-visit`)
                    }
                    className="mt-5 inline-flex items-center gap-2 rounded-lg bg-igcc-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-igcc-800"
                  >
                    <Plus size={16} />
                    Record First Visit
                  </button>
                </div>
              ) : (
                <div className="divide-y divide-igcc-border">
                  {sortedVisits.map((visit, index) => (
                    <article
                      key={visit.visitId}
                      className="p-5 transition hover:bg-slate-50/70 sm:p-6"
                    >
                      <div className="flex flex-col gap-4">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                          <div className="flex gap-3">
                            <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-igcc-50 text-igcc-700">
                              {index === 0 ? (
                                <HeartPulse size={19} />
                              ) : (
                                <Stethoscope size={18} />
                              )}
                            </div>

                            <div>
                              <div className="flex flex-wrap items-center gap-2">
                                <h3 className="font-semibold text-slate-900">
                                  {visit.reasonForVisit}
                                </h3>

                                {index === 0 && (
                                  <span className="rounded-full bg-igcc-50 px-2 py-0.5 text-[11px] font-semibold text-igcc-700">
                                    Latest
                                  </span>
                                )}
                              </div>

                              <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
                                <span className="font-medium text-slate-600">
                                  {visit.displayId}
                                </span>

                                <span className="flex items-center gap-1">
                                  <Clock3 size={13} />
                                  {formatDateTime(visit.visitDateTime)}
                                </span>
                              </div>
                            </div>
                          </div>

                          <button
                            onClick={() =>
                              navigate(`/patients/${patient.patientId}/visits/${visit.visitId}`)
                            }
                            className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-igcc-border px-3 py-2 text-xs font-semibold text-slate-600 transition hover:border-igcc-300 hover:bg-white hover:text-igcc-700"
                          >
                            View Details
                            <ChevronRight size={15} />
                          </button>
                        </div>

                        <div className="grid gap-3 sm:grid-cols-2">
                          <VisitSummary
                            label="Patient's Description / Complaint"
                            value={visit.complaintSymptoms}
                            wide
                          />

                          <VisitSummary
                            label="Assessment / Observation"
                            value={visit.assessmentObservation}
                            wide
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                          <Vital
                            label="Blood Pressure"
                            value={visit.bloodPressure}
                          />
                          <Vital
                            label="Pulse"
                            value={
                              visit.pulse !== null &&
                              visit.pulse !== undefined
                                ? `${visit.pulse} bpm`
                                : null
                            }
                          />
                          <Vital
                            label="Blood Sugar"
                            value={
                              visit.bloodSugar !== null &&
                              visit.bloodSugar !== undefined
                                ? String(visit.bloodSugar)
                                : null
                            }
                          />
                          <Vital
                            label="Temperature"
                            value={
  visit.temperature !== null &&
  visit.temperature !== undefined
    ? `${visit.temperature} \u00B0C`
    : null
}
                          />
                        </div>

                        <div className="grid gap-3 sm:grid-cols-2">
                          <VisitSummary
                            label="Treatment"
                            value={visit.treatment}
                          />

                          <VisitSummary
                            label="Action Taken"
                            value={visit.actionTaken}
                          />
                        </div>

                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-slate-100 pt-3 text-xs text-slate-500">
                          <span>
                            Recorded by{" "}
                            <span className="font-medium text-slate-700">
                              {visit.staff.fullName}
                            </span>
                          </span>

                          <span className="hidden text-slate-300 sm:inline">
                            \u2022
                          </span>

                          <span>{visit.staff.displayId}</span>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </section>
          </div>
        </div>

        <div className="rounded-xl border border-igcc-200 bg-igcc-50/60 px-5 py-4">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 text-igcc-700">
              <FileText size={17} />
            </div>

            <div>
              <p className="text-sm font-semibold text-igcc-900">
                Patient record
              </p>
              <p className="mt-1 text-xs leading-5 text-igcc-800/80">
                Patient ID {patient.displayId} was registered on{" "}
                {formatDate(patient.createdAt)}. Visit records are maintained
                as individual encounters and are not overwritten by later
                visits.
              </p>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

function InfoRow({
  icon,
  label,
  value,
  phone,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  phone?: boolean;
}) {
  const isRecorded = value !== "Not recorded";

  return (
    <div className="flex gap-3">
      <div className="mt-0.5 shrink-0 text-slate-400">{icon}</div>

      <div className="min-w-0">
        <p className="text-xs font-medium text-slate-500">{label}</p>

        {phone && isRecorded ? (
          <a
            href={`tel:${value}`}
            className="mt-0.5 inline-flex min-h-11 items-center break-all text-sm font-medium text-igcc-700 underline-offset-2 hover:underline"
          >
            {value}
          </a>
        ) : (
          <p className="mt-0.5 break-words text-sm font-medium text-slate-800">
            {value}
          </p>
        )}
      </div>
    </div>
  );
}

function TextSection({
  label,
  value,
}: {
  label: string;
  value?: string | null;
}) {
  return (
    <div>
      <p className="text-xs font-semibold text-slate-500">{label}</p>

      <div className="mt-2 rounded-lg bg-slate-50 px-3.5 py-3">
        <p className="whitespace-pre-wrap text-sm leading-6 text-slate-700">
          {value?.trim() ? value : "Not recorded"}
        </p>
      </div>
    </div>
  );
}

function VisitSummary({
  label,
  value,
  wide = false,
}: {
  label: string;
  value?: string | null;
  wide?: boolean;
}) {
  return (
    <div
      className={`rounded-lg bg-slate-50 p-3 ${
        wide ? "sm:min-h-[92px]" : ""
      }`}
    >
      <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
        {label}
      </p>

      <p className="mt-1.5 whitespace-pre-wrap text-sm leading-5 text-slate-700">
        {value?.trim() ? value : "Not recorded"}
      </p>
    </div>
  );
}

function Vital({
  label,
  value,
}: {
  label: string;
  value?: string | null;
}) {
  return (
    <div className="rounded-lg border border-slate-100 bg-white px-3 py-2.5">
      <p className="text-[11px] font-medium text-slate-400">{label}</p>
      <p className="mt-1 text-sm font-semibold text-slate-800">
        {value || "Not recorded"}
      </p>
    </div>
  );
}

export default PatientProfile;
















