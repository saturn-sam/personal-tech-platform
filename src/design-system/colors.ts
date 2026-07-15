export const colorTokens = {
  light: {
    background: '#fbfaf8',
    surface: '#ffffff',
    surfaceMuted: '#f1f5f3',
    border: '#d9e1dc',
    text: '#17201c',
    textMuted: '#52605a',
    accent: '#1f6f78',
    accentStrong: '#164f56',
    accentSoft: '#dceff1',
    focus: '#9b5c1f',
  },
  dark: {
    background: '#111714',
    surface: '#18201c',
    surfaceMuted: '#202b26',
    border: '#34413b',
    text: '#edf3ef',
    textMuted: '#b2c0b8',
    accent: '#6bb8c0',
    accentStrong: '#9bd4d9',
    accentSoft: '#183a3f',
    focus: '#d39b57',
  },
} as const;

export type ColorTheme = keyof typeof colorTokens;
