/**
 * Kolmena Theme — Identity Sprint v1.0
 * Carácter: "Gestoría de nueva generación para la escalera de toda la vida"
 * Temperatura: Cálida. Ancla honey #F5A623. Fondos warm, no blancos puros.
 * Tipografía: Bricolage Grotesque (display) + General Sans (body) + DM Mono (datos)
 * Motion: ease-spring como curva primaria. Spring Lift como patrón.
 * Detail: micro-textura hexagonal al 3-4% opacity (referencia panal)
 *
 * Referencia no-digital: packaging artesanal japonés, cerámica oaxaqueña,
 * señalización urbana vintage española — cálido, orgánico, pero ordenado.
 */

// --- Paleta Honey (brand anchor) ---
export const honey = {
  50:  '#FFFBF0',
  100: '#FFF3E0',
  200: '#FFE0A3',
  300: '#FFCC6B',
  400: '#FFB830',
  500: '#F5A623', // anchor — el honey original
  600: '#E09000',
  700: '#B87200',
  800: '#8A5500',
  900: '#5C3800',
} as const;

// --- Warm Neutrals (warm near-black, not cold gray) ---
export const warm = {
  50:  '#FFFDF7', // superficies — blanco cálido, no #FFFFFF puro
  100: '#F7F3EC',
  200: '#EDE6D9',
  300: '#D9CFBF',
  400: '#BFB09A',
  500: '#9E8E77',
  600: '#7C6E58',
  700: '#5C5040',
  800: '#3D2E1E', // texto principal
  900: '#1C1410', // near-black cálido — fondos dark, hero
} as const;

// --- Tostado (acento secundario — referencia panal de cera) ---
export const toast = {
  300: '#C49A6C',
  500: '#7C5E3C',
  700: '#4A3520',
} as const;

// --- Semantic — warm-adjusted (no Material Design defaults) ---
export const semantic = {
  success: {
    bg: '#F0FAF0',
    border: '#86C986',
    text: '#1F6B1F',
    main: '#2D8A2D',
  },
  warning: {
    bg: '#FFFBF0',
    border: '#F5A623',
    text: '#7A4F00',
    main: '#D4850A',
  },
  error: {
    bg: '#FFF5F5',
    border: '#E07070',
    text: '#7A1F1F',
    main: '#C0392B',
  },
  info: {
    bg: '#F0F7FF',
    border: '#7AAEE0',
    text: '#1A3D6B',
    main: '#2E6DB4',
  },
} as const;

// --- Priority colors (incidents) ---
export const priority = {
  low:    { dot: '#2E6DB4', bg: '#F0F7FF', text: '#1A3D6B' },
  medium: { dot: '#D4850A', bg: '#FFFBF0', text: '#7A4F00' },
  high:   { dot: '#C0392B', bg: '#FFF5F5', text: '#7A1F1F' },
  urgent: { dot: '#8A1010', bg: '#FFF0F0', text: '#5A0A0A' },
} as const;

// --- Tier colors (communities) ---
export const tier = {
  FREE:  { bg: warm[100],   text: warm[600],    border: warm[300]   },
  BASIC: { bg: '#EEF4FF',   text: '#2E6DB4',    border: '#7AAEE0'   },
  PRO:   { bg: honey[100],  text: honey[700],   border: honey[400]  },
} as const;

// --- Status colors (incidents) ---
export const status = {
  open:          { bg: '#F0F7FF', text: '#2E6DB4',  border: '#7AAEE0' },
  assigned:      { bg: honey[100], text: honey[700], border: honey[400] },
  in_progress:   { bg: '#F5F0FF', text: '#5B3DAE',  border: '#A880E0' },
  waiting_parts: { bg: warm[100],  text: warm[600],  border: warm[300]  },
  resolved:      { bg: '#F0FAF0', text: '#1F6B1F',  border: '#86C986' },
  closed:        { bg: warm[100],  text: warm[500],  border: warm[300]  },
} as const;

// --- Typography families ---
export const fontFamily = {
  display: 'BricolageGrotesque',       // headers, títulos — carácter
  displayFallback: 'system-ui, sans-serif',
  body: 'GeneralSans',                 // texto corriente — limpio
  bodyFallback: 'system-ui, sans-serif',
  mono: 'DMmono',                      // datos, fechas, IDs, badges
  monoFallback: 'ui-monospace, monospace',
} as const;

// Google Fonts URL para admin (web)
export const googleFontsUrl =
  'https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,300;12..96,400;12..96,500;12..96,600;12..96,700;12..96,800&family=DM+Mono:ital,wght@0,400;0,500;1,400&display=swap';

// General Sans no está en Google Fonts, usar CDN de Fontshare
export const generalSansCdnUrl =
  'https://api.fontshare.com/v2/css?f[]=general-sans@300,400,500,600,700&display=swap';

// --- Signature Motion ---
export const motion = {
  // Curva primaria del proyecto
  easing: 'cubic-bezier(0.22, 1.2, 0.36, 1)', // ease-spring
  // Patrón: Spring Lift
  springLift: {
    transform: 'translateY(-3px) scale(1.01)',
    transition: 'transform 280ms cubic-bezier(0.22, 1.2, 0.36, 1), box-shadow 280ms cubic-bezier(0.22, 1.2, 0.36, 1)',
  },
  activePress: {
    transform: 'scale(0.97)',
    transition: 'transform 100ms cubic-bezier(0.22, 1.2, 0.36, 1)',
  },
} as const;

// --- Signature Detail: Hexagonal SVG texture ---
// Aplicar como background-image al 3-4% opacity en hero/sidebar
export const hexTextureSvg = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='28' height='49' viewBox='0 0 28 49'%3E%3Cg fill='%23F5A623' fill-opacity='0.04'%3E%3Cpolygon points='14 0 28 8 28 24 14 32 0 24 0 8'/%3E%3Cpolygon points='14 17 28 25 28 41 14 49 0 41 0 25'/%3E%3C/g%3E%3C/svg%3E")`;

// --- Consolidated theme export ---
export const kolmenaTheme = {
  colors: {
    honey,
    warm,
    toast,
    semantic,
    priority,
    tier,
    status,
    // Aliases de uso frecuente
    primary: honey[500],
    primaryHover: honey[600],
    primaryLight: honey[100],
    textPrimary: warm[800],
    textSecondary: warm[600],
    textMuted: warm[500],
    background: warm[50],
    surface: warm[50],
    surfaceBorder: warm[200],
    surfaceOverlay: warm[100],
  },
  typography: fontFamily,
  googleFontsUrl,
  generalSansCdnUrl,
  motion,
  hexTextureSvg,
} as const;
