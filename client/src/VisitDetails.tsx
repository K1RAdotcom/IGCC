import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

type Visit = {
  visitId: string;
  displayId: string;
  visitDateTime: string;
  reasonForVisit: string;
  complaintSymptoms?: string | null;
  bloodPressure?: string | null;
  pulse?: number | null;
  bloodSugar?: number | null;
  respiration?: number | null;
  temperature?: number | null;
  assessmentObservation?: string | null;
  treatment?: string | null;
  actionTaken?: string | null;
  additionalNotes?: string | null;
  recommendationsFollowUp?: string | null;
  createdAt: string;
  updatedAt: string;
  patient: {
    patientId: string;
    displayId: string;
    fullName: string;
  };
  staff: {
    displayId: string;
    fullName: string;
    username: string;
  };
};

type FormData = {
  visitDateTime: string;
  reasonForVisit: string;
  complaintSymptoms: string;
  bloodPressure: string;
  pulse: string;
  bloodSugar: string;
  respiration: string;
  temperature: string;
  assessmentObservation: string;
  treatment: string;
  actionTaken: string;
  additionalNotes: string;
  recommendationsFollowUp: string;
};

function formatDateTime(value: string) {
  return new Date(value).toLocaleString();
}

function toDateTimeLocal(value: string) {
  const date = new Date(value);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

function Field({
  label,
  value,
}: {
  label: string;
  value?: string | number | null;
}) {
  return (
    <div style={{ marginBottom: "18px" }}>
      <div
        style={{
          fontSize: "13px",
          fontWeight: 700,
          color: "#64748b",
          marginBottom: "6px",
        }}
      >
        {label}
      </div>

      <div
        style={{
          fontSize: "15px",
          color: "#0f172a",
          lineHeight: 1.6,
          whiteSpace: "pre-wrap",
        }}
      >
        {value !== null && value !== undefined && String(value).trim()
          ? String(value)
          : "—"}
      </div>
    </div>
  );
}

function InputField({
  label,
  value,
  onChange,
  type = "text",
  required = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label
        style={{
          display: "block",
          fontSize: "13px",
          fontWeight: 700,
          color: "#475569",
          marginBottom: "7px",
        }}
      >
        {label}
        {required && <span style={{ color: "#dc2626" }}> *</span>}
      </label>

      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        required={required}
        style={{
          width: "100%",
          boxSizing: "border-box",
          border: "1px solid #cbd5e1",
          borderRadius: "8px",
          padding: "10px 12px",
          fontSize: "14px",
          outline: "none",
        }}
      />
    </div>
  );
}

function TextAreaField({
  label,
  value,
  onChange,
  rows = 4,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  rows?: number;
}) {
  return (
    <div>
      <label
        style={{
          display: "block",
          fontSize: "13px",
          fontWeight: 700,
          color: "#475569",
          marginBottom: "7px",
        }}
      >
        {label}
      </label>

      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        rows={rows}
        style={{
          width: "100%",
          boxSizing: "border-box",
          border: "1px solid #cbd5e1",
          borderRadius: "8px",
          padding: "10px 12px",
          fontSize: "14px",
          lineHeight: 1.5,
          resize: "vertical",
          fontFamily: "Arial, sans-serif",
          outline: "none",
        }}
      />
    </div>
  );
}

function createFormData(visit: Visit): FormData {
  return {
    visitDateTime: toDateTimeLocal(visit.visitDateTime),
    reasonForVisit: visit.reasonForVisit || "",
    complaintSymptoms: visit.complaintSymptoms || "",
    bloodPressure: visit.bloodPressure || "",
    pulse:
      visit.pulse !== null && visit.pulse !== undefined
        ? String(visit.pulse)
        : "",
    bloodSugar:
      visit.bloodSugar !== null && visit.bloodSugar !== undefined
        ? String(visit.bloodSugar)
        : "",
    respiration:
      visit.respiration !== null && visit.respiration !== undefined
        ? String(visit.respiration)
        : "",
    temperature:
      visit.temperature !== null && visit.temperature !== undefined
        ? String(visit.temperature)
        : "",
    assessmentObservation: visit.assessmentObservation || "",
    treatment: visit.treatment || "",
    actionTaken: visit.actionTaken || "",
    additionalNotes: visit.additionalNotes || "",
    recommendationsFollowUp: visit.recommendationsFollowUp || "",
  };
}

export default function VisitDetails() {
  const navigate = useNavigate();
  const { patientId, visitId } = useParams<{
    patientId: string;
    visitId: string;
  }>();

  const [visit, setVisit] = useState<Visit | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");
  const [formData, setFormData] = useState<FormData | null>(null);

  useEffect(() => {
    async function loadVisit() {
      if (!patientId || !visitId) {
        setError("Invalid visit information.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `http://localhost:4000/api/visits/${visitId}`,
          {
            credentials: "include",
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Could not load visit.");
        }

        setVisit(data);
        setFormData(createFormData(data));
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Could not load visit."
        );
      } finally {
        setLoading(false);
      }
    }

    loadVisit();
  }, [patientId, visitId]);

  function updateField(field: keyof FormData, value: string) {
    setFormData((current) =>
      current
        ? {
            ...current,
            [field]: value,
          }
        : current
    );
  }

  function startEditing() {
    if (!visit) return;

    setFormData(createFormData(visit));
    setFormError("");
    setEditMode(true);
  }

  function cancelEditing() {
    if (visit) {
      setFormData(createFormData(visit));
    }

    setFormError("");
    setEditMode(false);
  }

  async function saveChanges(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!visitId || !formData) {
      return;
    }

    if (!formData.reasonForVisit.trim()) {
      setFormError("Reason for visit is required.");
      return;
    }

    setSaving(true);
    setFormError("");

    try {
      const response = await fetch(
        `http://localhost:4000/api/visits/${visitId}`,
        {
          method: "PATCH",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            visitDateTime: formData.visitDateTime,
            reasonForVisit: formData.reasonForVisit.trim(),
            complaintSymptoms: formData.complaintSymptoms.trim(),
            bloodPressure: formData.bloodPressure.trim(),
            pulse: formData.pulse
              ? Number(formData.pulse)
              : undefined,
            bloodSugar: formData.bloodSugar
              ? Number(formData.bloodSugar)
              : undefined,
            respiration: formData.respiration
              ? Number(formData.respiration)
              : undefined,
            temperature: formData.temperature
              ? Number(formData.temperature)
              : undefined,
            assessmentObservation:
              formData.assessmentObservation.trim(),
            treatment: formData.treatment.trim(),
            actionTaken: formData.actionTaken.trim(),
            additionalNotes: formData.additionalNotes.trim(),
            recommendationsFollowUp:
              formData.recommendationsFollowUp.trim(),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Could not update visit.");
      }

      const updatedVisit = await fetch(
        `http://localhost:4000/api/visits/${visitId}`,
        {
          credentials: "include",
        }
      );

      const updatedData = await updatedVisit.json();

      if (!updatedVisit.ok) {
        throw new Error(
          updatedData.error || "Visit was updated but could not be reloaded."
        );
      }

      setVisit(updatedData);
      setFormData(createFormData(updatedData));
      setEditMode(false);
    } catch (err) {
      setFormError(
        err instanceof Error ? err.message : "Could not update visit."
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div style={{ padding: "40px", fontFamily: "Arial, sans-serif" }}>
        Loading visit...
      </div>
    );
  }

  if (error || !visit) {
    return (
      <div
        style={{
          padding: "40px",
          fontFamily: "Arial, sans-serif",
          background: "#f8fafc",
          minHeight: "100vh",
        }}
      >
        <button
          onClick={() => navigate(`/patients/${patientId}`)}
          style={{
            border: "none",
            background: "transparent",
            cursor: "pointer",
            color: "#2563eb",
            fontWeight: 600,
            marginBottom: "20px",
          }}
        >
          ← Back to Patient
        </button>

        <div
          style={{
            background: "#fff",
            padding: "24px",
            borderRadius: "12px",
            border: "1px solid #e2e8f0",
            color: "#b91c1c",
          }}
        >
          {error || "Visit not found."}
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f8fafc",
        padding: "32px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        <button
          onClick={() => navigate(`/patients/${patientId}`)}
          style={{
            border: "none",
            background: "transparent",
            cursor: "pointer",
            color: "#2563eb",
            fontWeight: 600,
            marginBottom: "20px",
            padding: 0,
          }}
        >
          ← Back to Patient
        </button>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: "20px",
            marginBottom: "24px",
          }}
        >
          <div>
            <h1
              style={{
                margin: "0 0 8px",
                fontSize: "28px",
                color: "#0f172a",
              }}
            >
              Visit Details
            </h1>

            <div style={{ color: "#64748b" }}>
              {visit.patient.fullName} · {visit.patient.displayId}
            </div>
          </div>

          <div
            style={{
              display: "flex",
              gap: "10px",
              flexWrap: "wrap",
            }}
          >
            {!editMode && (
              <button
                onClick={startEditing}
                style={{
                  background: "#0f766e",
                  color: "#fff",
                  border: "none",
                  borderRadius: "8px",
                  padding: "11px 18px",
                  cursor: "pointer",
                  fontWeight: 700,
                }}
              >
                Edit Visit
              </button>
            )}

            <button
              onClick={() =>
                navigate(`/patients/${patientId}/new-visit`)
              }
              style={{
                background: "#2563eb",
                color: "#fff",
                border: "none",
                borderRadius: "8px",
                padding: "11px 18px",
                cursor: "pointer",
                fontWeight: 700,
              }}
            >
              + New Visit
            </button>
          </div>
        </div>

        {editMode && formData ? (
          <form onSubmit={saveChanges}>
            <div
              style={{
                background: "#fff",
                border: "1px solid #e2e8f0",
                borderRadius: "12px",
                padding: "24px",
                marginBottom: "20px",
              }}
            >
              <h2
                style={{
                  margin: "0 0 20px",
                  fontSize: "19px",
                  color: "#0f172a",
                }}
              >
                Edit Visit
              </h2>

              {formError && (
                <div
                  style={{
                    background: "#fef2f2",
                    border: "1px solid #fecaca",
                    color: "#b91c1c",
                    padding: "12px",
                    borderRadius: "8px",
                    marginBottom: "20px",
                    fontSize: "14px",
                  }}
                >
                  {formError}
                </div>
              )}

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "repeat(2, minmax(0, 1fr))",
                  gap: "20px",
                }}
              >
                <InputField
                  label="Visit Date & Time"
                  type="datetime-local"
                  value={formData.visitDateTime}
                  onChange={(value) =>
                    updateField("visitDateTime", value)
                  }
                  required
                />

                <InputField
                  label="Reason for Visit"
                  value={formData.reasonForVisit}
                  onChange={(value) =>
                    updateField("reasonForVisit", value)
                  }
                  required
                />
              </div>
            </div>

            <div
              style={{
                background: "#fff",
                border: "1px solid #e2e8f0",
                borderRadius: "12px",
                padding: "24px",
                marginBottom: "20px",
              }}
            >
              <h2
                style={{
                  margin: "0 0 20px",
                  fontSize: "19px",
                  color: "#0f172a",
                }}
              >
                Patient's Description / Complaint
              </h2>

              <TextAreaField
                label="Description"
                value={formData.complaintSymptoms}
                onChange={(value) =>
                  updateField("complaintSymptoms", value)
                }
                rows={5}
              />
            </div>

            <div
              style={{
                background: "#fff",
                border: "1px solid #e2e8f0",
                borderRadius: "12px",
                padding: "24px",
                marginBottom: "20px",
              }}
            >
              <h2
                style={{
                  margin: "0 0 20px",
                  fontSize: "19px",
                  color: "#0f172a",
                }}
              >
                Vitals
              </h2>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "repeat(3, minmax(0, 1fr))",
                  gap: "20px",
                }}
              >
                <InputField
                  label="Blood Pressure"
                  value={formData.bloodPressure}
                  onChange={(value) =>
                    updateField("bloodPressure", value)
                  }
                />

                <InputField
                  label="Pulse"
                  type="number"
                  value={formData.pulse}
                  onChange={(value) =>
                    updateField("pulse", value)
                  }
                />

                <InputField
                  label="Blood Sugar"
                  type="number"
                  value={formData.bloodSugar}
                  onChange={(value) =>
                    updateField("bloodSugar", value)
                  }
                />

                <InputField
                  label="Respiration"
                  type="number"
                  value={formData.respiration}
                  onChange={(value) =>
                    updateField("respiration", value)
                  }
                />

                <InputField
                  label="Temperature"
                  type="number"
                  value={formData.temperature}
                  onChange={(value) =>
                    updateField("temperature", value)
                  }
                />
              </div>
            </div>

            <div
              style={{
                background: "#fff",
                border: "1px solid #e2e8f0",
                borderRadius: "12px",
                padding: "24px",
                marginBottom: "20px",
              }}
            >
              <h2
                style={{
                  margin: "0 0 20px",
                  fontSize: "19px",
                  color: "#0f172a",
                }}
              >
                Clinical Record
              </h2>

              <div
                style={{
                  display: "grid",
                  gap: "20px",
                }}
              >
                <TextAreaField
                  label="Assessment / Observation"
                  value={formData.assessmentObservation}
                  onChange={(value) =>
                    updateField(
                      "assessmentObservation",
                      value
                    )
                  }
                />

                <TextAreaField
                  label="Treatment"
                  value={formData.treatment}
                  onChange={(value) =>
                    updateField("treatment", value)
                  }
                />

                <TextAreaField
                  label="Action Taken"
                  value={formData.actionTaken}
                  onChange={(value) =>
                    updateField("actionTaken", value)
                  }
                />

                <TextAreaField
                  label="Additional Notes"
                  value={formData.additionalNotes}
                  onChange={(value) =>
                    updateField("additionalNotes", value)
                  }
                />

                <TextAreaField
                  label="Recommendations / Follow-up"
                  value={formData.recommendationsFollowUp}
                  onChange={(value) =>
                    updateField(
                      "recommendationsFollowUp",
                      value
                    )
                  }
                />
              </div>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "10px",
                marginBottom: "20px",
              }}
            >
              <button
                type="button"
                onClick={cancelEditing}
                disabled={saving}
                style={{
                  background: "#fff",
                  color: "#475569",
                  border: "1px solid #cbd5e1",
                  borderRadius: "8px",
                  padding: "11px 20px",
                  cursor: saving ? "not-allowed" : "pointer",
                  fontWeight: 700,
                }}
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={saving}
                style={{
                  background: "#2563eb",
                  color: "#fff",
                  border: "none",
                  borderRadius: "8px",
                  padding: "11px 20px",
                  cursor: saving ? "not-allowed" : "pointer",
                  fontWeight: 700,
                }}
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        ) : (
          <>
            <div
              style={{
                background: "#fff",
                border: "1px solid #e2e8f0",
                borderRadius: "12px",
                padding: "24px",
                marginBottom: "20px",
              }}
            >
              <h2
                style={{
                  margin: "0 0 20px",
                  fontSize: "19px",
                  color: "#0f172a",
                }}
              >
                Visit Information
              </h2>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "repeat(2, minmax(0, 1fr))",
                  gap: "10px 30px",
                }}
              >
                <Field label="Visit ID" value={visit.displayId} />

                <Field
                  label="Date & Time"
                  value={formatDateTime(
                    visit.visitDateTime
                  )}
                />

                <Field
                  label="Recorded By"
                  value={`${visit.staff.fullName} (${visit.staff.displayId})`}
                />

                <Field
                  label="Username"
                  value={visit.staff.username}
                />

                <Field
                  label="Reason for Visit"
                  value={visit.reasonForVisit}
                />
              </div>
            </div>

            <div
              style={{
                background: "#fff",
                border: "1px solid #e2e8f0",
                borderRadius: "12px",
                padding: "24px",
                marginBottom: "20px",
              }}
            >
              <h2
                style={{
                  margin: "0 0 20px",
                  fontSize: "19px",
                  color: "#0f172a",
                }}
              >
                Patient's Description / Complaint
              </h2>

              <Field
                value={visit.complaintSymptoms}
                label=""
              />
            </div>

            <div
              style={{
                background: "#fff",
                border: "1px solid #e2e8f0",
                borderRadius: "12px",
                padding: "24px",
                marginBottom: "20px",
              }}
            >
              <h2
                style={{
                  margin: "0 0 20px",
                  fontSize: "19px",
                  color: "#0f172a",
                }}
              >
                Vitals
              </h2>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "repeat(3, minmax(0, 1fr))",
                  gap: "10px 30px",
                }}
              >
                <Field
                  label="Blood Pressure"
                  value={visit.bloodPressure}
                />

                <Field
                  label="Pulse"
                  value={visit.pulse}
                />

                <Field
                  label="Blood Sugar"
                  value={visit.bloodSugar}
                />

                <Field
                  label="Respiration"
                  value={visit.respiration}
                />

                <Field
                  label="Temperature"
                  value={visit.temperature}
                />
              </div>
            </div>

            <div
              style={{
                background: "#fff",
                border: "1px solid #e2e8f0",
                borderRadius: "12px",
                padding: "24px",
                marginBottom: "20px",
              }}
            >
              <h2
                style={{
                  margin: "0 0 20px",
                  fontSize: "19px",
                  color: "#0f172a",
                }}
              >
                Clinical Record
              </h2>

              <Field
                label="Assessment / Observation"
                value={visit.assessmentObservation}
              />

              <Field
                label="Treatment"
                value={visit.treatment}
              />

              <Field
                label="Action Taken"
                value={visit.actionTaken}
              />

              <Field
                label="Additional Notes"
                value={visit.additionalNotes}
              />

              <Field
                label="Recommendations / Follow-up"
                value={visit.recommendationsFollowUp}
              />
            </div>

            <div
              style={{
                background: "#fff",
                border: "1px solid #e2e8f0",
                borderRadius: "12px",
                padding: "24px",
              }}
            >
              <h2
                style={{
                  margin: "0 0 20px",
                  fontSize: "19px",
                  color: "#0f172a",
                }}
              >
                Record Information
              </h2>

              <Field
                label="Created"
                value={formatDateTime(visit.createdAt)}
              />

              <Field
                label="Last Updated"
                value={formatDateTime(visit.updatedAt)}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

