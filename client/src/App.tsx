import React, { useEffect, useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";
import {
  ClipboardList,
  UserCircle,
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
      const response = await fetch("http://localhost:4000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ username, password }),
      });

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
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#f4f7f6",
        padding: "20px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "420px",
          background: "white",
          padding: "40px",
          borderRadius: "12px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "30px" }}>
          <h1 style={{ margin: 0, fontSize: "28px", color: "#173f35" }}>
            Ikeja Golf Club Clinic
          </h1>

          <p style={{ marginTop: "8px", color: "#666" }}>
            Clinic Management System
          </p>
        </div>

        <form onSubmit={handleLogin}>
          <label>Username</label>

          <input
            type="text"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            placeholder="Enter your username"
            required
            style={{
              width: "100%",
              boxSizing: "border-box",
              padding: "12px",
              margin: "8px 0 20px",
              border: "1px solid #ccc",
              borderRadius: "6px",
            }}
          />

          <label>Password</label>

          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Enter your password"
            required
            style={{
              width: "100%",
              boxSizing: "border-box",
              padding: "12px",
              margin: "8px 0 20px",
              border: "1px solid #ccc",
              borderRadius: "6px",
            }}
          />

          {error && (
            <div
              style={{
                background: "#fdecec",
                color: "#b42318",
                padding: "10px",
                borderRadius: "6px",
                marginBottom: "20px",
              }}
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "13px",
              border: "none",
              borderRadius: "6px",
              background: "#173f35",
              color: "white",
              fontSize: "16px",
              fontWeight: "bold",
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "Signing in..." : "Login"}
          </button>
        </form>

        <div
          style={{
            marginTop: "20px",
            textAlign: "center",
          }}
        >
          <p
            style={{
              marginBottom: "10px",
              color: "#6b7280",
            }}
          >
            Need an account?
          </p>

          <button
            type="button"
            onClick={() => navigate("/register")}
            style={{
              width: "100%",
              padding: "11px",
              border: "1px solid #1f4d3a",
              borderRadius: "8px",
              background: "#ffffff",
              color: "#1f4d3a",
              fontSize: "15px",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Create Account
          </button>
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
          "http://localhost:4000/api/users/me",
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
          "http://localhost:4000/api/dashboard/stats",
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
    <div style={{ padding: "40px", fontFamily: "Arial, sans-serif" }}>
      <h1 style={{ color: "#173f35" }}>{title}</h1>
      <p>This section will be built next.</p>
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
          "http://localhost:4000/api/users/me",
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
      <div
        style={{
          padding: "40px",
          fontFamily: "Arial, sans-serif",
        }}
      >
        Checking permissions...
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









