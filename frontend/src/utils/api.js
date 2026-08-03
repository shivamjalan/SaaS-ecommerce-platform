export const API_URL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.DEV
    ? "/api"
    : "http://localhost:5000/api");

export const apiErrorMessage = () =>
  "Can't reach the server. Make sure the backend is running on port 5000.";