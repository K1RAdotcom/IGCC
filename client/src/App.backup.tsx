import { useEffect, useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";

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

  async function handleLogout() {
    try {
      await fetch("http://localhost:4000/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      navigate("/login");
    } catch {
      setError("Could not log out.");
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        background: "#f4f7f6",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <aside
        style={{
          width: "240px",
          background: "#173f35",
          color: "white",
          minHeight: "100vh",
          padding: "25px 15px",
          boxSizing: "border-box",
        }}
      >
        <div style={{ padding: "0 10px 30px" }}>
          <h2 style={{ margin: 0, fontSize: "20px" }}>
            Ikeja Golf Club Clinic
          </h2>

          <p
            style={{
              marginTop: "6px",
              fontSize: "13px",
              opacity: 0.75,
            }}
          >
            Clinic Management System
          </p>
        </div>

        <nav>
          <button
            style={{
              width: "100%",
              padding: "13px 12px",
              textAlign: "left",
              background: "rgba(255,255,255,0.12)",
              color: "white",
              border: "none",
              borderRadius: "7px",
              marginBottom: "8px",
              cursor: "pointer",
            }}
          >
            Dashboard
          </button>

          <button
            onClick={() => navigate("/patients")}
            style={{
              width: "100%",
              padding: "13px 12px",
              textAlign: "left",
              background: "transparent",
              color: "white",
              border: "none",
              borderRadius: "7px",
              marginBottom: "8px",
              cursor: "pointer",
            }}
          >
            Patients
          </button>

          <button
            onClick={() => navigate("/new-visit")}
            style={{
              width: "100%",
              padding: "13px 12px",
              textAlign: "left",
              background: "transparent",
              color: "white",
              border: "none",
              borderRadius: "7px",
              marginBottom: "8px",
              cursor: "pointer",
            }}
          >
            New Visit
          </button>

          <button
            onClick={() => navigate("/account")}
            style={{
              width: "100%",
              padding: "13px 12px",
              textAlign: "left",
              background: "transparent",
              color: "white",
              border: "none",
              borderRadius: "7px",
              marginBottom: "8px",
              cursor: "pointer",
            }}
          >
            My Account
          </button>

          {userRole === "ADMIN" && (
            <>
              <div
                style={{
                  marginTop: "25px",
                  padding: "10px 12px",
                  fontSize: "12px",
                  textTransform: "uppercase",
                  opacity: 0.6,
                }}
              >
                Administration
              </div>

              <button
                onClick={() => navigate("/admin/staff")}
                style={{
                  width: "100%",
                  padding: "13px 12px",
                  textAlign: "left",
                  background: "transparent",
                  color: "white",
                  border: "none",
                  borderRadius: "7px",
                  marginBottom: "8px",
                  cursor: "pointer",
                }}
              >
                Staff Management
              </button>

              <button
                onClick={() => navigate("/admin/audit-logs")}
                style={{
                  width: "100%",
                  padding: "13px 12px",
                  textAlign: "left",
                  background: "transparent",
                  border: "none",
                  color: "white",
                  borderRadius: "7px",
                  marginBottom: "8px",
                  cursor: "pointer",
                }}
              >
                Audit Logs
              </button>

              <button
                onClick={() => navigate("/admin/clinic-settings")}
                style={{
                  width: "100%",
                  padding: "13px 12px",
                  textAlign: "left",
                  background: "transparent",
                  border: "none",
                  color: "white",
                  borderRadius: "7px",
                  cursor: "pointer",
                }}
              >
                Clinic Settings
              </button>
            </>
          )}
        </nav>

        <button
          onClick={handleLogout}
          style={{
            position: "absolute",
            bottom: "25px",
            width: "210px",
            padding: "12px",
            background: "rgba(255,255,255,0.1)",
            color: "white",
            border: "1px solid rgba(255,255,255,0.25)",
            borderRadius: "7px",
            cursor: "pointer",
          }}
        >
          Logout
        </button>
      </aside>

      <main
        style={{
          flex: 1,
          padding: "35px",
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "30px",
          }}
        >
          <div>
            <h1
              style={{
                margin: 0,
                color: "#173f35",
                fontSize: "30px",
              }}
            >
              Dashboard
            </h1>

            <p style={{ color: "#666", marginTop: "7px" }}>
              Welcome to the Ikeja Golf Club Clinic Management System.
            </p>
          </div>
        </div>

        {error && (
          <div
            style={{
              background: "#fdecec",
              color: "#b42318",
              padding: "12px",
              borderRadius: "7px",
              marginBottom: "20px",
            }}
          >
            {error}
          </div>
        )}

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "20px",
          }}
        >
          <div
            style={{
              background: "white",
              padding: "25px",
              borderRadius: "10px",
              boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
            }}
          >
            <p style={{ margin: 0, color: "#777" }}>Total Patients</p>

            <h2
              style={{
                fontSize: "34px",
                margin: "10px 0",
                color: "#173f35",
              }}
            >
              {stats ? stats.totalPatients : "..."}
            </h2>
          </div>

          <div
            style={{
              background: "white",
              padding: "25px",
              borderRadius: "10px",
              boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
            }}
          >
            <p style={{ margin: 0, color: "#777" }}>Today's Visits</p>

            <h2
              style={{
                fontSize: "34px",
                margin: "10px 0",
                color: "#173f35",
              }}
            >
              {stats ? stats.todaysVisits : "..."}
            </h2>
          </div>

          <div
            style={{
              background: "white",
              padding: "25px",
              borderRadius: "10px",
              boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
            }}
          >
            <p style={{ margin: 0, color: "#777" }}>New Patients Today</p>

            <h2
              style={{
                fontSize: "34px",
                margin: "10px 0",
                color: "#173f35",
              }}
            >
              {stats ? stats.newPatients : "..."}
            </h2>
          </div>
        </div>

        <section style={{ marginTop: "35px" }}>
          <h2 style={{ color: "#173f35" }}>Quick Actions</h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "15px",
              marginTop: "15px",
            }}
          >
            <button
              onClick={() => navigate("/patients")}
              style={{
                padding: "18px",
                background: "white",
                border: "1px solid #ddd",
                borderRadius: "8px",
                textAlign: "left",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              Search Patients
            </button>

            <button
              onClick={() => navigate("/new-patient")}
              style={{
                padding: "18px",
                background: "white",
                border: "1px solid #ddd",
                borderRadius: "8px",
                textAlign: "left",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              Register New Patient
            </button>

            <button
              onClick={() => navigate("/new-visit")}
              style={{
                padding: "18px",
                background: "white",
                border: "1px solid #ddd",
                borderRadius: "8px",
                textAlign: "left",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              Record New Visit
            </button>
          </div>
        </section>
      </main>
    </div>
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
          element={<AddStaffAccount />}
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


