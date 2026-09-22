import { apiUrl } from "./api";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CalendarDays,
  ChevronRight,
  Search,
  UserPlus,
  Users,
} from "lucide-react";
import AppShell from "./components/layout/AppShell";

type Patient = {
  patientId: string;
  displayId: string;
  fullName: string;
  phone: string;
  patientCategory: "MEMBER" | "STAFF" | "GUEST" | "OTHER";
  dateOfBirth: string;
};

function Patients() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("ALL");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [userRole, setUserRole] = useState<
    "ADMIN" | "CLINIC_STAFF" | null
  >(null);
  const [userName, setUserName] = useState("Clinic Staff");
  const isFirstSearch = useRef(true);

  const navigate = useNavigate();

  async function loadPatients(searchTerm = "") {
    setLoading(true);
    setError("");

    try {
      const url = searchTerm
        ? apiUrl(`/api/patients?search=${encodeURIComponent(
            searchTerm
          )}`)
        : apiUrl("/api/patients");

      const response = await fetch(url, {
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Could not load patients.");
        return;
      }

      setPatients(data);
    } catch {
      setError("Unable to connect to the clinic server.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPatients();
  }, []);

  useEffect(() => {
    if (isFirstSearch.current) {
      isFirstSearch.current = false;
      return;
    }

    const timer = setTimeout(() => {
      loadPatients(search);
    }, 300);

    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    async function loadCurrentUser() {
      try {
        const response = await fetch(
          apiUrl("/api/users/me"),
          {
            credentials: "include",
          }
        );

        const data = await response.json();

        if (!response.ok) {
          return;
        }

        const user = data.user || data;

        setUserRole(user.role || null);
        setUserName(user.fullName || "Clinic Staff");
      } catch {
        // Keep the page usable if account information cannot be loaded.
      }
    }

    loadCurrentUser();
  }, []);

  const filteredPatients = patients.filter((patient) => {
    if (category === "ALL") {
      return true;
    }

    return patient.patientCategory === category;
  });

  function getCategoryLabel(
    patientCategory: Patient["patientCategory"]
  ) {
    switch (patientCategory) {
      case "MEMBER":
        return "Club Member";
      case "STAFF":
        return "Staff";
      case "GUEST":
        return "Guest / Visitor";
      case "OTHER":
        return "Other";
      default:
        return patientCategory;
    }
  }

  function getCategoryClasses(
    patientCategory: Patient["patientCategory"]
  ) {
    switch (patientCategory) {
      case "MEMBER":
        return "bg-igcc-50 text-igcc-700 ring-1 ring-inset ring-igcc-600/20";
      case "STAFF":
        return "bg-sky-50 text-sky-700 ring-1 ring-inset ring-sky-600/20";
      case "GUEST":
        return "bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-600/20";
      case "OTHER":
        return "bg-slate-100 text-slate-700 ring-1 ring-inset ring-slate-500/10";
      default:
        return "bg-slate-100 text-slate-700";
    }
  }

  function getInitials(fullName: string) {
    return fullName
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part.charAt(0).toUpperCase())
      .join("");
  }

  function formatDate(date: string) {
    if (!date) {
      return "â€”";
    }

    const parsed = new Date(date);

    if (Number.isNaN(parsed.getTime())) {
      return "â€”";
    }

    return parsed.toLocaleDateString();
  }

  return (
    <AppShell userRole={userRole} userName={userName}>
      <div className="space-y-6">
        <section className="overflow-hidden rounded-xl border border-igcc-border bg-white shadow-igcc-sm">
          <div className="h-2 bg-igcc-800" />

          <div className="p-4 sm:p-8">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-4">
                <div className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-igcc-50 text-igcc-700 sm:flex">
                  <Users size={24} strokeWidth={1.8} />
                </div>

                <div>
                  <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
                    <span>Clinic</span>
                    <ChevronRight size={14} />
                    <span className="text-slate-600">
                      Patients
                    </span>
                  </div>

                  <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:mt-1.5 sm:text-3xl">
                    Patients
                  </h1>

                  <p className="mt-1 text-sm leading-5 text-slate-500 sm:mt-1.5 sm:leading-6">
                    Search and manage clinic patient records.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => navigate("/new-patient")}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-igcc-700 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-igcc-800 active:bg-igcc-900"
              >
                <UserPlus size={18} strokeWidth={1.9} />
                Register New Patient
              </button>
            </div>
          </div>
        </section>

        <section className="rounded-xl border border-igcc-border bg-white shadow-igcc-sm">
          <div className="border-b border-igcc-border px-5 py-4 sm:px-6">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-igcc-50 text-igcc-700">
                <Search size={18} strokeWidth={1.9} />
              </div>

              <div>
                <h2 className="font-semibold text-slate-900">
                  Find a Patient
                </h2>

                <p className="mt-0.5 text-xs leading-5 text-slate-500">
                  Search by patient ID, name, or phone number.
                </p>
              </div>
            </div>
          </div>

          <div className="p-5 sm:p-6">
            <div className="flex flex-col gap-3 lg:flex-row">
              <div className="relative min-w-0 flex-1">
                <Search
                  size={18}
                  strokeWidth={1.8}
                  className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="text"
                  value={search}
                  onChange={(event) =>
                    setSearch(event.target.value)
                  }
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      loadPatients(search);
                    }
                  }}
                  placeholder="Search patient ID, name or phone..."
                  className="w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-10 pr-3.5 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 hover:border-slate-400 focus:border-igcc-500 focus:ring-2 focus:ring-igcc-500/20"
                />
              </div>

              <select
                value={category}
                onChange={(event) =>
                  setCategory(event.target.value)
                }
                className="rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-700 shadow-sm outline-none transition hover:border-slate-400 focus:border-igcc-500 focus:ring-2 focus:ring-igcc-500/20"
              >
                <option value="ALL">Patient Category</option>
                <option value="MEMBER">Club Member</option>
                <option value="STAFF">Staff</option>
                <option value="GUEST">Guest / Visitor</option>
                <option value="OTHER">Other</option>
              </select>

              <button
                type="button"
                onClick={() => loadPatients(search)}
                disabled={loading}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-igcc-700 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-igcc-800 disabled:cursor-not-allowed disabled:bg-slate-400"
              >
                <Search size={17} strokeWidth={1.9} />
                {loading ? "Searching..." : "Search"}
              </button>
            </div>
          </div>
        </section>

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3.5">
            <p className="text-sm font-semibold text-red-800">
              Unable to load patients
            </p>

            <p className="mt-1 text-sm text-red-700">
              {error}
            </p>
          </div>
        )}

        <section className="overflow-hidden rounded-xl border border-igcc-border bg-white shadow-igcc-sm">
          <div className="flex flex-col gap-3 border-b border-igcc-border px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-semibold text-slate-900">
                  Patient Records
                </h2>

                {!loading && (
                  <span className="rounded-full bg-igcc-50 px-2 py-0.5 text-[11px] font-bold text-igcc-700">
                    {filteredPatients.length}
                  </span>
                )}
              </div>

              <p className="mt-0.5 text-xs text-slate-500">
                Patient information currently available in the clinic.
              </p>
            </div>

            <div className="hidden h-9 w-9 items-center justify-center rounded-lg bg-slate-50 text-slate-500 sm:flex">
              <Users size={18} strokeWidth={1.8} />
            </div>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
              <div className="mb-4 h-9 w-9 animate-spin rounded-full border-2 border-slate-200 border-t-igcc-600" />

              <p className="text-sm font-semibold text-slate-700">
                Loading patients...
              </p>

              <p className="mt-1 text-xs text-slate-500">
                Please wait while patient records are retrieved.
              </p>
            </div>
          ) : filteredPatients.length === 0 ? (
            <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-500">
                <Users size={25} strokeWidth={1.8} />
              </div>

              <h3 className="font-semibold text-slate-900">
                No patients found
              </h3>

              <p className="mt-1 max-w-sm text-sm leading-6 text-slate-500">
                Try a different search term or category, or register
                a new patient.
              </p>

              <button
                type="button"
                onClick={() => navigate("/new-patient")}
                className="mt-4 inline-flex items-center gap-2 rounded-lg border border-igcc-300 bg-white px-4 py-2 text-sm font-semibold text-igcc-700 shadow-sm transition hover:bg-igcc-50"
              >
                <UserPlus size={17} strokeWidth={1.8} />
                Register Patient
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[820px]">
                <thead>
                  <tr className="border-b border-igcc-border bg-slate-50/80">
                    <th className="px-5 py-3.5 text-left text-[11px] font-bold uppercase tracking-wider text-slate-500">
                      Patient ID
                    </th>

                    <th className="px-5 py-3.5 text-left text-[11px] font-bold uppercase tracking-wider text-slate-500">
                      Patient
                    </th>

                    <th className="px-5 py-3.5 text-left text-[11px] font-bold uppercase tracking-wider text-slate-500">
                      Category
                    </th>

                    <th className="px-5 py-3.5 text-left text-[11px] font-bold uppercase tracking-wider text-slate-500">
                      Phone
                    </th>

                    <th className="px-5 py-3.5 text-left text-[11px] font-bold uppercase tracking-wider text-slate-500">
                      Date of Birth
                    </th>

                    <th className="px-5 py-3.5 text-right text-[11px] font-bold uppercase tracking-wider text-slate-500">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {filteredPatients.map((patient) => (
                    <tr
                      key={patient.patientId}
                      className="group transition hover:bg-igcc-50/30"
                    >
                      <td className="whitespace-nowrap px-5 py-4">
                        <span className="rounded-md bg-slate-50 px-2 py-1 font-mono text-xs font-semibold text-igcc-700">
                          {patient.displayId}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <button
                          type="button"
                          onClick={() =>
                            navigate(
                              `/patients/${patient.patientId}`
                            )
                          }
                          className="flex items-center gap-3 text-left"
                        >
                          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-igcc-100 text-xs font-bold text-igcc-800">
                            {getInitials(patient.fullName)}
                          </span>

                          <span>
                            <span className="block font-semibold text-slate-900 transition group-hover:text-igcc-700">
                              {patient.fullName}
                            </span>

                            <span className="mt-0.5 block text-xs text-slate-400">
                              Open patient profile
                            </span>
                          </span>
                        </button>
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${getCategoryClasses(
                            patient.patientCategory
                          )}`}
                        >
                          {getCategoryLabel(
                            patient.patientCategory
                          )}
                        </span>
                      </td>

                      <td className="whitespace-nowrap px-5 py-4 text-sm text-slate-600">
                        {patient.phone || "â€”"}
                      </td>

                      <td className="whitespace-nowrap px-5 py-4">
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <CalendarDays
                            size={15}
                            className="text-slate-400"
                          />
                          {formatDate(patient.dateOfBirth)}
                        </div>
                      </td>

                      <td className="px-5 py-4 text-right">
                        <button
                          type="button"
                          onClick={() =>
                            navigate(
                              `/patients/${patient.patientId}`
                            )
                          }
                          className="inline-flex items-center gap-1.5 rounded-lg border border-igcc-200 bg-white px-3 py-2 text-xs font-semibold text-igcc-700 transition hover:border-igcc-300 hover:bg-igcc-50"
                        >
                          View Profile
                          <ChevronRight
                            size={15}
                            strokeWidth={1.9}
                          />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </AppShell>
  );
}

export default Patients;






