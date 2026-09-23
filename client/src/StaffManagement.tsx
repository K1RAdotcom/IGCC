import { apiUrl } from "./api";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle2,
  Search,
  ShieldCheck,
  UserPlus,
  Users,
} from "lucide-react";

import AppShell from "./components/layout/AppShell";

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
        apiUrl("/api/users"),
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
        apiUrl(`/api/users/${user.userId}/status`),
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
    <AppShell
      userRole="ADMIN"
      userName="Administrator"
    >
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
      <div className="space-y-4 sm:space-y-6">
        {/* Back Navigation */}
        <button
          type="button"
          onClick={() => navigate("/dashboard")}
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-igcc-700"
        >
          <ArrowLeft size={17} />
          Back to Dashboard
        </button>

        {/* Page Header */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-igcc-900 text-white shadow-sm">
              <Users size={23} strokeWidth={1.8} />
            </div>

            <div>
              <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
                Staff Management
              </h1>

              <p className="mt-0.5 text-xs leading-5 text-slate-500 sm:text-sm">
                Manage clinic staff and administrator accounts.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => navigate("/admin/staff/add")}
            className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-igcc-900 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-igcc-800 sm:w-auto sm:py-2.5"
          >
            <UserPlus size={17} strokeWidth={1.8} />
            Add Staff Account
          </button>
        </div>

        {/* Staff Card */}
        <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          {/* Search */}
          <div className="border-b border-slate-200 px-4 py-4 sm:px-6 sm:py-5">
            <div className="relative max-w-xl">
              <Search
                size={17}
                strokeWidth={1.8}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                placeholder="Search staff by name or ID"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white py-3 pl-9 pr-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-igcc-800 focus:ring-2 focus:ring-igcc-800/10 sm:py-2.5"
              />
            </div>

            {!loading && !error && (
              <div className="mt-3 flex items-center gap-2 text-xs text-slate-400">
                <Users size={14} />
                <span>
                  {filteredUsers.length}{" "}
                  {filteredUsers.length === 1 ? "staff account" : "staff accounts"}
                </span>
              </div>
            )}
          </div>

          {/* Loading */}
          {loading && (
            <div className="px-6 py-10 text-center text-sm text-slate-500">
              Loading staff accounts...
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="m-5 flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 sm:m-6">
              <ShieldCheck
                size={17}
                strokeWidth={1.8}
                className="mt-0.5 shrink-0"
              />
              <p>{error}</p>
            </div>
          )}

          {/* Mobile Staff Cards */}
          <div className="space-y-3 p-4 sm:hidden">
            {filteredUsers.map((user) => (
              <div
                key={user.userId}
                className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-slate-900">
                      {user.fullName}
                    </p>

                    <p className="mt-0.5 font-mono text-[11px] font-semibold text-igcc-700">
                      {user.displayId}
                    </p>
                  </div>

                  <span
                    className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                      user.status === "ACTIVE"
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-red-50 text-red-700"
                    }`}
                  >
                    {user.status === "ACTIVE" ? "Active" : "Inactive"}
                  </span>
                </div>

                <div className="mt-3 grid grid-cols-2 gap-3 border-t border-slate-100 pt-3">
                  <div>
                    <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
                      Username
                    </p>
                    <p className="mt-0.5 truncate text-sm font-medium text-slate-800">
                      {user.username}
                    </p>
                  </div>

                  <div>
                    <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
                      Role
                    </p>
                    <p className="mt-0.5 text-sm font-medium text-slate-800">
                      {formatRole(user.role)}
                    </p>
                  </div>

                  <div>
                    <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
                      Created
                    </p>
                    <p className="mt-0.5 text-sm font-medium text-slate-800">
                      {formatDate(user.createdAt)}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleStatusChange(user)}
                  className="mt-4 inline-flex min-h-11 w-full items-center justify-center rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 hover:text-slate-900"
                >
                  Manage Account
                </button>
              </div>
            ))}

            {filteredUsers.length === 0 && (
              <div className="px-4 py-10 text-center text-sm text-slate-500">
                No staff accounts found.
              </div>
            )}
          </div>
          {/* Table */}
          {!loading && !error && (
            <div className="hidden overflow-x-auto sm:block">
              <table className="w-full min-w-[900px]">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/70">
                    <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Staff ID
                    </th>

                    <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Full Name
                    </th>

                    <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Username
                    </th>

                    <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Role
                    </th>

                    <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Status
                    </th>

                    <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Created
                    </th>

                    <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredUsers.map((user) => (
                    <tr
                      key={user.userId}
                      className="border-b border-slate-100 transition hover:bg-slate-50/70"
                    >
                      <td className="px-5 py-4 text-sm font-semibold text-slate-900">
                        {user.displayId}
                      </td>

                      <td className="px-5 py-4 text-sm font-medium text-slate-800">
                        {user.fullName}
                      </td>

                      <td className="px-5 py-4 text-sm text-slate-600">
                        {user.username}
                      </td>

                      <td className="px-5 py-4 text-sm text-slate-600">
                        {formatRole(user.role)}
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
                            user.status === "ACTIVE"
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-red-50 text-red-700"
                          }`}
                        >
                          <CheckCircle2
                            size={13}
                            strokeWidth={2}
                          />
                          {user.status === "ACTIVE"
                            ? "Active"
                            : "Inactive"}
                        </span>
                      </td>

                      <td className="px-5 py-4 text-sm text-slate-500">
                        {formatDate(user.createdAt)}
                      </td>

                      <td className="px-5 py-4">
                        <button
                          type="button"
                          onClick={() => handleStatusChange(user)}
                          className="inline-flex items-center rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 hover:text-slate-900"
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
                        className="px-6 py-12 text-center text-sm text-slate-500"
                      >
                        No staff accounts found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
      </div>
    </AppShell>
  );
}
