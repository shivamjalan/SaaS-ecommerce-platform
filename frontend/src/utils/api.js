const base = (
  import.meta.env.VITE_API_URL ||
  (import.meta.env.DEV ? "/api" : "http://localhost:5000/api")
).replace(/\/+$/, "");

export const API_URL = base.endsWith("/api") ? base : `${base}/api`;

export const apiErrorMessage = () =>
  "Can't reach the server. Make sure the backend is running on port 5000.";

export const getUserInfo = () => {
  try {
    const raw = localStorage.getItem("userInfo");
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : null;
  } catch {
    return null;
  }
};