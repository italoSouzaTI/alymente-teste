export type ColorPalette = {
  // Primary
  primary: string;
  primaryAction: string;
  onPrimary: string;
  primaryContainer: string;
  // Surfaces
  background: string;
  surface: string;
  surfaceLow: string;
  surfaceContainer: string;
  surfaceContainerHigh: string;
  surfaceWhite: string;
  // On-surface text
  onSurface: string;
  onSurfaceVariant: string;
  // Borders
  outline: string;
  outlineVariant: string;
  // Success
  success: string;
  successAction: string;
  onSuccess: string;
  successContainer: string;
  // Error
  error: string;
  onError: string;
  errorContainer: string;
  // Warning
  warning: string;
  warningContainer: string;
};

export const lightColors: ColorPalette = {
  primary: '#0051ae',
  primaryAction: '#0969da',
  onPrimary: '#ffffff',
  primaryContainer: '#d8e2ff',

  background: '#f8f9fb',
  surface: '#f8f9fb',
  surfaceLow: '#f2f4f6',
  surfaceContainer: '#eceef0',
  surfaceContainerHigh: '#e6e8ea',
  surfaceWhite: '#ffffff',

  onSurface: '#191c1e',
  onSurfaceVariant: '#424753',

  outline: '#727785',
  outlineVariant: '#c2c6d6',

  success: '#006326',
  successAction: '#0d7e34',
  onSuccess: '#ffffff',
  successContainer: '#c3ffc4',

  error: '#ba1a1a',
  onError: '#ffffff',
  errorContainer: '#ffdad6',

  warning: '#9A6700',
  warningContainer: '#fef3c7',
};

export const darkColors: ColorPalette = {
  primary: '#4493f8',
  primaryAction: '#4493f8',
  onPrimary: '#0d1117',
  primaryContainer: '#003166',

  background: '#0d1117',
  surface: '#161b22',
  surfaceLow: '#1c2128',
  surfaceContainer: '#21262d',
  surfaceContainerHigh: '#30363d',
  surfaceWhite: '#161b22',

  onSurface: '#e6edf3',
  onSurfaceVariant: '#8b949e',

  outline: '#6e7681',
  outlineVariant: '#30363d',

  success: '#3fb950',
  successAction: '#238636',
  onSuccess: '#0d1117',
  successContainer: '#1a7f37',

  error: '#f85149',
  onError: '#0d1117',
  errorContainer: '#8e1519',

  warning: '#d29922',
  warningContainer: '#4d2d00',
};

// Alias para uso em componentes que ainda não são theme-aware
export const colors = lightColors;

export const typography = {
  headlineLg: { fontSize: 24, fontWeight: '600' as const, lineHeight: 32, letterSpacing: -0.48 },
  headlineMd: { fontSize: 20, fontWeight: '600' as const, lineHeight: 28, letterSpacing: -0.2 },
  headlineSm: { fontSize: 16, fontWeight: '600' as const, lineHeight: 24 },
  bodyLg: { fontSize: 16, fontWeight: '400' as const, lineHeight: 24 },
  bodyMd: { fontSize: 14, fontWeight: '400' as const, lineHeight: 20 },
  bodySm: { fontSize: 13, fontWeight: '400' as const, lineHeight: 18 },
  labelMd: { fontSize: 12, fontWeight: '500' as const, lineHeight: 16, letterSpacing: 0.24 },
  labelSm: { fontSize: 11, fontWeight: '500' as const, lineHeight: 14, letterSpacing: 0.33 },
  monoSm: { fontSize: 12, fontWeight: '400' as const, lineHeight: 18 },
} as const;

export const spacing = {
  gutterSm: 4,
  gutterMd: 8,
  inlineGap: 8,
  stackGap: 12,
  containerMargin: 16,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
} as const;

export const radii = {
  sm: 2,
  DEFAULT: 4,
  md: 6,
  lg: 8,
  xl: 12,
  full: 9999,
} as const;

/** Cores oficiais GitHub Linguist — iguais em light/dark */
export const languageColors = {
  TypeScript: '#3178c6',
  JavaScript: '#f1e05a',
  Python: '#3572A5',
  Go: '#00ADD8',
  Rust: '#dea584',
  Java: '#b07219',
  'C++': '#f34b7d',
  C: '#555555',
  Swift: '#F05138',
  Kotlin: '#A97BFF',
  Ruby: '#701516',
  PHP: '#4F5D95',
  Shell: '#89e051',
  Dart: '#00B4AB',
} as const;

export type LanguageColorKey = keyof typeof languageColors;

export function getLanguageColor(language: string, fallback: string): string {
  return language in languageColors ? languageColors[language as LanguageColorKey] : fallback;
}
