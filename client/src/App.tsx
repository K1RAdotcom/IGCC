import { apiUrl } from "./api";
import React, { useEffect, useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";
import {
  AlertCircle,
  ClipboardList,
  KeyRound,
  LogIn,
  User,
  UserCircle,
  UserPlus,
  Users,
} from "lucide-react";
import Register from "./Register";
import ClinicSettings from "./pages/ClinicSettings";
import Patients from "./Patients";
import PatientProfile from "./PatientProfile";
import NewVisit from "./NewVisit";
import EditPatient from "./EditPatient";
import VisitDetails from "./VisitDetails";
import NewPatient from "./NewPatient";
import EditProfile from "./EditProfile";
import ChangePassword from "./ChangePassword";
import MyAccount from "./MyAccount";
import AddStaffAccount from "./AddStaffAccount";
import AuditLogs from "./AuditLogs";
import StaffManagement from "./StaffManagement";
import AppShell from "./components/layout/AppShell";

type DashboardStats = {
  totalPatients: number;
  totalVisits: number;
  todaysVisits: number;
  newPatients: number;
};



function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  async function handleLogin(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch(
        apiUrl("/api/auth/login"),
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ username, password }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Login failed.");
        return;
      }

      navigate("/dashboard");
    } catch {
      setError("Unable to connect to the clinic server.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-igcc-background px-4 py-8 sm:px-6">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-md items-center justify-center">
        <div className="w-full overflow-hidden rounded-xl border border-igcc-border bg-white shadow-igcc-md">
          <div className="h-2 bg-igcc-800" />

          <div className="p-6 sm:p-8">
            {/* Header */}
            <div className="mb-7 text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-igcc-50 text-igcc-700">
                <img src="/igcc-logo.png" alt="Ikeja Golf Club Clinic" className="h-14 w-14 object-contain" />
              </div>

              <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                Ikeja Golf Club Clinic
              </h1>

              <p className="mt-1.5 text-sm text-slate-500">
                Clinic Management System
              </p>
            </div>

            {/* Error */}
            {error && (
              <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3">
                <div className="flex items-start gap-3">
                  <AlertCircle
                    size={18}
                    className="mt-0.5 shrink-0 text-red-600"
                  />

                  <p className="text-sm text-red-700">
                    {error}
                  </p>
                </div>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-5">
              {/* Username */}
              <div>
                <label
                  htmlFor="login-username"
                  className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500"
                >
                  Username
                </label>

                <div className="relative">
                  <User
                    size={17}
                    strokeWidth={1.8}
                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    id="login-username"
                    type="text"
                    value={username}
                    onChange={(event) =>
                      setUsername(event.target.value)
                    }
                    placeholder="Enter your username"
                    required
                    className="w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-10 pr-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-igcc-800 focus:ring-2 focus:ring-igcc-800/10"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="login-password"
                  className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500"
                >
                  Password
                </label>

                <div className="relative">
                  <KeyRound
                    size={17}
                    strokeWidth={1.8}
                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    id="login-password"
                    type="password"
                    value={password}
                    onChange={(event) =>
                      setPassword(event.target.value)
                    }
                    placeholder="Enter your password"
                    required
                    className="w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-10 pr-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-igcc-800 focus:ring-2 focus:ring-igcc-800/10"
                  />
                </div>
              </div>

              {/* Login */}
              <button
                type="submit"
                disabled={loading}
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-igcc-700 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-igcc-800 disabled:cursor-not-allowed disabled:bg-slate-400"
              >
                <LogIn size={17} strokeWidth={1.8} />
                {loading ? "Signing in..." : "Login"}
              </button>
            </form>

            {/* Register */}
            <div className="mt-6 border-t border-slate-200 pt-5 text-center">
              <p className="mb-3 text-sm text-slate-500">
                Need an account?
              </p>

              <button
                type="button"
                onClick={() => navigate("/register")}
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 hover:text-igcc-800"
              >
                <UserPlus size={17} strokeWidth={1.8} />
                Create Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [userRole, setUserRole] = useState<"ADMIN" | "CLINIC_STAFF" | null>(
    null
  );
  const [userName, setUserName] = useState("Clinic Staff");
  const [error, setError] = useState("");
  const navigate = useNavigate();

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
          setError(data.error || "Could not load account information.");
          return;
        }

        setUserRole(data.user.role);
        setUserName(data.user.fullName || "Clinic Staff");
      } catch {
        setError("Unable to load account information.");
      }
    }

    loadCurrentUser();
  }, []);

  useEffect(() => {
    async function loadDashboardStats() {
      try {
        const response = await fetch(
          apiUrl("/api/dashboard/stats"),
          {
            credentials: "include",
          }
        );

        const data = await response.json();

        if (!response.ok) {
          setError(data.error || "Could not load dashboard.");
          return;
        }

        setStats(data);
      } catch {
        setError("Unable to connect to the clinic server.");
      }
    }

    loadDashboardStats();
  }, []);

  return (
    <AppShell userRole={userRole} userName={userName}>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Dashboard
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Welcome to the Ikeja Golf Club Clinic Management System.
          </p>
        </div>

        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            {error}
          </div>
        )}

        <section>
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            <div className="rounded-xl border border-igcc-border bg-white p-6 shadow-igcc-sm">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    Total Patients
                  </p>

                  <p className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
                    {stats ? stats.totalPatients : "..."}
                  </p>
                </div>

                <div className="rounded-lg bg-igcc-50 p-3 text-igcc-700">
                  <Users size={21} strokeWidth={1.8} />
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-igcc-border bg-white p-6 shadow-igcc-sm">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    Today's Visits
                  </p>

                  <p className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
                    {stats ? stats.todaysVisits : "..."}
                  </p>
                </div>

                <div className="rounded-lg bg-igcc-50 p-3 text-igcc-700">
                  <ClipboardList size={21} strokeWidth={1.8} />
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-igcc-border bg-white p-6 shadow-igcc-sm">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    New Patients Today
                  </p>

                  <p className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
                    {stats ? stats.newPatients : "..."}
                  </p>
                </div>

                <div className="rounded-lg bg-igcc-50 p-3 text-igcc-700">
                  <UserCircle size={21} strokeWidth={1.8} />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section>
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-slate-900">
              Quick Actions
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Common clinic tasks
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <button
              onClick={() => navigate("/patients")}
              className="group rounded-xl border border-igcc-border bg-white p-5 text-left shadow-igcc-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-igcc-200 hover:shadow-igcc-md"
            >
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-igcc-50 text-igcc-700 transition group-hover:bg-igcc-100">
                <Users size={20} strokeWidth={1.8} />
              </div>

              <h3 className="font-semibold text-slate-900">
                Search Patients
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Find and review patient records.
              </p>
            </button>

            <button
              onClick={() => navigate("/new-patient")}
              className="group rounded-xl border border-igcc-border bg-white p-5 text-left shadow-igcc-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-igcc-200 hover:shadow-igcc-md"
            >
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-igcc-50 text-igcc-700 transition group-hover:bg-igcc-100">
                <UserCircle size={20} strokeWidth={1.8} />
              </div>

              <h3 className="font-semibold text-slate-900">
                Register New Patient
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Create a new patient record.
              </p>
            </button>

            <button
              onClick={() => navigate("/patients")}
              className="group rounded-xl border border-igcc-border bg-white p-5 text-left shadow-igcc-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-igcc-200 hover:shadow-igcc-md"
            >
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-igcc-50 text-igcc-700 transition group-hover:bg-igcc-100">
                <ClipboardList size={20} strokeWidth={1.8} />
              </div>

              <h3 className="font-semibold text-slate-900">
                Record New Visit
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Select a patient and record a visit.
              </p>
            </button>
          </div>
        </section>
      </div>
    </AppShell>
  );
}
function Placeholder({ title }: { title: string }) {
  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-igcc-border bg-white p-6 shadow-igcc-sm">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          {title}
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          This section will be built next.
        </p>
      </div>
    </div>
  );
}
function AdminRoute({ children }: { children: React.ReactNode }) {
  const [checking, setChecking] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    async function checkAdmin() {
      try {
        const response = await fetch(
          apiUrl("/api/users/me"),
          {
            credentials: "include",
          }
        );

        const data = await response.json();

        if (response.ok && data.user?.role === "ADMIN") {
          setIsAdmin(true);
        }
      } catch {
        setIsAdmin(false);
      } finally {
        setChecking(false);
      }
    }

    checkAdmin();
  }, []);

  if (checking) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="rounded-xl border border-igcc-border bg-white px-6 py-5 shadow-igcc-sm">
          <p className="text-sm font-medium text-slate-500">
            Checking permissions...
          </p>
        </div>
      </div>
    );
  }
  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />

        <Route
  path="/admin/clinic-settings"
  element={
    <AdminRoute>
      <ClinicSettings />
    </AdminRoute>
  }
/>
  

        <Route path="/patients" element={<Patients />} />
        <Route
          path="/patients/:patientId"
          element={<PatientProfile />}
        />
        <Route
          path="/patients/:patientId/new-visit"
          element={<NewVisit />}
        />
        <Route
          path="/patients/:patientId/edit"
          element={<EditPatient />}
        />
        <Route
          path="/patients/:patientId/visits/:visitId"
          element={<VisitDetails />}
        />

        <Route
          path="/new-patient"
          element={<NewPatient />}
        />

        <Route
          path="/new-visit"
          element={<Placeholder title="Record New Visit" />}
        />

        <Route
          path="/account/edit"
          element={<EditProfile />}
        />

        <Route
          path="/account/change-password"
          element={<ChangePassword />}
        />

        <Route
          path="/account"
          element={<MyAccount />}
        />

        <Route
          path="/admin/staff/add"
          element={
            <AdminRoute>
              <AddStaffAccount />
            </AdminRoute>
          }
        />

        <Route
  path="/admin/audit-logs"
  element={
    <AdminRoute>
      <AuditLogs />
    </AdminRoute>
  }
/>

        <Route
  path="/admin/staff"
  element={
    <AdminRoute>
      <StaffManagement />
    </AdminRoute>
  }
/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;






