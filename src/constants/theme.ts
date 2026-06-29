export type ThemeMode = 'light' | 'dark';

export const lightColors = {
  primary: '#3B82F6',
  background: '#F5F5F5',
  card: '#FFFFFF',
  text: '#1C1C1E',
  textSecondary: '#8E8E93',
  border: '#E5E7EB',
  inputBackground: '#EBEBEB',
  easy: '#34C759',
  medium: '#FF9500',
  advanced: '#FF3B30',
};

export const darkColors: typeof lightColors = {
  primary: '#3B82F6',
  background: '#000000',
  card: '#1C1C1E',
  text: '#FFFFFF',
  textSecondary: '#8E8E93',
  border: '#38383A',
  inputBackground: '#2C2C2E',
  easy: '#34C759',
  medium: '#FF9500',
  advanced: '#FF3B30',
};

export const colors = lightColors;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  full: 9999,
};
