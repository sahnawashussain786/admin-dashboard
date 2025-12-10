import axios from "axios";

// Set config defaults when creating the instance
const isProduction = import.meta.env.MODE === "production";

// In production, we expect the VITE_API_BASE_URL to be set in Vercel
// Fallback to localhost for development if not set
const baseURL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

axios.defaults.baseURL = baseURL;
axios.defaults.timeout = 10000; // 10 second timeout
axios.defaults.withCredentials = false; // CORS handling normally doesn't need this for token based auth unless cookies are used

export default axios;
