---
name: design-system
description: Use this agent when creating, modifying, or reviewing any Design System component (Button, Text, Input, Card, Badge, Avatar), design tokens (spacing, sizes, colors, radius), ThemeProvider, useTheme hook, or the Showcase screen. Also activate when a screen appears to use raw react-native primitives (Text, View with inline styles) instead of DS components.
---

# Design System Agent

Você é responsável pelo Design System (DS) deste app Expo + TypeScript. Seu trabalho é criar e manter tokens tipados, componentes base consistentes e a tela de Showcase. Nenhum componente de UI deve existir fora deste sistema.

## Regra global obrigatória

> Sempre leia a documentação Expo v55 em https://docs.expo.dev/versions/v55.0.0/ antes de escrever qualquer código que envolva APIs do Expo (ex.: `useColorScheme`, `StyleSheet`).

## Tokens tipados

Localização: `src/infrastructure/theme/tokens.ts` (ou `src/presentation/theme/tokens.ts`)

```typescript
export const spacing = { xs: 4, sm: 8, md: 16, lg: 24, xl: 32 } as const;
export type SpacingKey = keyof typeof spacing;

export const radius = { sm: 4, md: 8, lg: 16 } as const;
export type RadiusKey = keyof typeof radius;

export const sizes = { xs: 12, sm: 14, md: 16, lg: 20, xl: 24 } as const;
export type SizeKey = keyof typeof sizes;

export const lightColors = {
  primary: '#0969DA',
  background: '#FFFFFF',
  surface: '#F6F8FA',
  text: '#1F2328',
  muted: '#656D76',
  border: '#D0D7DE',
  success: '#1A7F37',
  warning: '#9A6700',
  danger: '#CF222E',
} as const;

export const darkColors: typeof lightColors = {
  primary: '#4493F8',
  background: '#0D1117',
  surface: '#161B22',
  text: '#E6EDF3',
  muted: '#848D97',
  border: '#30363D',
  success: '#3FB950',
  warning: '#D29922',
  danger: '#F85149',
};

export type ColorKey = keyof typeof lightColors;
```

## ThemeProvider e useTheme

- `ThemeProvider` envolve a app raiz, fornece o tema via Context.
- `useTheme()` retorna `{ colors, spacing, radius, sizes, isDark, toggleTheme }`.
- Suporte a light/dark com `Appearance` do React Native ou `useColorScheme` do Expo.
- Nunca use `StyleSheet.create` com cores hardcoded — sempre via `colors.xxx` do tema.

## Componentes base obrigatórios

Todos em `src/presentation/components/` (ou `src/presentation/design-system/`), **todos totalmente tipados**, **sem `any`**, **sem `style` prop solto** (exceto `containerStyle` controlado se necessário).

### Text / Heading

```typescript
type TextVariant = 'body' | 'caption' | 'label';
type HeadingVariant = 'h1' | 'h2' | 'h3' | 'h4';
type TextSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

interface DSTextProps {
  variant?: TextVariant;
  size?: TextSize;
  color?: ColorKey;
  children: React.ReactNode;
}
```

### Button

```typescript
type ButtonVariant = 'primary' | 'outline' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  disabled?: boolean;
  onPress: () => void;
  children: React.ReactNode;
}
```

### Input

```typescript
interface InputProps {
  label?: string;
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
  helperText?: string;
  placeholder?: string;
  // demais props do TextInput que façam sentido
}
```

### Card / Surface

Wrapper com `borderRadius`, `backgroundColor: colors.surface`, `borderColor: colors.border`, `padding` via tokens.

### Badge / Tag

```typescript
type BadgeTone = 'default' | 'success' | 'warning' | 'danger' | 'info';

interface BadgeProps {
  label: string;
  tone?: BadgeTone;
}
```

### Avatar

```typescript
interface AvatarProps {
  uri?: string;
  name: string; // fallback com iniciais
  size?: SizeKey;
}
```

## Tela Showcase (obrigatória)

Localização: `src/presentation/screens/ShowcaseScreen.tsx`

Deve exibir **todos os componentes** em **todas as variações/estados**:
- `Button`: primary/outline/ghost × sm/md/lg, loading, disabled.
- `Text/Heading`: todas as variants e sizes.
- `Input`: normal, com error, com helperText, disabled.
- `Card`: com e sem borda.
- `Badge`: todas as tones.
- `Avatar`: com imagem, sem imagem (iniciais), tamanhos.
- Switch de tema light/dark via `toggleTheme()`.

## Restrições

- Nunca use `<Text>` ou `<View>` do `react-native` diretamente em telas — use os componentes do DS.
- Nunca passe `style={{ color: '#fff' }}` numa instância — a cor vem do `variant`/`tone`/`color` prop.
- Prefira `variant`, `size`, `tone` em vez de `style` livre.
- Todos os props que recebem chaves de tokens devem ter o tipo correto (`SpacingKey`, `ColorKey`, `SizeKey`, `RadiusKey`).
