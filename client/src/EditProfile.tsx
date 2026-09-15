import { useEffect, useState } from "react";
import type { FormEvent } from "react";
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

export default function EditProfile() {
  const navigate = useNavigate();

  const [user, setUser] = useState<User | null>(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

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
        setFullName(data.user.fullName || "");
        setEmail(data.user.email || "");
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Could not load account."
        );
      } finally {
        setLoading(false);
      }
    }

    loadAccount();
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!fullName.trim()) {
      setError("Full name is required.");
      return;
    }

    setSaving(true);

    try {
      const response = await fetch(
        "http://localhost:4000/api/users/me",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            fullName,
            email,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Could not update profile."
        );
      }

      setUser(data.user);
      setFullName(data.user.fullName || "");
      setEmail(data.user.email || "");
      setSuccess("Profile updated successfully.");

      setTimeout(() => {
        navigate("/account");
      }, 800);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Could not update profile."
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div
        style={{
          padding: "40px",
          fontFamily: "Arial, sans-serif",
        }}
      >
        Loading profile...
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
          {error || "Could not load profile."}
        </p>

        <button
          type="button"
          onClick={() => navigate("/account")}
        >
          Back to My Account
        </button>
      </div>
    );
  }

  const labelStyle = {
    display: "block",
    fontSize: "13px",
    color: "#555",
    marginBottom: "7px",
    fontWeight: 600,
  };

  const inputStyle = {
    width: "100%",
    padding: "11px 12px",
    border: "1px solid #ccc",
    borderRadius: "6px",
    fontSize: "15px",
    boxSizing: "border-box" as const,
  };

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
          maxWidth: "700px",
          margin: "0 auto",
        }}
      >
        <button
          type="button"
          onClick={() => navigate("/account")}
          style={{
            border: "none",
            background: "transparent",
            cursor: "pointer",
            marginBottom: "20px",
            fontSize: "14px",
          }}
        >
          ← Back to My Account
        </button>

        <h1 style={{ marginBottom: "5px" }}>
          Edit Profile
        </h1>

        <p
          style={{
            color: "#666",
            marginTop: 0,
          }}
        >
          Update your personal account information.
        </p>

        <form
          onSubmit={handleSubmit}
          style={{
            background: "#fff",
            borderRadius: "10px",
            padding: "25px",
            marginTop: "25px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
          }}
        >
          <div style={{ marginBottom: "20px" }}>
            <label style={labelStyle}>
              Full Name *
            </label>

            <input
              type="text"
              value={fullName}
              onChange={(event) =>
                setFullName(event.target.value)
              }
              style={inputStyle}
              required
            />
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label style={labelStyle}>
              Email
            </label>

            <input
              type="email"
              value={email}
              onChange={(event) =>
                setEmail(event.target.value)
              }
              style={inputStyle}
              placeholder="Enter email address"
            />
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label style={labelStyle}>
              Username
            </label>

            <input
              type="text"
              value={user.username}
              style={{
                ...inputStyle,
                background: "#f1f1f1",
                color: "#777",
              }}
              disabled
            />

            <small
              style={{
                display: "block",
                marginTop: "6px",
                color: "#777",
              }}
            >
              Username cannot be changed here.
            </small>
          </div>

          <div style={{ marginBottom: "25px" }}>
            <label style={labelStyle}>
              Staff ID
            </label>

            <input
              type="text"
              value={user.displayId}
              style={{
                ...inputStyle,
                background: "#f1f1f1",
                color: "#777",
              }}
              disabled
            />
          </div>

          {error && (
            <div
              style={{
                marginBottom: "15px",
                padding: "11px",
                borderRadius: "6px",
                background: "#fdecec",
                color: "crimson",
              }}
            >
              {error}
            </div>
          )}

          {success && (
            <div
              style={{
                marginBottom: "15px",
                padding: "11px",
                borderRadius: "6px",
                background: "#eaf7ee",
                color: "#1f6f43",
              }}
            >
              {success}
            </div>
          )}

          <div
            style={{
              display: "flex",
              gap: "12px",
              flexWrap: "wrap",
            }}
          >
            <button
              type="submit"
              disabled={saving}
              style={{
                padding: "11px 20px",
                border: "none",
                borderRadius: "6px",
                background: saving ? "#8aaa98" : "#1f6f43",
                color: "#fff",
                cursor: saving ? "not-allowed" : "pointer",
                fontWeight: 600,
              }}
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>

            <button
              type="button"
              onClick={() => navigate("/account")}
              disabled={saving}
              style={{
                padding: "11px 20px",
                border: "1px solid #ccc",
                borderRadius: "6px",
                background: "#fff",
                cursor: saving ? "not-allowed" : "pointer",
                fontWeight: 600,
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
