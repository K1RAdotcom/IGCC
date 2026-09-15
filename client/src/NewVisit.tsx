import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";

type Patient = {
  patientId: string;
  displayId: string;
  fullName: string;
};

function NewVisit() {
  const { patientId } = useParams();
  const navigate = useNavigate();

  const [patient, setPatient] = useState<Patient | null>(null);
  const [loadingPatient, setLoadingPatient] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [visitDateTime, setVisitDateTime] = useState(() => {
    const now = new Date();
    const offset = now.getTimezoneOffset();
    return new Date(now.getTime() - offset * 60000)
      .toISOString()
      .slice(0, 16);
  });

  const [reasonForVisit, setReasonForVisit] = useState("");
  const [complaintSymptoms, setComplaintSymptoms] = useState("");
  const [bloodPressure, setBloodPressure] = useState("");
  const [pulse, setPulse] = useState("");
  const [bloodSugar, setBloodSugar] = useState("");
  const [respiration, setRespiration] = useState("");
  const [temperature, setTemperature] = useState("");
  const [assessmentObservation, setAssessmentObservation] = useState("");
  const [treatment, setTreatment] = useState("");
  const [actionTaken, setActionTaken] = useState("");
  const [additionalNotes, setAdditionalNotes] = useState("");
  const [recommendationsFollowUp, setRecommendationsFollowUp] = useState("");

  useEffect(() => {
    async function loadPatient() {
      if (!patientId) {
        setError("Patient ID is missing.");
        setLoadingPatient(false);
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
          setError(data.error || "Could not load patient.");
          return;
        }

        setPatient({
          patientId: data.patientId,
          displayId: data.displayId,
          fullName: data.fullName,
        });
      } catch {
        setError("Unable to connect to the clinic server.");
      } finally {
        setLoadingPatient(false);
      }
    }

    loadPatient();
  }, [patientId]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!patientId) {
      setError("Patient ID is missing.");
      return;
    }

    if (!reasonForVisit.trim()) {
      setError("Reason for visit is required.");
      return;
    }

    setSaving(true);
    setError("");

    const numericValue = (value: string) =>
      value.trim() === "" ? undefined : Number(value);

    const payload = {
      patientId,
      visitDateTime: new Date(visitDateTime).toISOString(),
      reasonForVisit,
      complaintSymptoms,
      bloodPressure,
      pulse: numericValue(pulse),
      bloodSugar: numericValue(bloodSugar),
      respiration: numericValue(respiration),
      temperature: numericValue(temperature),
      assessmentObservation,
      treatment,
      actionTaken,
      additionalNotes,
      recommendationsFollowUp,
    };

    try {
      const response = await fetch("http://localhost:4000/api/visits", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Could not record visit.");
        return;
      }

      navigate(`/patients/${patientId}`);
    } catch {
      setError("Unable to connect to the clinic server.");
    } finally {
      setSaving(false);
    }
  }

  if (loadingPatient) {
    return (
      <div style={pageStyle}>
        <div style={cardStyle}>Loading patient...</div>
      </div>
    );
  }

  if (!patient) {
    return (
      <div style={pageStyle}>
        <button
          type="button"
          onClick={() => navigate("/patients")}
          style={backButtonStyle}
        >
          ? Back to Patients
        </button>

        <div style={errorStyle}>{error || "Patient not found."}</div>
      </div>
    );
  }

  return (
    <div style={pageStyle}>
      <div style={topBarStyle}>
        <button
          type="button"
          onClick={() => navigate(`/patients/${patient.patientId}`)}
          style={backButtonStyle}
        >
          ? Back to Patient Profile
        </button>
      </div>

      <div style={headerStyle}>
        <div>
          <h1 style={titleStyle}>Record New Visit</h1>
          <p style={subtitleStyle}>
            Enter the details of the patient's current clinic visit.
          </p>
        </div>
      </div>

      <div style={patientBannerStyle}>
        <div>
          <div style={smallLabelStyle}>Patient</div>
          <strong style={patientNameStyle}>{patient.fullName}</strong>
        </div>

        <div>
          <div style={smallLabelStyle}>Patient ID</div>
          <strong style={patientIdStyle}>{patient.displayId}</strong>
        </div>
      </div>

      {error && <div style={errorStyle}>{error}</div>}

      <form onSubmit={handleSubmit}>
        <div style={cardStyle}>
          <h2 style={sectionTitleStyle}>Visit Information</h2>

          <div style={formGridStyle}>
            <Field
              label="Visit Date & Time"
              required
              input={
                <input
                  type="datetime-local"
                  value={visitDateTime}
                  onChange={(event) => setVisitDateTime(event.target.value)}
                  style={inputStyle}
                />
              }
            />

            <Field
              label="Reason for Visit"
              required
              input={
                <input
                  type="text"
                  value={reasonForVisit}
                  onChange={(event) => setReasonForVisit(event.target.value)}
                  placeholder="e.g. Routine check, headache, dizziness..."
                  style={inputStyle}
                />
              }
            />
          </div>

          <div style={{ marginTop: "22px" }}>
            <label style={labelStyle}>
              Patient's Description / Complaint <span>*</span>
            </label>

            <textarea
              value={complaintSymptoms}
              onChange={(event) => setComplaintSymptoms(event.target.value)}
              placeholder="Describe the patient's complaint, symptoms, or reason for seeking care..."
              rows={5}
              style={textareaStyle}
            />
          </div>
        </div>

        <div style={cardStyle}>
          <h2 style={sectionTitleStyle}>Vital Signs</h2>

          <div style={formGridStyle}>
            <Field
              label="Blood Pressure"
              input={
                <input
                  type="text"
                  value={bloodPressure}
                  onChange={(event) => setBloodPressure(event.target.value)}
                  placeholder="e.g. 130/80"
                  style={inputStyle}
                />
              }
            />

            <Field
              label="Pulse"
              input={
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={pulse}
                  onChange={(event) => setPulse(event.target.value)}
                  placeholder="bpm"
                  style={inputStyle}
                />
              }
            />

            <Field
              label="Blood Sugar"
              input={
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={bloodSugar}
                  onChange={(event) => setBloodSugar(event.target.value)}
                  placeholder="e.g. 5.4"
                  style={inputStyle}
                />
              }
            />

            <Field
              label="Respiration"
              input={
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={respiration}
                  onChange={(event) => setRespiration(event.target.value)}
                  placeholder="breaths/min"
                  style={inputStyle}
                />
              }
            />

            <Field
              label="Temperature"
              input={
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={temperature}
                  onChange={(event) => setTemperature(event.target.value)}
                  placeholder="°C"
                  style={inputStyle}
                />
              }
            />
          </div>
        </div>

        <div style={cardStyle}>
          <h2 style={sectionTitleStyle}>Clinical Record</h2>

          <TextAreaField
            label="Assessment / Observation"
            value={assessmentObservation}
            onChange={setAssessmentObservation}
            placeholder="Record your clinical observation or assessment..."
          />

          <TextAreaField
            label="Treatment"
            value={treatment}
            onChange={setTreatment}
            placeholder="Describe treatment provided..."
          />

          <TextAreaField
            label="Action Taken"
            value={actionTaken}
            onChange={setActionTaken}
            placeholder="Record the action taken during the visit..."
          />

          <TextAreaField
            label="Additional Notes"
            value={additionalNotes}
            onChange={setAdditionalNotes}
            placeholder="Add any other relevant information..."
          />

          <TextAreaField
            label="Recommendations / Follow-up"
            value={recommendationsFollowUp}
            onChange={setRecommendationsFollowUp}
            placeholder="Record recommendations, monitoring instructions, or follow-up..."
          />
        </div>

        <div style={actionBarStyle}>
          <button
            type="button"
            onClick={() => navigate(`/patients/${patient.patientId}`)}
            style={cancelButtonStyle}
            disabled={saving}
          >
            Cancel
          </button>

          <button type="submit" style={saveButtonStyle} disabled={saving}>
            {saving ? "Saving Visit..." : "Save Visit"}
          </button>
        </div>
      </form>
    </div>
  );
}

function Field({
  label,
  required,
  input,
}: {
  label: string;
  required?: boolean;
  input: React.ReactNode;
}) {
  return (
    <div>
      <label style={labelStyle}>
        {label} {required && <span>*</span>}
      </label>
      {input}
    </div>
  );
}

function TextAreaField({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}) {
  return (
    <div style={{ marginTop: "22px" }}>
      <label style={labelStyle}>{label}</label>

      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        rows={5}
        style={textareaStyle}
      />
    </div>
  );
}

const pageStyle: React.CSSProperties = {
  minHeight: "100vh",
  background: "#f4f7f6",
  fontFamily: "Arial, sans-serif",
  padding: "30px",
  boxSizing: "border-box",
};

const topBarStyle: React.CSSProperties = {
  marginBottom: "20px",
};

const headerStyle: React.CSSProperties = {
  marginBottom: "20px",
};

const titleStyle: React.CSSProperties = {
  margin: 0,
  color: "#173f35",
  fontSize: "30px",
};

const subtitleStyle: React.CSSProperties = {
  color: "#666",
  marginTop: "7px",
};

const backButtonStyle: React.CSSProperties = {
  background: "transparent",
  border: "none",
  color: "#173f35",
  fontWeight: "bold",
  cursor: "pointer",
  fontSize: "15px",
};

const patientBannerStyle: React.CSSProperties = {
  background: "#eef4f1",
  border: "1px solid #d7e5df",
  borderRadius: "10px",
  padding: "18px 22px",
  display: "flex",
  gap: "50px",
  flexWrap: "wrap",
  marginBottom: "20px",
};

const smallLabelStyle: React.CSSProperties = {
  color: "#6b756f",
  fontSize: "12px",
  textTransform: "uppercase",
  marginBottom: "4px",
};

const patientNameStyle: React.CSSProperties = {
  color: "#173f35",
  fontSize: "18px",
};

const patientIdStyle: React.CSSProperties = {
  color: "#173f35",
};

const cardStyle: React.CSSProperties = {
  background: "white",
  borderRadius: "10px",
  padding: "25px",
  marginBottom: "20px",
  boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
};

const sectionTitleStyle: React.CSSProperties = {
  margin: 0,
  color: "#173f35",
  fontSize: "19px",
};

const formGridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))",
  gap: "20px",
  marginTop: "22px",
};

const labelStyle: React.CSSProperties = {
  display: "block",
  color: "#444",
  fontSize: "14px",
  fontWeight: "bold",
  marginBottom: "7px",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  boxSizing: "border-box",
  padding: "12px",
  border: "1px solid #ccc",
  borderRadius: "7px",
  fontSize: "14px",
  background: "white",
};

const textareaStyle: React.CSSProperties = {
  width: "100%",
  boxSizing: "border-box",
  padding: "12px",
  border: "1px solid #ccc",
  borderRadius: "7px",
  fontSize: "14px",
  resize: "vertical",
  fontFamily: "Arial, sans-serif",
  lineHeight: 1.5,
};

const errorStyle: React.CSSProperties = {
  background: "#fdecec",
  color: "#b42318",
  padding: "13px",
  borderRadius: "7px",
  marginBottom: "20px",
};

const actionBarStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "flex-end",
  gap: "12px",
  paddingBottom: "30px",
};

const cancelButtonStyle: React.CSSProperties = {
  background: "white",
  color: "#173f35",
  border: "1px solid #173f35",
  borderRadius: "7px",
  padding: "13px 20px",
  fontWeight: "bold",
  cursor: "pointer",
};

const saveButtonStyle: React.CSSProperties = {
  background: "#173f35",
  color: "white",
  border: "none",
  borderRadius: "7px",
  padding: "13px 22px",
  fontWeight: "bold",
  cursor: "pointer",
};

export default NewVisit;

