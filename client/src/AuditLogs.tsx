import { apiUrl } from "./api";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AlertCircle,
  ArrowLeft,
  ClipboardList,
  Search,
  ShieldCheck,
} from "lucide-react";

import AppShell from "./components/layout/AppShell";

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
        apiUrl("/api/audit-logs"),
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
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-igcc-900 text-white shadow-sm">
            <ClipboardList size={23} strokeWidth={1.8} />
          </div>

          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
              Audit Logs
            </h1>

            <p className="mt-0.5 text-xs leading-5 text-slate-500 sm:text-sm">
              Review important activity recorded in the clinic
              management system.
            </p>
          </div>
        </div>

        {/* Audit Logs Card */}
        <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          {/* Search Header */}
          <div className="border-b border-slate-200 px-5 py-5 sm:px-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-base font-semibold text-slate-900">
                  Activity History
                </h2>

                <p className="mt-0.5 text-xs text-slate-500">
                  Search recorded activity by user, action, record,
                  or description.
                </p>
              </div>

              {!loading && !error && (
                <span className="text-xs font-medium text-slate-400">
                  {filteredLogs.length}{" "}
                  {filteredLogs.length === 1
                    ? "record"
                    : "records"}
                </span>
              )}
            </div>

            <div className="relative mt-4 max-w-2xl">
              <Search
                size={17}
                strokeWidth={1.8}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Search activity..."
                className="w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-9 pr-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-igcc-800 focus:ring-2 focus:ring-igcc-800/10"
              />
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="m-5 flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 sm:m-6">
              <AlertCircle
                size={17}
                strokeWidth={1.8}
                className="mt-0.5 shrink-0"
              />

              <p>{error}</p>
            </div>
          )}

          {/* Loading */}
          {loading ? (
            <div className="px-6 py-10 text-center text-sm text-slate-500">
              Loading audit logs...
            </div>
          ) : !error && filteredLogs.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                <ClipboardList size={20} strokeWidth={1.8} />
              </div>

              <p className="mt-3 text-sm font-medium text-slate-700">
                No audit logs found.
              </p>

              <p className="mt-1 text-xs text-slate-400">
                Try adjusting your search.
              </p>
            </div>
          ) : !error ? (
            <>
              <div className="space-y-3 p-4 sm:hidden">
          {filteredLogs.map((log) => (
            <div key={log.logId} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
                  <ShieldCheck size={16} strokeWidth={1.8} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-slate-900">{log.user.fullName}</p>
                  <p className="mt-0.5 truncate text-[11px] text-slate-400">{log.user.displayId} &middot; {log.user.username}</p>
                </div>
              </div>
              <div className="mt-3 border-t border-slate-100 pt-3">
                <p className="text-sm font-semibold text-slate-800">{log.action}</p>
                <p className="mt-1 text-xs font-medium text-slate-500">{formatDateTime(log.timestamp)}</p>
              </div>
              {log.entityType && <p className="mt-2 text-xs text-slate-500">{log.entityType}{log.entityId ? ` &middot; ${log.entityId}` : ""}</p>}
              {log.description && <p className="mt-2 break-words text-xs leading-5 text-slate-500">{log.description}</p>}
            </div>
          ))}
        </div>
        <div className="hidden overflow-x-auto sm:block">
              <table className="w-full min-w-[1180px]">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/70">
                    <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Date &amp; Time
                    </th>

                    <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      User
                    </th>

                    <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Action
                    </th>

                    <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Record
                    </th>

                    <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Description
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredLogs.map((log) => (
                    <tr
                      key={log.logId}
                      className="border-b border-slate-100 transition hover:bg-slate-50/70"
                    >
                      <td className="whitespace-nowrap px-5 py-4 text-sm text-slate-600">
                        {formatDateTime(log.timestamp)}
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex items-start gap-2.5">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
                            <ShieldCheck
                              size={15}
                              strokeWidth={1.8}
                            />
                          </div>

                          <div>
                            <div className="text-sm font-semibold text-slate-900">
                              {log.user.fullName}
                            </div>

                            <div className="mt-0.5 text-xs text-slate-400">
                              {log.user.displayId} \u00B7{" "}
                              {log.user.username}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <span className="inline-flex rounded-md bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
                          {log.action}
                        </span>
                      </td>

                      <td className="px-5 py-4 text-sm text-slate-600">
                        <div>
                          {log.entityType || "-"}
                        </div>

                        {log.entityId && (
                          <div className="mt-0.5 text-xs text-slate-400">
                            {log.entityId}
                          </div>
                        )}
                      </td>

                      <td className="min-w-[420px] px-5 py-4 text-sm leading-6 text-slate-600 whitespace-normal break-words">
                        {log.description || "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            </>
          ) : null}
        </section>
      </div>
      </div>
    </AppShell>
  );
}

