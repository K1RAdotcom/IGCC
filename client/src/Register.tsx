import { useEffect, useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";

function Register() {
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("CLINIC_STAFF");

  const [adminAvailable, setAdminAvailable] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checkingStatus, setCheckingStatus] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    async function checkRegistrationStatus() {
      try {
        const response = await fetch(
          "http://localhost:4000/api/auth/registration-status"
        );

        const data = await response.json();

        if (response.ok) {
          setAdminAvailable(Boolean(data.adminAvailable));
        }
      } catch {
        setError("Unable to connect to the clinic server.");
      } finally {
        setCheckingStatus(false);
      }
    }

    checkRegistrationStatus();
  }, []);

  async function handleRegister(event: FormEvent) {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    if (role === "ADMIN" && !adminAvailable) {
      setError("An Administrator account already exists.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:4000/api/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            fullName,
            username,
            email,
            password,
            confirmPassword,
            role,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Could not create account.");
        return;
      }

      setSuccess("Account created successfully. Redirecting to Login...");

      setTimeout(() => {
        navigate("/login");
      }, 1200);
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
        background: "#f4f6f8",
        padding: "24px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "500px",
          background: "#ffffff",
          borderRadius: "12px",
          padding: "32px",
          boxShadow: "0 8px 30px rgba(0,0,0,0.08)",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "28px" }}>
          <h1
            style={{
              margin: 0,
              fontSize: "28px",
              fontWeight: 700,
              color: "#1f2937",
            }}
          >
            Ikeja Golf Club Clinic
          </h1>

          <p
            style={{
              marginTop: "8px",
              color: "#6b7280",
            }}
          >
            Create Account
          </p>
        </div>

        {error && (
          <div
            style={{
              background: "#fee2e2",
              color: "#991b1b",
              padding: "12px",
              borderRadius: "8px",
              marginBottom: "16px",
            }}
          >
            {error}
          </div>
        )}

        {success && (
          <div
            style={{
              background: "#dcfce7",
              color: "#166534",
              padding: "12px",
              borderRadius: "8px",
              marginBottom: "16px",
            }}
          >
            {success}
          </div>
        )}

        <form onSubmit={handleRegister}>
          <label style={{ display: "block", marginBottom: "6px" }}>
            Full Name
          </label>

          <input
            type="text"
            value={fullName}
            onChange={(event) => setFullName(event.target.value)}
            required
            style={inputStyle}
          />

          <label style={{ display: "block", margin: "16px 0 6px" }}>
            Username
          </label>

          <input
            type="text"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            required
            style={inputStyle}
          />

          <label style={{ display: "block", margin: "16px 0 6px" }}>
            Email
          </label>

          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            style={inputStyle}
          />

          <label style={{ display: "block", margin: "16px 0 6px" }}>
            Password
          </label>

          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            minLength={8}
            style={inputStyle}
          />

          <label style={{ display: "block", margin: "16px 0 6px" }}>
            Confirm Password
          </label>

          <input
            type="password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            required
            minLength={8}
            style={inputStyle}
          />

          <label style={{ display: "block", margin: "16px 0 6px" }}>
            Account Type
          </label>

          <select
            value={role}
            onChange={(event) => setRole(event.target.value)}
            style={inputStyle}
            disabled={checkingStatus}
          >
            <option value="CLINIC_STAFF">Clinic Staff</option>

            {adminAvailable && (
              <option value="ADMIN">Administrator</option>
            )}
          </select>

          {!checkingStatus && !adminAvailable && (
            <p
              style={{
                marginTop: "6px",
                fontSize: "13px",
                color: "#6b7280",
              }}
            >
              Administrator registration is unavailable because an
              Administrator account already exists.
            </p>
          )}

          <button
            type="submit"
            disabled={loading || checkingStatus}
            style={{
              width: "100%",
              marginTop: "24px",
              padding: "12px",
              border: "none",
              borderRadius: "8px",
              background: "#1f4d3a",
              color: "#ffffff",
              fontSize: "16px",
              fontWeight: 600,
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>

          <button
            type="button"
            onClick={() => navigate("/login")}
            style={{
              width: "100%",
              marginTop: "12px",
              padding: "12px",
              border: "1px solid #d1d5db",
              borderRadius: "8px",
              background: "#ffffff",
              color: "#374151",
              fontSize: "16px",
              cursor: "pointer",
            }}
          >
            Back to Login
          </button>
        </form>
      </div>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  boxSizing: "border-box" as const,
  padding: "11px 12px",
  border: "1px solid #d1d5db",
  borderRadius: "8px",
  fontSize: "15px",
  outline: "none",
};

export default Register;


