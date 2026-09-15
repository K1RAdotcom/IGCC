import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

type User = {
  userId: string;
  displayId: string;
  fullName: string;
  username: string;
  email?: string | null;
  role: "ADMIN" | "CLINIC_STAFF";
  status: "ACTIVE" | "INACTIVE";
};

export default function MyAccount() {
  const navigate = useNavigate();

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadAccount() {
      try {
        const response = await fetch(
          "http://localhost:4000/api/users/me",
          {
            credentials: "include",
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Could not load account.");
        }

        setUser(data.user);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Could not load account."
        );
      } finally {
        setLoading(false);
      }
    }

    loadAccount();
  }, []);

  if (loading) {
    return (
      <div
        style={{
          padding: "40px",
          fontFamily: "Arial, sans-serif",
        }}
      >
        Loading account...
      </div>
    );
  }

  if (!user) {
    return (
      <div
        style={{
          padding: "40px",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <p style={{ color: "crimson" }}>
          {error || "Could not load account."}
        </p>

        <button
          type="button"
          onClick={() => navigate("/dashboard")}
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  const labelStyle = {
    display: "block",
    fontSize: "13px",
    color: "#666",
    marginBottom: "5px",
  };

  const valueStyle = {
    fontSize: "16px",
    fontWeight: 600,
    color: "#222",
  };

  const cardStyle = {
    background: "#fff",
    borderRadius: "10px",
    padding: "24px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
  };

  const roleLabel =
    user.role === "ADMIN" ? "Administrator" : "Clinic Staff";

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f5f7fa",
        padding: "30px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: "900px",
          margin: "0 auto",
        }}
      >
        <button
          type="button"
          onClick={() => navigate("/dashboard")}
          style={{
            border: "none",
            background: "transparent",
            cursor: "pointer",
            marginBottom: "20px",
            fontSize: "14px",
          }}
        >
          ← Back to Dashboard
        </button>

        <h1 style={{ marginBottom: "5px" }}>
          My Account
        </h1>

        <p
          style={{
            color: "#666",
            marginTop: 0,
          }}
        >
          View your account information and staff details.
        </p>

        <div
          style={{
            ...cardStyle,
            marginTop: "25px",
          }}
        >
          <h2
            style={{
              marginTop: 0,
              fontSize: "20px",
            }}
          >
            Account Information
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "25px",
              marginTop: "25px",
            }}
          >
            <div>
              <span style={labelStyle}>Full Name</span>
              <span style={valueStyle}>
                {user.fullName}
              </span>
            </div>

            <div>
              <span style={labelStyle}>Username</span>
              <span style={valueStyle}>
                {user.username}
              </span>
            </div>

            <div>
              <span style={labelStyle}>Staff ID</span>
              <span style={valueStyle}>
                {user.displayId}
              </span>
            </div>

            <div>
              <span style={labelStyle}>Role</span>
              <span style={valueStyle}>
                {roleLabel}
              </span>
            </div>

            <div>
              <span style={labelStyle}>Email</span>
              <span style={valueStyle}>
                {user.email || "Not provided"}
              </span>
            </div>

            <div>
              <span style={labelStyle}>Account Status</span>
              <span style={valueStyle}>
                {user.status}
              </span>
            </div>
          </div>
        </div>

        <div
          style={{
            ...cardStyle,
            marginTop: "20px",
          }}
        >
          <h2
            style={{
              marginTop: 0,
              fontSize: "20px",
            }}
          >
            Account Actions
          </h2>

          <div
            style={{
              display: "flex",
              gap: "12px",
              marginTop: "20px",
              flexWrap: "wrap",
            }}
          >
            <button
              type="button"
              onClick={() => navigate("/account/edit")}
              style={{
                padding: "11px 18px",
                border: "none",
                borderRadius: "6px",
                background: "#1f6f43",
                color: "#fff",
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              Edit Profile
            </button>

            <button
              type="button"
              onClick={() =>
                navigate("/account/change-password")
              }
              style={{
                padding: "11px 18px",
                border: "1px solid #ccc",
                borderRadius: "6px",
                background: "#fff",
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              Change Password
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
