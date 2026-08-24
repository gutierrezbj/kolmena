/**
 * SRS Foundation — Spacing scale para React Native
 * Base 4px, no lineal. NO modificar valores.
 */
export const spacing = {
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 24,
  6: 32,
  7: 40,
  8: 48,
  9: 64,
  10: 80,
  11: 96,
  12: 128,
} as const;

export const radius = {
  none: 0,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  '2xl': 24,
  full: 9999,
} as const;

export const duration = {
  instant: 100,
  fast: 180,
  normal: 280,
  slow: 400,
  slower: 600,
} as const;
