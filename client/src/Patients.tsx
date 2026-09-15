import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

type Patient = {
  patientId: string;
  displayId: string;
  fullName: string;
  phone: string;
  patientCategory: "MEMBER" | "STAFF" | "GUEST" | "OTHER";
  dateOfBirth: string;
};

function Patients() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("ALL");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  async function loadPatients(searchTerm = "") {
    setLoading(true);
    setError("");

    try {
      const url = searchTerm
        ? `http://localhost:4000/api/patients?search=${encodeURIComponent(searchTerm)}`
        : "http://localhost:4000/api/patients";

      const response = await fetch(url, {
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Could not load patients.");
        return;
      }

      setPatients(data);
    } catch {
      setError("Unable to connect to the clinic server.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPatients();
  }, []);

  const filteredPatients = patients.filter((patient) => {
    if (category === "ALL") {
      return true;
    }

    return patient.patientCategory === category;
  });

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

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f4f7f6",
        fontFamily: "Arial, sans-serif",
        padding: "30px",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "25px",
        }}
      >
        <div>
          <h1
            style={{
              margin: 0,
              color: "#173f35",
              fontSize: "30px",
            }}
          >
            Patients
          </h1>

          <p style={{ color: "#666" }}>
            Search and manage clinic patient records.
          </p>
        </div>

        <button
  type="button"
  onClick={() => navigate("/dashboard")}
  style={{
    padding: "10px 16px",
    borderRadius: "8px",
    border: "1px solid #d1d5db",
    background: "#ffffff",
    cursor: "pointer",
    fontWeight: 600,
  }}
>
  ← Back to Dashboard
</button>

        <button
          onClick={() => navigate("/new-patient")}
          style={{
            background: "#173f35",
            color: "white",
            border: "none",
            borderRadius: "7px",
            padding: "13px 18px",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          + Register New Patient
        </button>
      </div>

      <div
        style={{
          background: "white",
          padding: "20px",
          borderRadius: "10px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
          marginBottom: "25px",
        }}
      >
        <div
          style={{
            display: "flex",
            gap: "12px",
            flexWrap: "wrap",
          }}
        >
          <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                loadPatients(search);
              }
            }}
            placeholder="Search Patient ID, name or phone..."
            style={{
              flex: 1,
              minWidth: "250px",
              padding: "13px",
              border: "1px solid #ccc",
              borderRadius: "7px",
              fontSize: "15px",
            }}
          />

          <button
            onClick={() => loadPatients(search)}
            style={{
              padding: "13px 20px",
              background: "#173f35",
              color: "white",
              border: "none",
              borderRadius: "7px",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            Search
          </button>

          <select
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            style={{
              padding: "13px",
              border: "1px solid #ccc",
              borderRadius: "7px",
              background: "white",
            }}
          >
            <option value="ALL">All Categories</option>
            <option value="MEMBER">Club Member</option>
            <option value="STAFF">Staff</option>
            <option value="GUEST">Guest/Visitor</option>
            <option value="OTHER">Other</option>
          </select>
        </div>
      </div>

      {error && (
        <div
          style={{
            background: "#fdecec",
            color: "#b42318",
            padding: "12px",
            borderRadius: "7px",
            marginBottom: "20px",
          }}
        >
          {error}
        </div>
      )}

      <div
        style={{
          background: "white",
          borderRadius: "10px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
          overflow: "hidden",
        }}
      >
        {loading ? (
          <div style={{ padding: "30px", textAlign: "center" }}>
            Loading patients...
          </div>
        ) : filteredPatients.length === 0 ? (
          <div style={{ padding: "30px", textAlign: "center", color: "#666" }}>
            No patients found.
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                minWidth: "750px",
              }}
            >
              <thead>
                <tr style={{ background: "#f7f9f8" }}>
                  <th style={headerStyle}>Patient ID</th>
                  <th style={headerStyle}>Name</th>
                  <th style={headerStyle}>Category</th>
                  <th style={headerStyle}>Phone</th>
                  <th style={headerStyle}>Date of Birth</th>
                  <th style={headerStyle}>Action</th>
                </tr>
              </thead>

              <tbody>
                {filteredPatients.map((patient) => (
                  <tr key={patient.patientId}>
                    <td style={cellStyle}>{patient.displayId}</td>
                    <td style={cellStyle}>{patient.fullName}</td>
                    <td style={cellStyle}>
                      {getCategoryLabel(patient.patientCategory)}
                    </td>
                    <td style={cellStyle}>{patient.phone}</td>
                    <td style={cellStyle}>
                      {new Date(patient.dateOfBirth).toLocaleDateString()}
                    </td>
                    <td style={cellStyle}>
                      <button
                        onClick={() =>
                          navigate(`/patients/${patient.patientId}`)
                        }
                        style={{
                          border: "none",
                          background: "transparent",
                          color: "#173f35",
                          fontWeight: "bold",
                          cursor: "pointer",
                        }}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

const headerStyle: React.CSSProperties = {
  padding: "15px",
  textAlign: "left",
  fontSize: "14px",
  color: "#555",
  borderBottom: "1px solid #e5e5e5",
};

const cellStyle: React.CSSProperties = {
  padding: "15px",
  borderBottom: "1px solid #eee",
  fontSize: "14px",
};

export default Patients;
