/**
 * Fallback values used before the site config loads from the API,
 * and shared config that isn't brand copy (API base URL).
 * No component should hardcode the site name directly — read it
 * from useSiteConfig() (see lib/api.ts), which falls back to this.
 */
export const SITE_NAME = "Rime Co";

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000/api";
