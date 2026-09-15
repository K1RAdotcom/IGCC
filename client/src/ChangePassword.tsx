import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";

export default function ChangePassword() {
  const navigate = useNavigate();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    setMessage("");
    setError("");

    if (!currentPassword || !newPassword || !confirmPassword) {
      setError("Please complete all password fields.");
      return;
    }

    if (newPassword.length < 8) {
      setError("New password must be at least 8 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("New passwords do not match.");
      return;
    }

    setSaving(true);

    try {
      const response = await fetch(
        "http://localhost:4000/api/users/me/change-password",
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            currentPassword,
            newPassword,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Could not change password.");
      }

      setMessage("Password changed successfully.");

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      setTimeout(() => {
        navigate("/account");
      }, 1000);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Could not change password."
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
          maxWidth: "650px",
          margin: "0 auto",
        }}
      >
        <button
          onClick={() => navigate("/account")}
          style={{
            ...buttonStyle,
            background: "#e5e7eb",
            color: "#111827",
            marginBottom: "20px",
          }}
        >
          ← Back to My Account
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
            Change Password
          </h1>

          <p
            style={{
              margin: "0 0 28px",
              color: "#6b7280",
              fontSize: "14px",
            }}
          >
            Update your account password securely.
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

          {message && (
            <div
              style={{
                marginBottom: "20px",
                padding: "12px",
                borderRadius: "8px",
                background: "#dcfce7",
                color: "#166534",
                fontSize: "14px",
              }}
            >
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: "20px" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontWeight: 600,
                  color: "#374151",
                }}
              >
                Current Password
              </label>

              <div style={{ display: "flex", gap: "8px" }}>
                <input
                  type={showCurrent ? "text" : "password"}
                  value={currentPassword}
                  onChange={(event) =>
                    setCurrentPassword(event.target.value)
                  }
                  style={inputStyle}
                  autoComplete="current-password"
                />

                <button
                  type="button"
                  onClick={() => setShowCurrent(!showCurrent)}
                  style={{
                    ...buttonStyle,
                    background: "#e5e7eb",
                    color: "#374151",
                    whiteSpace: "nowrap",
                  }}
                >
                  {showCurrent ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <div style={{ marginBottom: "20px" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontWeight: 600,
                  color: "#374151",
                }}
              >
                New Password
              </label>

              <div style={{ display: "flex", gap: "8px" }}>
                <input
                  type={showNew ? "text" : "password"}
                  value={newPassword}
                  onChange={(event) =>
                    setNewPassword(event.target.value)
                  }
                  style={inputStyle}
                  autoComplete="new-password"
                />

                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  style={{
                    ...buttonStyle,
                    background: "#e5e7eb",
                    color: "#374151",
                    whiteSpace: "nowrap",
                  }}
                >
                  {showNew ? "Hide" : "Show"}
                </button>
              </div>

              <p
                style={{
                  margin: "7px 0 0",
                  fontSize: "12px",
                  color: "#6b7280",
                }}
              >
                Minimum 8 characters.
              </p>
            </div>

            <div style={{ marginBottom: "28px" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontWeight: 600,
                  color: "#374151",
                }}
              >
                Confirm New Password
              </label>

              <div style={{ display: "flex", gap: "8px" }}>
                <input
                  type={showConfirm ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(event) =>
                    setConfirmPassword(event.target.value)
                  }
                  style={inputStyle}
                  autoComplete="new-password"
                />

                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  style={{
                    ...buttonStyle,
                    background: "#e5e7eb",
                    color: "#374151",
                    whiteSpace: "nowrap",
                  }}
                >
                  {showConfirm ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                gap: "12px",
                justifyContent: "flex-end",
              }}
            >
              <button
                type="button"
                onClick={() => navigate("/account")}
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
                {saving ? "Changing..." : "Change Password"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
