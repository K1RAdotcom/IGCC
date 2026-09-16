import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

type Staff = {
  displayId: string;
  fullName: string;
  username: string;
};

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
  staff: Staff;
};

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
  createdAt: string;
  updatedAt: string;
  visits: Visit[];
};

function PatientProfile() {
  const { patientId } = useParams();
  const navigate = useNavigate();

  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
          setError(data.error || "Could not load patient profile.");
          return;
        }

        setPatient(data);
      } catch {
        setError("Unable to connect to the clinic server.");
      } finally {
        setLoading(false);
      }
    }

    loadPatient();
  }, [patientId]);

  function getCategoryLabel(category: Patient["patientCategory"]) {
    switch (category) {
      case "MEMBER":
        return "Club Member";
      case "STAFF":
        return "Staff";
      case "GUEST":
        return "Guest/Visitor";
      case "OTHER":
        return "Other";
      default:
        return category;
    }
  }

  function calculateAge(dateOfBirth: string) {
    const birthDate = new Date(dateOfBirth);
    const today = new Date();

    let age = today.getFullYear() - birthDate.getFullYear();

    const monthDifference = today.getMonth() - birthDate.getMonth();

    if (
      monthDifference < 0 ||
      (monthDifference === 0 &&
        today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age;
  }

  function formatDate(date: string) {
    return new Date(date).toLocaleDateString();
  }

  function formatDateTime(date: string) {
    return new Date(date).toLocaleString();
  }

  function displayValue(value?: string | number | null) {
    if (value === null || value === undefined || value === "") {
      return "Not recorded";
    }

    return String(value);
  }

  if (loading) {
    return (
      <div style={pageStyle}>
        <div style={loadingStyle}>Loading patient profile...</div>
      </div>
    );
  }

  if (error || !patient) {
    return (
      <div style={pageStyle}>
        <button onClick={() => navigate("/patients")} style={backButtonStyle}>
          ← Back to Patients
        </button>

        <div style={errorStyle}>
          {error || "Patient profile could not be found."}
        </div>
      </div>
    );
  }

  const latestVisit = patient.visits.length > 0 ? patient.visits[0] : null;

  return (
    <div style={pageStyle}>
      <div style={topBarStyle}>
        <button onClick={() => navigate("/patients")} style={backButtonStyle}>
          ← Back to Patients
        </button>

        <div style={{ display: "flex", gap: "10px" }}>
          <button
            onClick={() => navigate(`/patients/${patient.patientId}/new-visit`)}
            style={primaryButtonStyle}
          >
            + New Visit
          </button>

          <button style={secondaryButtonStyle} onClick={() => navigate(`/patients/${patient.patientId}/edit`)}>Edit Patient</button>
        </div>
      </div>

      <div style={headerCardStyle}>
        <div style={avatarStyle}>
          {patient.fullName.charAt(0).toUpperCase()}
        </div>

        <div>
          <h1 style={titleStyle}>{patient.fullName}</h1>

          <div style={subtitleStyle}>
            {patient.displayId} • {getCategoryLabel(patient.patientCategory)}
          </div>
        </div>
      </div>

      <div style={sectionCardStyle}>
        <h2 style={sectionTitleStyle}>Personal Information</h2>

        <div style={gridStyle}>
          <InfoItem label="Full Name" value={patient.fullName} />
          <InfoItem label="Patient ID" value={patient.displayId} />
          <InfoItem
            label="Date of Birth"
            value={`${formatDate(patient.dateOfBirth)} (${calculateAge(
              patient.dateOfBirth
            )} years)`}
          />
          <InfoItem label="Gender" value={displayValue(patient.gender)} />
          <InfoItem label="Phone" value={patient.phone} />
          <InfoItem
            label="Secondary Phone"
            value={displayValue(patient.secondaryPhone)}
          />
          <InfoItem label="Email" value={displayValue(patient.email)} />
          <InfoItem label="Address" value={displayValue(patient.address)} />
          <InfoItem
            label="Patient Category"
            value={getCategoryLabel(patient.patientCategory)}
          />
          <InfoItem
            label="Golf Club Membership"
            value={displayValue(patient.golfClubMembership)}
          />
        </div>
      </div>

      <div style={sectionCardStyle}>
        <h2 style={sectionTitleStyle}>Emergency Contact</h2>

        <div style={gridStyle}>
          <InfoItem
            label="Contact Name"
            value={patient.emergencyContactName}
          />
          <InfoItem
            label="Contact Phone"
            value={patient.emergencyContactPhone}
          />
        </div>
      </div>

      <div style={sectionCardStyle}>
        <h2 style={sectionTitleStyle}>Medical / Physical Information</h2>

        <p style={textBlockStyle}>
          {displayValue(patient.medicalPhysicalInformation)}
        </p>
      </div>

      <div style={sectionCardStyle}>
        <h2 style={sectionTitleStyle}>Additional Notes</h2>

        <p style={textBlockStyle}>
          {displayValue(patient.additionalNotes)}
        </p>
      </div>

      <div style={sectionCardStyle}>
        <div style={sectionHeaderStyle}>
          <h2 style={sectionTitleStyle}>Latest Visit</h2>

          {latestVisit && (
            <span style={visitIdStyle}>{latestVisit.displayId}</span>
          )}
        </div>

        {!latestVisit ? (
          <p style={emptyStyle}>No visits recorded for this patient.</p>
        ) : (
          <VisitCard visit={latestVisit} formatDateTime={formatDateTime} />
        )}
      </div>

      <div style={sectionCardStyle}>
        <div style={sectionHeaderStyle}>
          <h2 style={sectionTitleStyle}>Visit History</h2>

          <span style={countStyle}>
            {patient.visits.length}{" "}
            {patient.visits.length === 1 ? "visit" : "visits"}
          </span>
        </div>

        {patient.visits.length === 0 ? (
          <p style={emptyStyle}>No visit history available.</p>
        ) : (
          <div>
            {patient.visits.map((visit) => (
              <div key={visit.visitId} style={historyItemStyle}>
                <div>
                  <strong style={{ color: "#173f35" }}>
                    {visit.displayId}
                  </strong>

                  <div style={historyDateStyle}>
                    {formatDateTime(visit.visitDateTime)}
                  </div>
                </div>

                <div style={{ flex: 1 }}>
                  <div style={historyReasonStyle}>
                    {visit.reasonForVisit}
                  </div>

                  <div style={historyStaffStyle}>
                    Recorded by {visit.staff.fullName} ({visit.staff.displayId})
                  </div>
                </div>

                <button
                  style={viewButtonStyle}
                  onClick={() =>
                    navigate(
                      `/patients/${patient.patientId}/visits/${visit.visitId}`
                    )
                  }
                >
                  View
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function InfoItem({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <div style={labelStyle}>{label}</div>
      <div style={valueStyle}>{value}</div>
    </div>
  );
}

function VisitCard({
  visit,
  formatDateTime,
}: {
  visit: Visit;
  formatDateTime: (date: string) => string;
}) {
  return (
    <div>
      <div style={visitMetaStyle}>
        <strong>{formatDateTime(visit.visitDateTime)}</strong>
        <span>Recorded by {visit.staff.fullName}</span>
      </div>

      <div style={visitGridStyle}>
        <InfoItem
          label="Reason for Visit"
          value={displayVisitValue(visit.reasonForVisit)}
        />

        <InfoItem
          label="Patient's Description / Complaint"
          value={displayVisitValue(visit.complaintSymptoms)}
        />

        <InfoItem
          label="Blood Pressure"
          value={displayVisitValue(visit.bloodPressure)}
        />

        <InfoItem label="Pulse" value={displayVisitValue(visit.pulse)} />

        <InfoItem
          label="Blood Sugar"
          value={displayVisitValue(visit.bloodSugar)}
        />

        <InfoItem
          label="Respiration"
          value={displayVisitValue(visit.respiration)}
        />

        <InfoItem
          label="Temperature"
          value={displayVisitValue(visit.temperature)}
        />
      </div>

      <div style={detailBlockStyle}>
        <Detail label="Assessment / Observation" value={visit.assessmentObservation} />
        <Detail label="Treatment" value={visit.treatment} />
        <Detail label="Action Taken" value={visit.actionTaken} />
        <Detail label="Additional Notes" value={visit.additionalNotes} />
        <Detail
          label="Recommendations / Follow-up"
          value={visit.recommendationsFollowUp}
        />
      </div>
    </div>
  );
}

function Detail({
  label,
  value,
}: {
  label: string;
  value?: string | null;
}) {
  return (
    <div style={{ marginTop: "18px" }}>
      <div style={labelStyle}>{label}</div>
      <div style={textBlockStyle}>{displayVisitValue(value)}</div>
    </div>
  );
}

function displayVisitValue(value?: string | number | null) {
  if (value === null || value === undefined || value === "") {
    return "Not recorded";
  }

  return String(value);
}

const pageStyle: React.CSSProperties = {
  minHeight: "100vh",
  background: "#f4f7f6",
  fontFamily: "Arial, sans-serif",
  padding: "30px",
  boxSizing: "border-box",
};

const topBarStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "20px",
  gap: "15px",
  flexWrap: "wrap",
};

const backButtonStyle: React.CSSProperties = {
  background: "transparent",
  border: "none",
  color: "#173f35",
  fontWeight: "bold",
  cursor: "pointer",
  fontSize: "15px",
};

const primaryButtonStyle: React.CSSProperties = {
  background: "#173f35",
  color: "white",
  border: "none",
  borderRadius: "7px",
  padding: "12px 18px",
  fontWeight: "bold",
  cursor: "pointer",
};

const secondaryButtonStyle: React.CSSProperties = {
  background: "white",
  color: "#173f35",
  border: "1px solid #173f35",
  borderRadius: "7px",
  padding: "12px 18px",
  fontWeight: "bold",
  cursor: "pointer",
};

const headerCardStyle: React.CSSProperties = {
  background: "white",
  borderRadius: "10px",
  padding: "25px",
  display: "flex",
  alignItems: "center",
  gap: "18px",
  marginBottom: "20px",
  boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
};

const avatarStyle: React.CSSProperties = {
  width: "65px",
  height: "65px",
  borderRadius: "50%",
  background: "#173f35",
  color: "white",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "27px",
  fontWeight: "bold",
};

const titleStyle: React.CSSProperties = {
  margin: 0,
  color: "#173f35",
  fontSize: "28px",
};

const subtitleStyle: React.CSSProperties = {
  color: "#666",
  marginTop: "7px",
};

const sectionCardStyle: React.CSSProperties = {
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

const sectionHeaderStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "20px",
};

const gridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: "22px",
  marginTop: "20px",
};

const visitGridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
  gap: "20px",
  marginTop: "25px",
};

const labelStyle: React.CSSProperties = {
  fontSize: "12px",
  color: "#777",
  marginBottom: "5px",
  textTransform: "uppercase",
  letterSpacing: "0.4px",
};

const valueStyle: React.CSSProperties = {
  color: "#222",
  fontSize: "15px",
  lineHeight: 1.5,
};

const textBlockStyle: React.CSSProperties = {
  color: "#333",
  fontSize: "15px",
  lineHeight: 1.6,
  whiteSpace: "pre-wrap",
  marginTop: "10px",
};

const visitMetaStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  gap: "15px",
  flexWrap: "wrap",
  color: "#555",
  fontSize: "14px",
};

const detailBlockStyle: React.CSSProperties = {
  borderTop: "1px solid #eee",
  marginTop: "25px",
  paddingTop: "5px",
};

const visitIdStyle: React.CSSProperties = {
  background: "#eef4f1",
  color: "#173f35",
  padding: "6px 10px",
  borderRadius: "6px",
  fontSize: "13px",
  fontWeight: "bold",
};

const countStyle: React.CSSProperties = {
  color: "#666",
  fontSize: "14px",
};

const historyItemStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "20px",
  padding: "18px 0",
  borderBottom: "1px solid #eee",
};

const historyDateStyle: React.CSSProperties = {
  color: "#777",
  fontSize: "13px",
  marginTop: "5px",
};

const historyReasonStyle: React.CSSProperties = {
  fontWeight: "bold",
  color: "#333",
};

const historyStaffStyle: React.CSSProperties = {
  color: "#777",
  fontSize: "13px",
  marginTop: "5px",
};

const viewButtonStyle: React.CSSProperties = {
  background: "transparent",
  border: "none",
  color: "#173f35",
  fontWeight: "bold",
  cursor: "pointer",
};

const emptyStyle: React.CSSProperties = {
  color: "#777",
  marginTop: "20px",
};

const loadingStyle: React.CSSProperties = {
  background: "white",
  borderRadius: "10px",
  padding: "30px",
  textAlign: "center",
  color: "#666",
};

const errorStyle: React.CSSProperties = {
  background: "#fdecec",
  color: "#b42318",
  padding: "15px",
  borderRadius: "7px",
  marginTop: "20px",
};

export default PatientProfile;
