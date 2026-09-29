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
        <div className="group relative overflow-hidden rounded-2xl border border-white/70 bg-white/65 p-5 shadow-[0_10px_35px_rgba(15,23,42,0.08)] backdrop-blur-2xl sm:p-6">
          <div className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-igcc-200/25 blur-3xl transition-all duration-300 group-hover:bg-igcc-200/40" />

          <div className="relative flex items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-igcc-900 text-white shadow-sm">
              <ClipboardList size={23} strokeWidth={1.8} />
            </div>

            <div>
              <h1 className="text-xl font-bold leading-tight tracking-tight text-slate-900 sm:text-2xl">
                Audit Logs
              </h1>

              <p className="mt-0.5 text-xs leading-5 text-slate-500 sm:text-sm">
                Review important activity recorded in the clinic
                management system.
              </p>
            </div>
          </div>
        </div>

        {/* Audit Logs Card */}
        <section className="group relative overflow-hidden rounded-2xl border border-white/70 bg-white/65 shadow-[0_10px_35px_rgba(15,23,42,0.08)] backdrop-blur-2xl">
          <div className="border-b border-white/70 bg-white/35 px-4 py-4 backdrop-blur-xl sm:px-6 sm:py-5">
            <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-sm font-semibold text-slate-900 sm:text-base">
                  Activity History
                </h2>
                <p className="mt-0.5 text-xs text-slate-500 sm:text-sm">
                  Review recorded activity across the clinic management system.
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
                className="w-full rounded-xl border border-slate-300 bg-white/90 py-3 pl-9 pr-3.5 text-sm text-slate-900 shadow-[0_1px_2px_rgba(15,23,42,0.04),0_3px_10px_rgba(15,23,42,0.06)] outline-none transition placeholder:text-slate-500 hover:border-slate-400 focus:border-igcc-700 focus:bg-white focus:ring-2 focus:ring-igcc-700/10 sm:py-2.5"
              />
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="m-5 flex items-start gap-3 rounded-xl border border-red-200/80 bg-red-50/75 px-4 py-3 text-sm text-red-700 shadow-sm backdrop-blur-sm sm:m-6">
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
            <div className="px-6 py-12 text-center text-sm text-slate-500">
              Loading audit logs...
            </div>
          ) : !error && filteredLogs.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full border border-white/80 bg-white/70 text-slate-400 shadow-sm backdrop-blur-sm">
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
            <div key={log.logId} className="rounded-2xl border border-slate-300/70 bg-white/75 p-4 shadow-[0_8px_25px_rgba(15,23,42,0.06)] backdrop-blur-xl sm:border-white/70 sm:bg-white/65">
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-igcc-700">
                  <ShieldCheck size={16} strokeWidth={1.8} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-slate-900">{log.user.fullName}</p>
                  <p className="mt-0.5 truncate text-[11px] text-slate-400">{log.user.displayId} &middot; {log.user.username}</p>
                </div>
              </div>
              <div className="mt-3 border-t border-slate-300/60 pt-3 sm:border-white/70">
                <p className="text-sm font-semibold text-slate-800">{log.action}</p>
                <p className="mt-1 text-xs font-medium text-slate-500">{formatDateTime(log.timestamp)}</p>
              </div>
              {log.description && <p className="mt-2 break-words text-xs leading-6 text-slate-500">{log.description}</p>}
            </div>
          ))}
        </div>
        <div className="hidden overflow-x-auto sm:block">
              <table className="w-full min-w-[1180px]">
                <thead>
                  <tr className="border-b border-white/70 bg-slate-50/80">
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
                      className="border-b border-white/60 transition hover:bg-white/45"
                    >
                      <td className="whitespace-nowrap px-5 py-4 text-sm text-slate-600">
                        {formatDateTime(log.timestamp)}
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex items-start gap-2.5">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/80 bg-white/70 text-igcc-700 shadow-sm backdrop-blur-sm">
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
                              {log.user.displayId} &middot;{" "}
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

                      <td className="min-w-[420px] px-5 py-4 text-sm leading-6 text-slate-500 whitespace-normal break-words">
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

