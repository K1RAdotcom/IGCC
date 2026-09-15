import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";

type PatientCategory = "MEMBER" | "STAFF" | "GUEST" | "OTHER";

export default function NewPatient() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: "",
    dateOfBirth: "",
    phone: "",
    email: "",
    gender: "",
    address: "",
    secondaryPhone: "",
    patientCategory: "MEMBER" as PatientCategory,
    emergencyContactName: "",
    emergencyContactPhone: "",
    golfClubMembership: "",
    medicalPhysicalInformation: "",
    additionalNotes: "",
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function updateField(
    field: keyof typeof form,
    value: string
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");

    if (!form.fullName.trim()) {
      setError("Full name is required.");
      return;
    }

    if (!form.dateOfBirth) {
      setError("Date of birth is required.");
      return;
    }

    if (!form.phone.trim()) {
      setError("Phone number is required.");
      return;
    }

    if (!form.emergencyContactName.trim()) {
      setError("Emergency contact name is required.");
      return;
    }

    if (!form.emergencyContactPhone.trim()) {
      setError("Emergency contact phone is required.");
      return;
    }

    setSaving(true);

    try {
      const response = await fetch(
        "http://localhost:4000/api/patients",
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Could not register patient."
        );
      }

      navigate(`/patients/${data.patient.patientId}`);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Could not register patient."
      );
    } finally {
      setSaving(false);
    }
  }

  const inputStyle = {
    width: "100%",
    padding: "11px 12px",
    border: "1px solid #cbd5e1",
    borderRadius: "8px",
    fontSize: "14px",
    boxSizing: "border-box" as const,
    outline: "none",
  };

  const labelStyle = {
    display: "block",
    fontSize: "13px",
    fontWeight: 700,
    color: "#334155",
    marginBottom: "7px",
  };

  const sectionStyle = {
    background: "#fff",
    border: "1px solid #e2e8f0",
    borderRadius: "12px",
    padding: "24px",
    marginBottom: "20px",
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f8fafc",
        padding: "32px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
        <button
          type="button"
          onClick={() => navigate("/patients")}
          style={{
            border: "none",
            background: "transparent",
            color: "#2563eb",
            cursor: "pointer",
            fontWeight: 600,
            padding: 0,
            marginBottom: "20px",
          }}
        >
          ? Back to Patients
        </button>

        <div style={{ marginBottom: "24px" }}>
          <h1
            style={{
              margin: "0 0 8px",
              fontSize: "28px",
              color: "#0f172a",
            }}
          >
            Register New Patient
          </h1>

          <p
            style={{
              margin: 0,
              color: "#64748b",
              fontSize: "14px",
            }}
          >
            Create a patient record for the Ikeja Golf Club Clinic.
          </p>
        </div>

        {error && (
          <div
            style={{
              background: "#fef2f2",
              border: "1px solid #fecaca",
              color: "#b91c1c",
              padding: "12px 14px",
              borderRadius: "8px",
              marginBottom: "20px",
              fontSize: "14px",
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={sectionStyle}>
            <h2
              style={{
                margin: "0 0 20px",
                fontSize: "19px",
                color: "#0f172a",
              }}
            >
              Basic Information
            </h2>

            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(2, minmax(0, 1fr))",
                gap: "18px 24px",
              }}
            >
              <div>
                <label style={labelStyle}>
                  Full Name *
                </label>
                <input
                  type="text"
                  value={form.fullName}
                  onChange={(e) =>
                    updateField("fullName", e.target.value)
                  }
                  placeholder="Enter patient's full name"
                  style={inputStyle}
                />
              </div>

              <div>
                <label style={labelStyle}>
                  Date of Birth *
                </label>
                <input
                  type="date"
                  value={form.dateOfBirth}
                  onChange={(e) =>
                    updateField("dateOfBirth", e.target.value)
                  }
                  style={inputStyle}
                />
              </div>

              <div>
                <label style={labelStyle}>
                  Phone *
                </label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) =>
                    updateField("phone", e.target.value)
                  }
                  placeholder="Enter phone number"
                  style={inputStyle}
                />
              </div>

              <div>
                <label style={labelStyle}>
                  Patient Category *
                </label>
                <select
                  value={form.patientCategory}
                  onChange={(e) =>
                    updateField(
                      "patientCategory",
                      e.target.value
                    )
                  }
                  style={inputStyle}
                >
                  <option value="MEMBER">Club Member</option>
                  <option value="STAFF">Staff</option>
                  <option value="GUEST">Guest / Visitor</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>

              <div>
                <label style={labelStyle}>
                  Gender
                </label>
                <select
                  value={form.gender}
                  onChange={(e) =>
                    updateField("gender", e.target.value)
                  }
                  style={inputStyle}
                >
                  <option value="">Select gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                  <option value="Prefer not to say">
                    Prefer not to say
                  </option>
                </select>
              </div>

              <div>
                <label style={labelStyle}>
                  Email
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) =>
                    updateField("email", e.target.value)
                  }
                  placeholder="Enter email address"
                  style={inputStyle}
                />
              </div>
            </div>
          </div>

          <div style={sectionStyle}>
            <h2
              style={{
                margin: "0 0 20px",
                fontSize: "19px",
                color: "#0f172a",
              }}
            >
              Contact Information
            </h2>

            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(2, minmax(0, 1fr))",
                gap: "18px 24px",
              }}
            >
              <div>
                <label style={labelStyle}>
                  Secondary Phone
                </label>
                <input
                  type="tel"
                  value={form.secondaryPhone}
                  onChange={(e) =>
                    updateField(
                      "secondaryPhone",
                      e.target.value
                    )
                  }
                  placeholder="Optional"
                  style={inputStyle}
                />
              </div>

              <div>
                <label style={labelStyle}>
                  Golf Club Membership
                </label>
                <input
                  type="text"
                  value={form.golfClubMembership}
                  onChange={(e) =>
                    updateField(
                      "golfClubMembership",
                      e.target.value
                    )
                  }
                  placeholder="Membership number or details"
                  style={inputStyle}
                />
              </div>

              <div style={{ gridColumn: "1 / -1" }}>
                <label style={labelStyle}>
                  Address
                </label>
                <textarea
                  value={form.address}
                  onChange={(e) =>
                    updateField("address", e.target.value)
                  }
                  placeholder="Enter patient's address"
                  rows={3}
                  style={{
                    ...inputStyle,
                    resize: "vertical",
                  }}
                />
              </div>
            </div>
          </div>

          <div style={sectionStyle}>
            <h2
              style={{
                margin: "0 0 20px",
                fontSize: "19px",
                color: "#0f172a",
              }}
            >
              Emergency Contact
            </h2>

            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(2, minmax(0, 1fr))",
                gap: "18px 24px",
              }}
            >
              <div>
                <label style={labelStyle}>
                  Emergency Contact Name *
                </label>
                <input
                  type="text"
                  value={form.emergencyContactName}
                  onChange={(e) =>
                    updateField(
                      "emergencyContactName",
                      e.target.value
                    )
                  }
                  placeholder="Enter contact name"
                  style={inputStyle}
                />
              </div>

              <div>
                <label style={labelStyle}>
                  Emergency Contact Phone *
                </label>
                <input
                  type="tel"
                  value={form.emergencyContactPhone}
                  onChange={(e) =>
                    updateField(
                      "emergencyContactPhone",
                      e.target.value
                    )
                  }
                  placeholder="Enter contact phone"
                  style={inputStyle}
                />
              </div>
            </div>
          </div>

          <div style={sectionStyle}>
            <h2
              style={{
                margin: "0 0 20px",
                fontSize: "19px",
                color: "#0f172a",
              }}
            >
              Medical / Physical Information
            </h2>

            <div style={{ marginBottom: "18px" }}>
              <label style={labelStyle}>
                Relevant Medical / Physical Information
              </label>

              <textarea
                value={form.medicalPhysicalInformation}
                onChange={(e) =>
                  updateField(
                    "medicalPhysicalInformation",
                    e.target.value
                  )
                }
                placeholder="Enter relevant medical or physical information..."
                rows={5}
                style={{
                  ...inputStyle,
                  resize: "vertical",
                }}
              />
            </div>

            <div>
              <label style={labelStyle}>
                Additional Notes
              </label>

              <textarea
                value={form.additionalNotes}
                onChange={(e) =>
                  updateField(
                    "additionalNotes",
                    e.target.value
                  )
                }
                placeholder="Enter any additional notes..."
                rows={4}
                style={{
                  ...inputStyle,
                  resize: "vertical",
                }}
              />
            </div>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: "12px",
              paddingBottom: "30px",
            }}
          >
            <button
              type="button"
              onClick={() => navigate("/patients")}
              style={{
                padding: "11px 20px",
                border: "1px solid #cbd5e1",
                background: "#fff",
                borderRadius: "8px",
                cursor: "pointer",
                fontWeight: 600,
                color: "#334155",
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
                background: saving ? "#94a3b8" : "#2563eb",
                color: "#fff",
                borderRadius: "8px",
                cursor: saving ? "not-allowed" : "pointer",
                fontWeight: 700,
              }}
            >
              {saving ? "Registering..." : "Register Patient"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

