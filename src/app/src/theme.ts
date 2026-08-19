/**
 * Central theme definition. Swap these values to re-skin the site —
 * no colors should be hardcoded anywhere else in the app.
 */
export const theme = {
  colors: {
    background: "#eaf7ff",
    surface: "#ffffff",
    surfaceMuted: "#dcf0fa",
    ink: "#0a2a3d",
    inkMuted: "#4a6a78",
    accent: "#0a2a3d",
    accentMuted: "#2f5568",
    border: "#c9e4f0",
  },
  fonts: {
    display: "'Cormorant Garamond', serif",
    body: "'Inter', sans-serif",
  },
} as const;

export type Theme = typeof theme;
