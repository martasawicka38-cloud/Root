export const colors = {
  deepForest: "#1B4332",
  mossGreen: "#2D6A4F",
  sage: "#95D5B2",
  mist: "#D8F3DC",
  warmGold: "#D4A373",
  sunset: "#E07A5F",
  slate900: "#1E293B",
  slate700: "#334155",
  slate600: "#64748B",
  slate500: "#7A8AA0",
  slate400: "#94A3B8",
  slate300: "#CBD5E1",
  slate200: "#E2E8F0",
  slate100: "#F1F5F9",
  white: "#FFFFFF",
  success: "#40916C",
  warning: "#E9C46A",
  error: "#D62828",
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
