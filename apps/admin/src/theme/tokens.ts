/**
 * Kolmena Admin — Design Tokens
 * Centraliza todos los valores visuales. NO hardcodear hex en components.
 * Fuente: SRS Foundation + Kolmena Theme Identity Sprint v1.0
 */

// --- Colors ---
export const c = {
  // Brand
  primary:        '#F5A623',
  primaryHover:   '#E09000',
  primaryLight:   '#FFF3E0',
  primaryBorder:  '#FFE0A3',

  // Warm neutrals (no grays fríos)
  bg:             '#FFFDF7', // fondo principal — blanco cálido
  surface:        '#FFFDF7',
  surfaceBorder:  '#EDE6D9',
  surfaceOverlay: '#F7F3EC',

  textPrimary:    '#3D2E1E',
  textSecondary:  '#7C6E58',
  textMuted:      '#9E8E77',
  textOnPrimary:  '#FFFFFF',

  // Semantic
  successBg:      '#F0FAF0',
  successBorder:  '#86C986',
  successText:    '#1F6B1F',
  success:        '#2D8A2D',

  warningBg:      '#FFFBF0',
  warningBorder:  '#F5A623',
  warningText:    '#7A4F00',
  warning:        '#D4850A',

  errorBg:        '#FFF5F5',
  errorBorder:    '#E07070',
  errorText:      '#7A1F1F',
  error:          '#C0392B',

  infoBg:         '#F0F7FF',
  infoBorder:     '#7AAEE0',
  infoText:       '#1A3D6B',
  info:           '#2E6DB4',

  // Priority (incidents)
  priorityLow:    '#2E6DB4',
  priorityMedium: '#D4850A',
  priorityHigh:   '#C0392B',
  priorityUrgent: '#8A1010',

  // Sidebar
  sidebarBg:      '#FFFDF7',
  sidebarBorder:  '#EDE6D9',
  navActiveBg:    '#FFF3E0',
  navActiveText:  '#E09000',
  navInactiveText:'#7C6E58',

  // Table
  tableHeaderBg:  '#F7F3EC',
  tableRowHover:  '#FFFBF0',

  white: '#FFFFFF',
} as const;

// --- Spacing (SRS Foundation base 4px) ---
export const sp = {
  1: '4px',
  2: '8px',
  3: '12px',
  4: '16px',
  5: '24px',
  6: '32px',
  7: '40px',
  8: '48px',
  9: '64px',
  10: '80px',
} as const;

// --- Border Radius (SRS Foundation) ---
export const r = {
  sm:   '4px',
  md:   '8px',
  lg:   '12px',
  xl:   '16px',
  full: '9999px',
} as const;

// --- Shadows ---
export const shadow = {
  xs: '0 1px 2px rgba(60,40,20,0.04)',
  sm: '0 1px 3px rgba(60,40,20,0.06), 0 1px 2px rgba(60,40,20,0.04)',
  md: '0 4px 6px rgba(60,40,20,0.07), 0 2px 4px rgba(60,40,20,0.05)',
  lg: '0 10px 15px rgba(60,40,20,0.08), 0 4px 6px rgba(60,40,20,0.05)',
} as const;

// --- Z-index ---
export const z = {
  dropdown: 100,
  sticky:   200,
  overlay:  300,
  modal:    400,
  toast:    500,
} as const;

// --- Typography ---
export const font = {
  display: "'Bricolage Grotesque', system-ui, sans-serif",
  body:    "'General Sans', system-ui, sans-serif",
  mono:    "'DM Mono', ui-monospace, monospace",
} as const;

// --- Motion (Signature: ease-spring + Spring Lift) ---
export const motion = {
  easing:      'cubic-bezier(0.22, 1.2, 0.36, 1)',
  durationFast:   '180ms',
  durationNormal: '280ms',
  durationSlow:   '400ms',
  springLift: 'translateY(-3px) scale(1.01)',
  activeScale: 'scale(0.97)',
} as const;

// --- Tier badge styles ---
export const tierStyle = {
  FREE:  { background: '#F7F3EC', color: '#7C6E58',   border: '1px solid #D9CFBF' },
  BASIC: { background: '#EEF4FF', color: '#2E6DB4',   border: '1px solid #7AAEE0' },
  PRO:   { background: '#FFF3E0', color: '#B87200',   border: '1px solid #FFE0A3' },
} as const;

// --- Priority dot color ---
export const priorityDot = {
  low:    c.priorityLow,
  medium: c.priorityMedium,
  high:   c.priorityHigh,
  urgent: c.priorityUrgent,
} as const;

// --- Status badge styles ---
export const statusStyle = {
  open:          { background: '#F0F7FF', color: '#2E6DB4', border: '1px solid #7AAEE0' },
  assigned:      { background: '#FFF3E0', color: '#B87200', border: '1px solid #FFE0A3' },
  in_progress:   { background: '#F5F0FF', color: '#5B3DAE', border: '1px solid #A880E0' },
  waiting_parts: { background: '#F7F3EC', color: '#7C6E58', border: '1px solid #D9CFBF' },
  resolved:      { background: '#F0FAF0', color: '#1F6B1F', border: '1px solid #86C986' },
  closed:        { background: '#F7F3EC', color: '#9E8E77', border: '1px solid #EDE6D9' },
} as const;

// --- Hex texture (signature detail) ---
export const hexTexture = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='28' height='49' viewBox='0 0 28 49'%3E%3Cg fill='%23F5A623' fill-opacity='0.04'%3E%3Cpolygon points='14 0 28 8 28 24 14 32 0 24 0 8'/%3E%3Cpolygon points='14 17 28 25 28 41 14 49 0 41 0 25'/%3E%3C/g%3E%3C/svg%3E")`;
