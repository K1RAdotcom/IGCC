import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";

export default function AddStaffAccount() {
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"ADMIN" | "CLINIC_STAFF">("CLINIC_STAFF");
  const [showPassword, setShowPassword] = useState(false);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");

    if (!fullName.trim() || !username.trim() || !password) {
      setError("Full name, username, and password are required.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setSaving(true);

    try {
      const response = await fetch(
        "http://localhost:4000/api/users",
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            fullName: fullName.trim(),
            username: username.trim(),
            email: email.trim() || undefined,
            password,
            role,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Could not create staff account."
        );
      }

      navigate("/admin/staff");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Could not create staff account."
      );
    } finally {
      setSaving(false);
    }
  }

  const inputStyle = {
    width: "100%",
    padding: "12px",
    border: "1px solid #d1d5db",
    borderRadius: "8px",
    fontSize: "14px",
    boxSizing: "border-box" as const,
  };

  const labelStyle = {
    display: "block",
    marginBottom: "8px",
    fontWeight: 600,
    color: "#374151",
  };

  const buttonStyle = {
    padding: "11px 18px",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: 600,
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f5f7f9",
        padding: "32px",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          maxWidth: "700px",
          margin: "0 auto",
        }}
      >
        <button
          type="button"
          onClick={() => navigate("/admin/staff")}
          style={{
            ...buttonStyle,
            background: "#e5e7eb",
            color: "#374151",
            marginBottom: "20px",
          }}
        >
          ? Back to Staff Management
        </button>

        <div
          style={{
            background: "#ffffff",
            borderRadius: "12px",
            padding: "30px",
            boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
          }}
        >
          <h1
            style={{
              margin: "0 0 8px",
              fontSize: "26px",
              color: "#111827",
            }}
          >
            Add Staff Account
          </h1>

          <p
            style={{
              margin: "0 0 28px",
              color: "#6b7280",
              fontSize: "14px",
            }}
          >
            Create a new administrator or clinic staff account.
          </p>

          {error && (
            <div
              style={{
                marginBottom: "20px",
                padding: "12px",
                borderRadius: "8px",
                background: "#fee2e2",
                color: "#991b1b",
                fontSize: "14px",
              }}
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: "20px" }}>
              <label style={labelStyle}>
                Full Name *
              </label>

              <input
                type="text"
                value={fullName}
                onChange={(event) => setFullName(event.target.value)}
                style={inputStyle}
                placeholder="Enter staff full name"
              />
            </div>

            <div style={{ marginBottom: "20px" }}>
              <label style={labelStyle}>
                Username *
              </label>

              <input
                type="text"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                style={inputStyle}
                placeholder="Enter username"
                autoComplete="username"
              />
            </div>

            <div style={{ marginBottom: "20px" }}>
              <label style={labelStyle}>
                Email
              </label>

              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                style={inputStyle}
                placeholder="Optional email address"
              />
            </div>

            <div style={{ marginBottom: "20px" }}>
              <label style={labelStyle}>
                Role *
              </label>

              <select
                value={role}
                onChange={(event) =>
                  setRole(
                    event.target.value as
                      | "ADMIN"
                      | "CLINIC_STAFF"
                  )
                }
                style={inputStyle}
              >
                <option value="CLINIC_STAFF">
                  Clinic Staff
                </option>
                <option value="ADMIN">
                  Administrator
                </option>
              </select>
            </div>

            <div style={{ marginBottom: "28px" }}>
              <label style={labelStyle}>
                Temporary Password *
              </label>

              <div
                style={{
                  display: "flex",
                  gap: "8px",
                }}
              >
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(event) =>
                    setPassword(event.target.value)
                  }
                  style={inputStyle}
                  placeholder="Minimum 8 characters"
                  autoComplete="new-password"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                  style={{
                    ...buttonStyle,
                    background: "#e5e7eb",
                    color: "#374151",
                    whiteSpace: "nowrap",
                  }}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>

              <p
                style={{
                  margin: "7px 0 0",
                  fontSize: "12px",
                  color: "#6b7280",
                }}
              >
                The staff member can change their password later.
              </p>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "12px",
              }}
            >
              <button
                type="button"
                onClick={() => navigate("/admin/staff")}
                disabled={saving}
                style={{
                  ...buttonStyle,
                  background: "#e5e7eb",
                  color: "#374151",
                }}
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={saving}
                style={{
                  ...buttonStyle,
                  background: "#166534",
                  color: "#ffffff",
                  opacity: saving ? 0.7 : 1,
                }}
              >
                {saving ? "Creating..." : "Create Account"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

