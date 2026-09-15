import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

type ClinicSettingsData = {
  clinicName: string;
  address: string;
  phone: string;
  email: string;
  logo: string;
};

export default function ClinicSettings() {
  const navigate = useNavigate();

  const [settings, setSettings] = useState<ClinicSettingsData>({
    clinicName: "",
    address: "",
    phone: "",
    email: "",
    logo: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    loadSettings();
  }, []);

  async function loadSettings() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("http://localhost:4000/api/clinic-settings", {
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Could not load clinic settings.");
      }

      if (data.settings) {
        setSettings({
          clinicName: data.settings.clinicName || "",
          address: data.settings.address || "",
          phone: data.settings.phone || "",
          email: data.settings.email || "",
          logo: data.settings.logo || "",
        });
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Could not load clinic settings."
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    try {
      setSaving(true);
      setMessage("");
      setError("");

      const response = await fetch(
        "http://localhost:4000/api/clinic-settings",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(settings),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Could not update clinic settings.");
      }

      setMessage("Clinic settings updated successfully.");

      if (data.settings) {
        setSettings({
          clinicName: data.settings.clinicName || "",
          address: data.settings.address || "",
          phone: data.settings.phone || "",
          email: data.settings.email || "",
          logo: data.settings.logo || "",
        });
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Could not update clinic settings."
      );
    } finally {
      setSaving(false);
    }
  }

  function updateField(
    field: keyof ClinicSettingsData,
    value: string
  ) {
    setSettings((current) => ({
      ...current,
      [field]: value,
    }));
  }

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#f5f7fa",
          padding: "40px",
          fontFamily: "Arial, sans-serif",
        }}
      >
        Loading clinic settings...
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f5f7fa",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          background: "#ffffff",
          borderBottom: "1px solid #e5e7eb",
          padding: "18px 32px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <h1
            style={{
              margin: 0,
              fontSize: "24px",
              color: "#1f2937",
            }}
          >
            Clinic Settings
          </h1>

          <p
            style={{
              margin: "5px 0 0",
              color: "#6b7280",
              fontSize: "14px",
            }}
          >
            Manage clinic information and branding
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate("/dashboard")}
          style={{
            padding: "10px 16px",
            border: "1px solid #d1d5db",
            borderRadius: "6px",
            background: "#ffffff",
            cursor: "pointer",
            fontWeight: 600,
          }}
        >
          ← Back to Dashboard
        </button>
      </div>

      <main
        style={{
          maxWidth: "900px",
          margin: "35px auto",
          padding: "0 20px",
        }}
      >
        {message && (
          <div
            style={{
              background: "#ecfdf5",
              color: "#047857",
              border: "1px solid #a7f3d0",
              borderRadius: "8px",
              padding: "13px 16px",
              marginBottom: "20px",
            }}
          >
            {message}
          </div>
        )}

        {error && (
          <div
            style={{
              background: "#fef2f2",
              color: "#b91c1c",
              border: "1px solid #fecaca",
              borderRadius: "8px",
              padding: "13px 16px",
              marginBottom: "20px",
            }}
          >
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          style={{
            background: "#ffffff",
            borderRadius: "10px",
            border: "1px solid #e5e7eb",
            padding: "30px",
            boxShadow: "0 2px 6px rgba(0,0,0,0.04)",
          }}
        >
          <h2
            style={{
              marginTop: 0,
              marginBottom: "6px",
              color: "#1f2937",
            }}
          >
            Clinic Information
          </h2>

          <p
            style={{
              color: "#6b7280",
              fontSize: "14px",
              marginBottom: "28px",
            }}
          >
            This information can be used throughout the clinic management
            system.
          </p>

          <div style={{ marginBottom: "20px" }}>
            <label
              style={{
                display: "block",
                fontWeight: 600,
                marginBottom: "7px",
              }}
            >
              Clinic Name *
            </label>

            <input
              type="text"
              value={settings.clinicName}
              onChange={(event) =>
                updateField("clinicName", event.target.value)
              }
              required
              style={{
                width: "100%",
                boxSizing: "border-box",
                padding: "12px",
                border: "1px solid #d1d5db",
                borderRadius: "6px",
                fontSize: "15px",
              }}
            />
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label
              style={{
                display: "block",
                fontWeight: 600,
                marginBottom: "7px",
              }}
            >
              Address
            </label>

            <textarea
              value={settings.address}
              onChange={(event) =>
                updateField("address", event.target.value)
              }
              rows={3}
              placeholder="Enter clinic address"
              style={{
                width: "100%",
                boxSizing: "border-box",
                padding: "12px",
                border: "1px solid #d1d5db",
                borderRadius: "6px",
                fontSize: "15px",
                resize: "vertical",
              }}
            />
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "20px",
              marginBottom: "20px",
            }}
          >
            <div>
              <label
                style={{
                  display: "block",
                  fontWeight: 600,
                  marginBottom: "7px",
                }}
              >
                Phone
              </label>

              <input
                type="text"
                value={settings.phone}
                onChange={(event) =>
                  updateField("phone", event.target.value)
                }
                placeholder="Enter clinic phone number"
                style={{
                  width: "100%",
                  boxSizing: "border-box",
                  padding: "12px",
                  border: "1px solid #d1d5db",
                  borderRadius: "6px",
                  fontSize: "15px",
                }}
              />
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  fontWeight: 600,
                  marginBottom: "7px",
                }}
              >
                Email
              </label>

              <input
                type="email"
                value={settings.email}
                onChange={(event) =>
                  updateField("email", event.target.value)
                }
                placeholder="Enter clinic email"
                style={{
                  width: "100%",
                  boxSizing: "border-box",
                  padding: "12px",
                  border: "1px solid #d1d5db",
                  borderRadius: "6px",
                  fontSize: "15px",
                }}
              />
            </div>
          </div>

          <div style={{ marginBottom: "28px" }}>
            <label
              style={{
                display: "block",
                fontWeight: 600,
                marginBottom: "7px",
              }}
            >
              Logo
            </label>

            <input
              type="text"
              value={settings.logo}
              onChange={(event) =>
                updateField("logo", event.target.value)
              }
              placeholder="Enter logo path or URL"
              style={{
                width: "100%",
                boxSizing: "border-box",
                padding: "12px",
                border: "1px solid #d1d5db",
                borderRadius: "6px",
                fontSize: "15px",
              }}
            />

            <p
              style={{
                fontSize: "12px",
                color: "#6b7280",
                marginTop: "6px",
              }}
            >
              Logo upload can be added during the final branding stage.
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
              onClick={() => navigate("/dashboard")}
              style={{
                padding: "11px 20px",
                border: "1px solid #d1d5db",
                borderRadius: "6px",
                background: "#ffffff",
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              style={{
                padding: "11px 22px",
                border: "none",
                borderRadius: "6px",
                background: saving ? "#9ca3af" : "#166534",
                color: "#ffffff",
                cursor: saving ? "not-allowed" : "pointer",
                fontWeight: 600,
              }}
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}