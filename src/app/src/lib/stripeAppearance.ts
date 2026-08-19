import type { Appearance } from "@stripe/stripe-js";
import { theme } from "../theme";

/** Derives the Stripe Elements appearance from theme.ts so payment UI matches the brand — no hardcoded colors here either. */
export function buildStripeAppearance(): Appearance {
  return {
    theme: "stripe",
    variables: {
      colorPrimary: theme.colors.accent,
      colorBackground: theme.colors.surface,
      colorText: theme.colors.ink,
      colorTextSecondary: theme.colors.inkMuted,
      colorDanger: "#b3413b",
      fontFamily: "Inter, sans-serif",
      borderRadius: "2px",
      spacingUnit: "4px",
    },
    rules: {
      ".Input": {
        border: `1px solid ${theme.colors.border}`,
        boxShadow: "none",
        fontSize: "16px",
      },
      ".Input:focus": {
        border: `1px solid ${theme.colors.accent}`,
        boxShadow: "none",
      },
      ".Label": {
        fontSize: "13px",
        textTransform: "uppercase",
        letterSpacing: "0.06em",
        color: theme.colors.inkMuted,
      },
      ".Tab": {
        border: `1px solid ${theme.colors.border}`,
        boxShadow: "none",
      },
      ".Tab--selected": {
        border: `1px solid ${theme.colors.accent}`,
        boxShadow: "none",
      },
    },
  };
}
