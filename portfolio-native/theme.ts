// Color tokens ported from portfolio-react/src/styles/variables.css.
// React Native has no CSS custom properties, so each mode is a plain object
// that StyleSheet definitions import directly (e.g. `theme.dark.accent`).

export interface ColorTokens {
  dark: string;
  darkSecondary: string;
  bgCard: string;
  bgCardHover: string;

  accent: string;
  accentLight: string;
  accentPurple: string;
  accentGlow: string;

  text: string;
  textMuted: string;
  textFaint: string;

  border: string;
  borderHover: string;

  success: string;
  error: string;
  warning: string;
}

export const darkTheme: ColorTokens = {
  dark: '#060d1a',
  darkSecondary: '#0d1829',
  bgCard: '#0f1f33',
  bgCardHover: '#132540',

  accent: '#3b82f6',
  accentLight: '#60a5fa',
  accentPurple: '#8b5cf6',
  accentGlow: 'rgba(59, 130, 246, 0.18)',

  text: '#f1f5f9',
  textMuted: '#94a3b8',
  textFaint: '#64748b',

  border: 'rgba(59, 130, 246, 0.14)',
  borderHover: 'rgba(59, 130, 246, 0.36)',

  success: '#22c55e',
  error: '#ef4444',
  warning: '#f59e0b',
};

export const lightTheme: ColorTokens = {
  dark: '#f8fafc',
  darkSecondary: '#f1f5f9',
  bgCard: '#ffffff',
  bgCardHover: '#f8fafc',

  accent: '#3b82f6',
  accentLight: '#60a5fa',
  accentPurple: '#8b5cf6',
  accentGlow: 'rgba(59, 130, 246, 0.1)',

  text: '#0f172a',
  textMuted: '#475569',
  textFaint: '#94a3b8',

  border: 'rgba(59, 130, 246, 0.22)',
  borderHover: 'rgba(59, 130, 246, 0.5)',

  success: '#22c55e',
  error: '#ef4444',
  warning: '#f59e0b',
};

// Vanilla and portfolio-react both default to dark mode.
export const theme = darkTheme;
