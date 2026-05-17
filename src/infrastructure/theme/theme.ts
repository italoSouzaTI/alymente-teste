import { createTheme } from '@shopify/restyle';

const palette = {
  // Brand
  blue500: '#0969DA',
  blue400: '#4493F8',

  // Neutrals light
  white: '#FFFFFF',
  gray50: '#F6F8FA',
  gray200: '#D0D7DE',
  gray500: '#656D76',
  gray900: '#1F2328',

  // Neutrals dark
  black: '#0D1117',
  darkSurface: '#161B22',
  darkBorder: '#30363D',
  darkMuted: '#848D97',
  darkText: '#E6EDF3',

  // Semantic
  green500: '#1A7F37',
  green400: '#3FB950',
  yellow600: '#9A6700',
  yellow400: '#D29922',
  red500: '#CF222E',
  red400: '#F85149',
};

const theme = createTheme({
  colors: {
    primary: palette.blue500,
    background: palette.white,
    surface: palette.gray50,
    text: palette.gray900,
    textMuted: palette.gray500,
    border: palette.gray200,
    success: palette.green500,
    warning: palette.yellow600,
    danger: palette.red500,

    // Aliases para componentes
    cardBackground: palette.gray50,
    inputBackground: palette.white,
    buttonPrimary: palette.blue500,
    buttonPrimaryText: palette.white,
  },

  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },

  borderRadii: {
    sm: 4,
    md: 8,
    lg: 16,
    full: 9999,
  },

  textVariants: {
    h1: {
      fontSize: 28,
      fontWeight: '700',
      color: 'text',
    },
    h2: {
      fontSize: 22,
      fontWeight: '700',
      color: 'text',
    },
    h3: {
      fontSize: 18,
      fontWeight: '600',
      color: 'text',
    },
    h4: {
      fontSize: 16,
      fontWeight: '600',
      color: 'text',
    },
    body: {
      fontSize: 14,
      color: 'text',
    },
    caption: {
      fontSize: 12,
      color: 'textMuted',
    },
    label: {
      fontSize: 13,
      fontWeight: '500',
      color: 'text',
    },
    defaults: {
      fontSize: 14,
      color: 'text',
    },
  },

  breakpoints: {},
});

export type Theme = typeof theme;
export default theme;

// Tema escuro — mesmas chaves, valores diferentes
export const darkTheme: Theme = {
  ...theme,
  colors: {
    ...theme.colors,
    primary: palette.blue400,
    background: palette.black,
    surface: palette.darkSurface,
    text: palette.darkText,
    textMuted: palette.darkMuted,
    border: palette.darkBorder,
    success: palette.green400,
    warning: palette.yellow400,
    danger: palette.red400,
    cardBackground: palette.darkSurface,
    inputBackground: palette.darkSurface,
    buttonPrimary: palette.blue400,
    buttonPrimaryText: palette.white,
  },
};
