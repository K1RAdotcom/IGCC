/*
 * API base URL.
 * - VITE_API_URL set: use it (frontend and backend on different hosts).
 * - Not set, production build: same origin (frontend and API served together).
 * - Not set, local dev: the local backend.
 */
const configuredApiUrl = import.meta.env.VITE_API_URL?.trim();

export const API_BASE_URL = (
  configuredApiUrl ?? (import.meta.env.DEV ? "http://localhost:4000" : "")
).replace(/\/+$/, "");

export function apiUrl(path: string) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${API_BASE_URL}${normalizedPath}`;
}
