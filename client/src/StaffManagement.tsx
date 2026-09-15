import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

type User = {
  userId: string;
  displayId: string;
  fullName: string;
  username: string;
  email: string | null;
  role: "ADMIN" | "CLINIC_STAFF";
  status: "ACTIVE" | "INACTIVE";
  createdAt: string;
};

export default function StaffManagement() {
  const navigate = useNavigate();

  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadUsers() {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        "http://localhost:4000/api/users",
        {
          credentials: "include",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Could not load staff accounts.");
      }

      setUsers(data.users || []);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Could not load staff accounts."
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleStatusChange(user: User) {
    const nextStatus =
      user.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";

    const action =
      nextStatus === "ACTIVE" ? "activate" : "deactivate";

    const confirmed = window.confirm(
      `Are you sure you want to ${action} ${user.fullName}?`
    );

    if (!confirmed) {
      return;
    }

    setError("");
    setLoading(true);

    try {
      const response = await fetch(
        `http://localhost:4000/api/users/${user.userId}/status`,
        {
          method: "PATCH",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status: nextStatus,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Could not update the user account."
        );
      }

      await loadUsers();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Could not update the user account."
      );
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    loadUsers();
  }, []);

  const filteredUsers = users.filter((user) => {
    const searchText = search.toLowerCase().trim();

    if (!searchText) {
      return true;
    }

    return (
      user.displayId.toLowerCase().includes(searchText) ||
      user.fullName.toLowerCase().includes(searchText) ||
      user.username.toLowerCase().includes(searchText) ||
      user.role.toLowerCase().includes(searchText) ||
      user.status.toLowerCase().includes(searchText)
    );
  });

  function formatRole(role: User["role"]) {
    return role === "ADMIN" ? "Administrator" : "Clinic Staff";
  }

  function formatDate(date: string) {
    return new Date(date).toLocaleDateString();
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
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "24px",
            gap: "16px",
            flexWrap: "wrap",
          }}
        >
          <div>
            <button
              onClick={() => navigate("/dashboard")}
              style={{
                border: "none",
                background: "transparent",
                padding: 0,
                marginBottom: "10px",
                cursor: "pointer",
                color: "#166534",
                fontWeight: 600,
              }}
            >
              &#8592; Back to Dashboard
            </button>

            <h1
              style={{
                margin: 0,
                fontSize: "28px",
                color: "#111827",
              }}
            >
              Staff Management
            </h1>

            <p
              style={{
                margin: "6px 0 0",
                color: "#6b7280",
                fontSize: "14px",
              }}
            >
              Manage clinic staff and administrator accounts.
            </p>
          </div>

          <button
            onClick={() => navigate("/admin/staff/add")}
            style={{
              padding: "12px 18px",
              border: "none",
              borderRadius: "8px",
              background: "#166534",
              color: "#ffffff",
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            + Add Staff Account
          </button>
        </div>

        <div
          style={{
            background: "#ffffff",
            borderRadius: "12px",
            padding: "24px",
            boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
          }}
        >
          <input
            type="text"
            placeholder="Search by Staff ID, name, username, role, or status..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
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

          {loading && (
            <p style={{ color: "#6b7280" }}>
              Loading staff accounts...
            </p>
          )}

          {error && (
            <div
              style={{
                padding: "12px",
                borderRadius: "8px",
                background: "#fee2e2",
                color: "#991b1b",
                marginBottom: "20px",
              }}
            >
              {error}
            </div>
          )}

          {!loading && !error && (
            <div style={{ overflowX: "auto" }}>
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  minWidth: "800px",
                }}
              >
                <thead>
                  <tr>
                    {[
                      "Staff ID",
                      "Full Name",
                      "Username",
                      "Role",
                      "Status",
                      "Created",
                      "Action",
                    ].map((heading) => (
                      <th
                        key={heading}
                        style={{
                          textAlign: "left",
                          padding: "12px",
                          borderBottom: "2px solid #e5e7eb",
                          color: "#374151",
                          fontSize: "13px",
                        }}
                      >
                        {heading}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user.userId}>
                      <td
                        style={{
                          padding: "14px 12px",
                          borderBottom: "1px solid #e5e7eb",
                          fontWeight: 600,
                        }}
                      >
                        {user.displayId}
                      </td>

                      <td
                        style={{
                          padding: "14px 12px",
                          borderBottom: "1px solid #e5e7eb",
                        }}
                      >
                        {user.fullName}
                      </td>

                      <td
                        style={{
                          padding: "14px 12px",
                          borderBottom: "1px solid #e5e7eb",
                        }}
                      >
                        {user.username}
                      </td>

                      <td
                        style={{
                          padding: "14px 12px",
                          borderBottom: "1px solid #e5e7eb",
                        }}
                      >
                        {formatRole(user.role)}
                      </td>

                      <td
                        style={{
                          padding: "14px 12px",
                          borderBottom: "1px solid #e5e7eb",
                        }}
                      >
                        <span
                          style={{
                            display: "inline-block",
                            padding: "5px 9px",
                            borderRadius: "999px",
                            background:
                              user.status === "ACTIVE"
                                ? "#dcfce7"
                                : "#fee2e2",
                            color:
                              user.status === "ACTIVE"
                                ? "#166534"
                                : "#991b1b",
                            fontSize: "12px",
                            fontWeight: 600,
                          }}
                        >
                          {user.status === "ACTIVE"
                            ? "Active"
                            : "Inactive"}
                        </span>
                      </td>

                      <td
                        style={{
                          padding: "14px 12px",
                          borderBottom: "1px solid #e5e7eb",
                        }}
                      >
                        {formatDate(user.createdAt)}
                      </td>

                      <td
                        style={{
                          padding: "14px 12px",
                          borderBottom: "1px solid #e5e7eb",
                        }}
                      >
                        <button
                          onClick={() => handleStatusChange(user)}
                          style={{
                            padding: "7px 12px",
                            border: "1px solid #d1d5db",
                            borderRadius: "6px",
                            background: "#ffffff",
                            cursor: "pointer",
                            fontWeight: 600,
                          }}
                        >
                          Manage
                        </button>
                      </td>
                    </tr>
                  ))}

                  {filteredUsers.length === 0 && (
                    <tr>
                      <td
                        colSpan={7}
                        style={{
                          padding: "30px",
                          textAlign: "center",
                          color: "#6b7280",
                        }}
                      >
                        No staff accounts found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
