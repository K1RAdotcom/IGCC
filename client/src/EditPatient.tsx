import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";

type Patient = {
  patientId: string;
  displayId: string;
  fullName: string;
  dateOfBirth: string;
  phone: string;
  email?: string | null;
  gender?: string | null;
  address?: string | null;
  secondaryPhone?: string | null;
  patientCategory: "MEMBER" | "STAFF" | "GUEST" | "OTHER";
  emergencyContactName: string;
  emergencyContactPhone: string;
  profilePhoto?: string | null;
  golfClubMembership?: string | null;
  medicalPhysicalInformation?: string | null;
  additionalNotes?: string | null;
};

export default function EditPatient() {
  const { patientId } = useParams();
  const navigate = useNavigate();

  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    fullName: "",
    dateOfBirth: "",
    phone: "",
    email: "",
    gender: "",
    address: "",
    secondaryPhone: "",
    patientCategory: "MEMBER",
    emergencyContactName: "",
    emergencyContactPhone: "",
    profilePhoto: "",
    golfClubMembership: "",
    medicalPhysicalInformation: "",
    additionalNotes: "",
  });

  useEffect(() => {
    async function loadPatient() {
      if (!patientId) {
        setError("Patient ID is missing.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `http://localhost:4000/api/patient-profile/${patientId}`,
          {
            credentials: "include",
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Could not load patient.");
        }

        setPatient(data);

        setForm({
          fullName: data.fullName || "",
          dateOfBirth: data.dateOfBirth
            ? new Date(data.dateOfBirth).toISOString().split("T")[0]
            : "",
          phone: data.phone || "",
          email: data.email || "",
          gender: data.gender || "",
          address: data.address || "",
          secondaryPhone: data.secondaryPhone || "",
          patientCategory: data.patientCategory || "MEMBER",
          emergencyContactName: data.emergencyContactName || "",
          emergencyContactPhone: data.emergencyContactPhone || "",
          profilePhoto: data.profilePhoto || "",
          golfClubMembership: data.golfClubMembership || "",
          medicalPhysicalInformation:
            data.medicalPhysicalInformation || "",
          additionalNotes: data.additionalNotes || "",
        });
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Could not load patient."
        );
      } finally {
        setLoading(false);
      }
    }

    loadPatient();
  }, [patientId]);

  function updateField(name: string, value: string) {
    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    if (!patientId) {
      setError("Patient ID is missing.");
      return;
    }

    setSaving(true);
    setError("");

    try {
      const response = await fetch(
        `http://localhost:4000/api/patients/${patientId}`,
        {
          method: "PATCH",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Could not update patient.");
      }

      navigate(`/patients/${patientId}`);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Could not update patient."
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div style={{ padding: "40px", fontFamily: "Arial, sans-serif" }}>
        Loading patient...
      </div>
    );
  }

  if (!patient) {
    return (
      <div style={{ padding: "40px", fontFamily: "Arial, sans-serif" }}>
        <p style={{ color: "crimson" }}>{error || "Patient not found."}</p>
        <button onClick={() => navigate("/patients")}>
          Back to Patients
        </button>
      </div>
    );
  }

  const inputStyle = {
    width: "100%",
    padding: "11px",
    border: "1px solid #d1d5db",
    borderRadius: "6px",
    fontSize: "14px",
    boxSizing: "border-box" as const,
  };

  const labelStyle = {
    display: "block",
    marginBottom: "6px",
    fontWeight: 600,
    fontSize: "14px",
  };

  const fieldStyle = {
    marginBottom: "18px",
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
          maxWidth: "1000px",
          margin: "0 auto",
          background: "#ffffff",
          padding: "30px",
          borderRadius: "10px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
        }}
      >
        <button
          type="button"
          onClick={() => navigate(`/patients/${patientId}`)}
          style={{
            border: "none",
            background: "transparent",
            cursor: "pointer",
            marginBottom: "20px",
            fontSize: "14px",
          }}
        >
          ← Back to Patient Profile
        </button>

        <h1 style={{ marginBottom: "5px" }}>Edit Patient</h1>

        <p style={{ color: "#666", marginTop: 0 }}>
          Patient ID: <strong>{patient.displayId}</strong>
        </p>

        {error && (
          <div
            style={{
              background: "#fee2e2",
              color: "#991b1b",
              padding: "12px",
              borderRadius: "6px",
              marginBottom: "20px",
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <h2 style={{ fontSize: "18px", marginTop: "25px" }}>
            Personal Information
          </h2>

          <div style={fieldStyle}>
            <label style={labelStyle}>Full Name *</label>
            <input
              value={form.fullName}
              onChange={(e) => updateField("fullName", e.target.value)}
              style={inputStyle}
              required
            />
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "18px",
            }}
          >
            <div style={fieldStyle}>
              <label style={labelStyle}>Date of Birth *</label>
              <input
                type="date"
                value={form.dateOfBirth}
                onChange={(e) => updateField("dateOfBirth", e.target.value)}
                style={inputStyle}
                required
              />
            </div>

            <div style={fieldStyle}>
              <label style={labelStyle}>Phone *</label>
              <input
                value={form.phone}
                onChange={(e) => updateField("phone", e.target.value)}
                style={inputStyle}
                required
              />
            </div>

            <div style={fieldStyle}>
              <label style={labelStyle}>Patient Category *</label>
              <select
                value={form.patientCategory}
                onChange={(e) =>
                  updateField("patientCategory", e.target.value)
                }
                style={inputStyle}
                required
              >
                <option value="MEMBER">Club Member</option>
                <option value="STAFF">Staff</option>
                <option value="GUEST">Guest / Visitor</option>
                <option value="OTHER">Other</option>
              </select>
            </div>

            <div style={fieldStyle}>
              <label style={labelStyle}>Gender</label>
              <select
                value={form.gender}
                onChange={(e) => updateField("gender", e.target.value)}
                style={inputStyle}
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div style={fieldStyle}>
              <label style={labelStyle}>Email</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => updateField("email", e.target.value)}
                style={inputStyle}
              />
            </div>

            <div style={fieldStyle}>
              <label style={labelStyle}>Secondary Phone</label>
              <input
                value={form.secondaryPhone}
                onChange={(e) =>
                  updateField("secondaryPhone", e.target.value)
                }
                style={inputStyle}
              />
            </div>
          </div>

          <div style={fieldStyle}>
            <label style={labelStyle}>Address</label>
            <textarea
              value={form.address}
              onChange={(e) => updateField("address", e.target.value)}
              style={{ ...inputStyle, minHeight: "80px" }}
            />
          </div>

          <div style={fieldStyle}>
            <label style={labelStyle}>Golf Club Membership</label>
            <input
              value={form.golfClubMembership}
              onChange={(e) =>
                updateField("golfClubMembership", e.target.value)
              }
              style={inputStyle}
            />
          </div>

          <h2 style={{ fontSize: "18px", marginTop: "30px" }}>
            Emergency Contact
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "18px",
            }}
          >
            <div style={fieldStyle}>
              <label style={labelStyle}>Emergency Contact Name *</label>
              <input
                value={form.emergencyContactName}
                onChange={(e) =>
                  updateField("emergencyContactName", e.target.value)
                }
                style={inputStyle}
                required
              />
            </div>

            <div style={fieldStyle}>
              <label style={labelStyle}>Emergency Contact Phone *</label>
              <input
                value={form.emergencyContactPhone}
                onChange={(e) =>
                  updateField("emergencyContactPhone", e.target.value)
                }
                style={inputStyle}
                required
              />
            </div>
          </div>

          <h2 style={{ fontSize: "18px", marginTop: "30px" }}>
            Medical / Additional Information
          </h2>

          <div style={fieldStyle}>
            <label style={labelStyle}>
              Relevant Medical / Physical Information
            </label>
            <textarea
              value={form.medicalPhysicalInformation}
              onChange={(e) =>
                updateField("medicalPhysicalInformation", e.target.value)
              }
              style={{ ...inputStyle, minHeight: "120px" }}
            />
          </div>

          <div style={fieldStyle}>
            <label style={labelStyle}>Additional Notes</label>
            <textarea
              value={form.additionalNotes}
              onChange={(e) =>
                updateField("additionalNotes", e.target.value)
              }
              style={{ ...inputStyle, minHeight: "120px" }}
            />
          </div>

          <div
            style={{
              display: "flex",
              gap: "12px",
              marginTop: "25px",
            }}
          >
            <button
              type="submit"
              disabled={saving}
              style={{
                padding: "12px 22px",
                border: "none",
                borderRadius: "6px",
                background: "#1f6f43",
                color: "#fff",
                cursor: saving ? "not-allowed" : "pointer",
                fontWeight: 600,
              }}
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>

            <button
              type="button"
              onClick={() => navigate(`/patients/${patientId}`)}
              style={{
                padding: "12px 22px",
                border: "1px solid #ccc",
                borderRadius: "6px",
                background: "#fff",
                cursor: "pointer",
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
