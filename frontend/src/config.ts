// frontend/src/config.ts

// API_BASE_URL is where the frontend should send requests.
// In dev (npm run dev), we fall back to localhost:4000.
// In production (Netlify), we inject VITE_API_BASE_URL (your Railway URL).
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";
