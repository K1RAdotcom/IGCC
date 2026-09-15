import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

type AuditLog = {
  logId: string;
  action: string;
  entityType: string | null;
  entityId: string | null;
  description: string | null;
  timestamp: string;
  user: {
    displayId: string;
    fullName: string;
    username: string;
  };
};

export default function AuditLogs() {
  const navigate = useNavigate();

  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadLogs() {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        "http://localhost:4000/api/audit-logs",
        {
          credentials: "include",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Could not load audit logs."
        );
      }

      setLogs(data.logs || []);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Could not load audit logs."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadLogs();
  }, []);

  const filteredLogs = logs.filter((log) => {
    const searchText = search.toLowerCase().trim();

    if (!searchText) {
      return true;
    }

    return (
      log.action.toLowerCase().includes(searchText) ||
      log.user.fullName.toLowerCase().includes(searchText) ||
      log.user.username.toLowerCase().includes(searchText) ||
      log.user.displayId.toLowerCase().includes(searchText) ||
      (log.entityType || "").toLowerCase().includes(searchText) ||
      (log.entityId || "").toLowerCase().includes(searchText) ||
      (log.description || "").toLowerCase().includes(searchText)
    );
  });

  function formatDateTime(date: string) {
    return new Date(date).toLocaleString();
  }

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
          maxWidth: "1400px",
          margin: "0 auto",
        }}
      >
        <button
          type="button"
          onClick={() => navigate("/dashboard")}
          style={{
            padding: "11px 16px",
            border: "none",
            borderRadius: "8px",
            background: "#e5e7eb",
            color: "#374151",
            cursor: "pointer",
            fontWeight: 600,
            marginBottom: "20px",
          }}
        >
          â† Back to Dashboard
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
            Audit Logs
          </h1>

          <p
            style={{
              margin: "0 0 24px",
              color: "#6b7280",
              fontSize: "14px",
            }}
          >
            Review important activity recorded in the clinic management system.
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

          <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by user, action, record, or description..."
            style={{
              width: "100%",
              padding: "12px",
              border: "1px solid #d1d5db",
              borderRadius: "8px",
              fontSize: "14px",
              boxSizing: "border-box",
              marginBottom: "20px",
            }}
          />

          {loading ? (
            <p style={{ color: "#6b7280" }}>
              Loading audit logs...
            </p>
          ) : filteredLogs.length === 0 ? (
            <p style={{ color: "#6b7280" }}>
              No audit logs found.
            </p>
          ) : (
            <div
              style={{
                overflowX: "auto",
              }}
            >
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  fontSize: "14px",
                }}
              >
                <thead>
                  <tr
                    style={{
                      background: "#f3f4f6",
                      textAlign: "left",
                    }}
                  >
                    <th style={{ padding: "12px" }}>
                      Date & Time
                    </th>
                    <th style={{ padding: "12px" }}>
                      User
                    </th>
                    <th style={{ padding: "12px" }}>
                      Action
                    </th>
                    <th style={{ padding: "12px" }}>
                      Record
                    </th>
                    <th style={{ padding: "12px" }}>
                      Description
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredLogs.map((log) => (
                    <tr
                      key={log.logId}
                      style={{
                        borderBottom: "1px solid #e5e7eb",
                      }}
                    >
                      <td style={{ padding: "12px", whiteSpace: "nowrap" }}>
                        {formatDateTime(log.timestamp)}
                      </td>

                      <td style={{ padding: "12px" }}>
                        <div style={{ fontWeight: 600 }}>
                          {log.user.fullName}
                        </div>
                        <div
                          style={{
                            fontSize: "12px",
                            color: "#6b7280",
                          }}
                        >
                          {log.user.displayId} Â· {log.user.username}
                        </div>
                      </td>

                      <td
                        style={{
                          padding: "12px",
                          fontWeight: 600,
                        }}
                      >
                        {log.action}
                      </td>

                      <td style={{ padding: "12px" }}>
                        {log.entityType || "-"}
                        {log.entityId ? ` Â· ${log.entityId}` : ""}
                      </td>

                      <td style={{ padding: "12px" }}>
                        {log.description || "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
