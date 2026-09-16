// Configuration file for API Base URL
// When going live, configure VITE_API_URL in your production .env file.
export const API_BASE_URL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? "" : "http://127.0.0.1:5000");
