import { theme } from "../theme";

/** Publishes theme.ts values as CSS custom properties so no component/CSS file hardcodes colors. */
export function applyTheme() {
  const root = document.documentElement.style;
  root.setProperty("--color-background", theme.colors.background);
  root.setProperty("--color-surface", theme.colors.surface);
  root.setProperty("--color-surface-muted", theme.colors.surfaceMuted);
  root.setProperty("--color-ink", theme.colors.ink);
  root.setProperty("--color-ink-muted", theme.colors.inkMuted);
  root.setProperty("--color-accent", theme.colors.accent);
  root.setProperty("--color-accent-muted", theme.colors.accentMuted);
  root.setProperty("--color-border", theme.colors.border);
  root.setProperty("--font-display", theme.fonts.display);
  root.setProperty("--font-body", theme.fonts.body);
}
