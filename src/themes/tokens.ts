export const tokens = {
  colors: {
    primary: "hsl(244 76% 65%)",
    primaryHover: "hsl(244 76% 58%)",
    accent: "hsl(196 100% 50%)",
    background: "hsl(222 47% 6%)",
    surface: "hsl(222 44% 9%)",
    surface2: "hsl(222 40% 12%)",
    foreground: "hsl(210 40% 98%)",
    foregroundMuted: "hsl(215 20% 65%)",
    success: "hsl(142 71% 45%)",
    danger: "hsl(0 84% 60%)",
  },
  fontFamily: {
    sans: "Inter, system-ui, sans-serif",
    display: "Outfit, system-ui, sans-serif",
  },
  radius: {
    sm: "0.5rem",
    md: "0.75rem",
    lg: "1rem",
    xl: "1.5rem",
  },
  animation: {
    fast: "150ms ease",
    base: "250ms ease",
    slow: "350ms ease",
  },
} as const;
