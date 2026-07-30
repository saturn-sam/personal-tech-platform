const sharedMermaidConfig = {
  deterministicIds: true,
  securityLevel: 'strict',
  startOnLoad: false,
} as const;

const lightThemeVariables = {
  background: '#fbfaf8',
  clusterBkg: '#f1f5f3',
  clusterBorder: '#d9e1dc',
  edgeLabelBackground: '#fbfaf8',
  fontFamily:
    "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  lineColor: '#52605a',
  mainBkg: '#fff4dd',
  nodeBkg: '#fff4dd',
  nodeBorder: '#d7c3a0',
  nodeTextColor: '#17201c',
  primaryBorderColor: '#d7c3a0',
  primaryColor: '#fff4dd',
  primaryTextColor: '#17201c',
  secondaryColor: '#f1f5f3',
  secondaryTextColor: '#17201c',
  tertiaryColor: '#ffffff',
  tertiaryTextColor: '#17201c',
  textColor: '#17201c',
  titleColor: '#17201c',
} as const;

const darkThemeVariables = {
  background: '#111714',
  clusterBkg: '#202b26',
  clusterBorder: '#4f6258',
  darkMode: true,
  edgeLabelBackground: '#18201c',
  fontFamily:
    "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  lineColor: '#b2c0b8',
  mainBkg: '#274139',
  nodeBkg: '#274139',
  nodeBorder: '#6a8b7e',
  nodeTextColor: '#edf3ef',
  primaryBorderColor: '#6a8b7e',
  primaryColor: '#274139',
  primaryTextColor: '#edf3ef',
  secondaryColor: '#22362f',
  secondaryTextColor: '#edf3ef',
  tertiaryColor: '#18201c',
  tertiaryTextColor: '#edf3ef',
  textColor: '#edf3ef',
  titleColor: '#edf3ef',
} as const;

export const getMermaidConfig = (theme: 'light' | 'dark'): MermaidConfig => ({
  ...sharedMermaidConfig,
  theme: 'base',
  themeVariables: theme === 'dark' ? darkThemeVariables : lightThemeVariables,
});
import type { MermaidConfig } from 'mermaid';
