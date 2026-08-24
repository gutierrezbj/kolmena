/**
 * Kolmena Mobile — Color tokens (Identity Sprint v1.0)
 * Temperatura: cálida. Fondo #FFFDF7, neutrales warm, honey como ancla.
 * Sin Material Design defaults (#2196F3, #4CAF50, #F44336, #FF9800).
 */

// --- Brand honey ---
export const honey = {
  50:  '#FFFBF0',
  100: '#FFF3E0',
  200: '#FFE0A3',
  300: '#FFCC6B',
  500: '#F5A623', // anchor
  600: '#E09000',
  700: '#B87200',
  900: '#5C3800',
} as const;

// --- Warm neutrals (reemplaza los grays fríos) ---
export const warm = {
  50:  '#FFFDF7', // background — blanco cálido
  100: '#F7F3EC',
  200: '#EDE6D9',
  300: '#D9CFBF',
  400: '#BFB09A',
  500: '#9E8E77',
  600: '#7C6E58',
  700: '#5C5040',
  800: '#3D2E1E', // texto principal
  900: '#1C1410', // near-black cálido
} as const;

// --- Semantic (warm-adjusted, sin Material defaults) ---
export const semantic = {
  success:       '#2D8A2D',
  successLight:  '#F0FAF0',
  warning:       '#D4850A',
  warningLight:  '#FFFBF0',
  error:         '#C0392B',
  errorLight:    '#FFF5F5',
  info:          '#2E6DB4',
  infoLight:     '#F0F7FF',
} as const;

// --- Priority colors ---
export const priority = {
  low:    '#2E6DB4',
  medium: '#D4850A',
  high:   '#C0392B',
  urgent: '#8A1010',
} as const;

// --- Aliases de uso frecuente ---
export const colors = {
  // Brand
  honey:         honey[500],
  honeyLight:    honey[100],
  honeyDark:     honey[600],

  // Backgrounds / surfaces
  background:    warm[50],
  surface:       warm[50],
  card:          warm[50],
  white:         '#FFFFFF',

  // Warm neutrals (backward compat + nuevos)
  gray50:        warm[50],
  gray100:       warm[100],
  gray200:       warm[200],
  gray300:       warm[300],
  gray400:       warm[400],
  gray500:       warm[500],
  gray600:       warm[600],
  gray700:       warm[700],
  gray800:       warm[800],
  gray900:       warm[900],
  black:         warm[900],

  // Semantic
  success:       semantic.success,
  successLight:  semantic.successLight,
  warning:       semantic.warning,
  warningLight:  semantic.warningLight,
  error:         semantic.error,
  errorLight:    semantic.errorLight,
  info:          semantic.info,
  infoLight:     semantic.infoLight,

  // Priority
  priorityLow:    priority.low,
  priorityMedium: priority.medium,
  priorityHigh:   priority.high,
  priorityUrgent: priority.urgent,
} as const;
