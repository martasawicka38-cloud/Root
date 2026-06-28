export const colors = {
  // ── Eco Palette (9 kolorów) ──────────────────────────
  cream: "#FAFAF2",
  creamLight: "#FCFDF4",
  creamMedium: "#F3F6CA",
  creamDark: "#E5E8BF",
  greenLight: "#D8EF95",
  greenBright: "#C5E368",
  greenDark: "#4A5E0F",
  olive: "#535A3E",
  brownDark: "#293211",

  // ── Semantic (tylko z palety) ─────────────────────────
  primary: "#4A5E0F",
  primaryForeground: "#FCFDF4",
  secondary: "#E5E8BF",
  secondaryForeground: "#293211",
  accent: "#C5E368",
  accentForeground: "#293211",

  surface: "#FCFDF4",
  surfaceForeground: "#293211",
  background: "#FAFAF2",
  backgroundForeground: "#293211",
  muted: "#535A3E",
  mutedForeground: "#FCFDF4",

  success: "#4A5E0F",
  successForeground: "#FCFDF4",
  successBg: "#D8EF95",
  successBorder: "#C5E368",

  warning: "#535A3E",
  warningForeground: "#FCFDF4",
  warningBg: "#E5E8BF",
  warningBorder: "#C5E368",

  error: "#293211",
  errorForeground: "#FCFDF4",
  errorBg: "#F3F6CA",
  errorBorder: "#E5E8BF",

  info: "#4A5E0F",
  infoForeground: "#FCFDF4",
  infoBg: "#D8EF95",

  roleUser: "#4A5E0F",
  roleUserBg: "#D8EF95",
  roleCompany: "#535A3E",
  roleCompanyBg: "#E5E8BF",
  roleSuperadmin: "#293211",
  roleSuperadminBg: "#F3F6CA",

  inputBg: "#FCFDF4",
  inputBorder: "#E5E8BF",
  inputPlaceholder: "#535A3E",

  // ── Legacy ───────────────────────────────────────────
  deepForest: "#293211",
  mossGreen: "#4A5E0F",
  sage: "#D8EF95",
  mist: "#F3F6CA",
  warmGold: "#C5E368",
  sunset: "#8B4513",
  accentBlue: "#0ea5e9",
  slate900: "#293211",
  slate700: "#535A3E",
  slate600: "#535A3E",
  slate500: "#535A3E",
  slate400: "#535A3E",
  slate300: "#E5E8BF",
  slate200: "#E5E8BF",
  slate100: "#F3F6CA",
  white: "#FCFDF4",
};

export const spacing = {
  x4s: 4,
  x3s: 8,
  x2s: 12,
  xs: 16,
  sm: 20,
  md: 24,
  lg: 32,
  xl: 40,
  x2l: 48,
  x3l: 64,
};

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
};

export const typography = {
  h1: { fontSize: 28, fontWeight: "700" as const },
  h2: { fontSize: 20, fontWeight: "600" as const },
  h3: { fontSize: 16, fontWeight: "600" as const },
  body: { fontSize: 15, fontWeight: "400" as const, lineHeight: 22 },
  bodySmall: { fontSize: 13, fontWeight: "400" as const, lineHeight: 20 },
  caption: { fontSize: 11, fontWeight: "600" as const },
  points: { fontSize: 34, fontWeight: "800" as const },
  steps: { fontSize: 24, fontWeight: "700" as const },
};

export const shadows = {
  sm: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 2,
  },
  lg: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 24,
    elevation: 4,
  },
  xl: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.1,
    shadowRadius: 40,
    elevation: 6,
  },
};
