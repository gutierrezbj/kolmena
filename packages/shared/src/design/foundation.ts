/**
 * SRS Foundation — Design System v2.0
 * Tokens inmutables compartidos por todos los productos SRS.
 * NO modificar por proyecto. Los overrides van en theme-{proyecto}.ts
 */

// --- Spacing scale (base 4px, no lineal) ---
export const spacing = {
  1: 4,    // inline gaps
  2: 8,    // tight element spacing
  3: 12,   // compact groups
  4: 16,   // default element gap
  5: 24,   // section inner padding
  6: 32,   // card padding
  7: 40,   // group separation
  8: 48,   // section gaps
  9: 64,   // major section breaks
  10: 80,  // page-level spacing
  11: 96,  // hero breathing room
  12: 128, // maximum separation
} as const;

// Helpers para uso en React Native (StyleSheet espera numbers)
export const sp = spacing;

// Helpers para uso en CSS (string con px)
export const spx = Object.fromEntries(
  Object.entries(spacing).map(([k, v]) => [k, `${v}px`])
) as Record<keyof typeof spacing, string>;

// --- Border Radius scale ---
export const radius = {
  none: 0,
  sm: 4,    // inputs, badges
  md: 8,    // cards, buttons
  lg: 12,   // modals, panels
  xl: 16,   // feature cards
  '2xl': 24, // hero elements
  full: 9999, // avatars, pills
} as const;

export const radx = Object.fromEntries(
  Object.entries(radius).map(([k, v]) => [k, v === 9999 ? '9999px' : `${v}px`])
) as Record<keyof typeof radius, string>;

// --- Z-Index scale (nunca inventar valores) ---
export const zIndex = {
  base: 0,
  dropdown: 100,
  sticky: 200,
  overlay: 300,
  modal: 400,
  toast: 500,
  tooltip: 600,
} as const;

// --- Duration scale ---
export const duration = {
  instant: 100,  // color, opacity
  fast: 180,     // hover, focus, elementos pequeños
  normal: 280,   // cards, dropdowns, panels
  slow: 400,     // modals, page transitions
  slower: 600,   // stagger, orchestrations
} as const;

export const durationMs = Object.fromEntries(
  Object.entries(duration).map(([k, v]) => [k, `${v}ms`])
) as Record<keyof typeof duration, string>;

// --- Easing curves (4 curvas custom SRS) ---
export const easing = {
  outExpo:    'cubic-bezier(0.16, 1, 0.3, 1)',     // salida suave, la más versátil
  outBack:    'cubic-bezier(0.34, 1.56, 0.64, 1)', // rebote sutil, personalidad
  inOutCirc:  'cubic-bezier(0.85, 0, 0.15, 1)',    // entrada/salida dramática
  spring:     'cubic-bezier(0.22, 1.2, 0.36, 1)',  // física spring, la más expresiva
} as const;

// --- Breakpoints ---
export const breakpoints = {
  mobile: 0,
  tablet: 641,
  desktop: 1025,
  wide: 1441,
} as const;

// --- Content Width ---
export const contentWidth = {
  prose: '65ch',
  content: '1200px',
  wide: '1440px',
} as const;

// --- Elevation (Sombras CSS) ---
export const shadow = {
  xs: '0 1px 2px rgba(0,0,0,0.04)',
  sm: '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',
  md: '0 4px 6px rgba(0,0,0,0.07), 0 2px 4px rgba(0,0,0,0.05)',
  lg: '0 10px 15px rgba(0,0,0,0.08), 0 4px 6px rgba(0,0,0,0.05)',
  xl: '0 20px 25px rgba(0,0,0,0.09), 0 10px 10px rgba(0,0,0,0.04)',
} as const;

// --- Active state (universal) ---
// Todo elemento clickeable se comprime al 0.97 en active
export const activeScale = 0.97;

export const foundation = {
  spacing,
  sp,
  spx,
  radius,
  radx,
  zIndex,
  duration,
  durationMs,
  easing,
  breakpoints,
  contentWidth,
  shadow,
  activeScale,
} as const;
