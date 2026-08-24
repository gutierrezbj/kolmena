/**
 * Kolmena Mobile — Typography (Identity Sprint v1.0)
 * Display: BricolageGrotesque — headers, títulos
 * Body: GeneralSans — texto corriente
 * Mono: DMmono — datos, fechas, badges
 *
 * Las fuentes se cargan en apps/mobile/src/lib/fonts.ts vía expo-font.
 * Si no están cargadas, StyleSheet hace fallback a system fonts.
 */
import { StyleSheet } from 'react-native';
import { colors } from './colors';

// Font family constants
export const fontFamily = {
  display:       'BricolageGrotesque-Bold',
  displayMedium: 'BricolageGrotesque-Medium',
  body:          'GeneralSans-Regular',
  bodyMedium:    'GeneralSans-Medium',
  bodySemibold:  'GeneralSans-Semibold',
  mono:          'DMmono-Regular',
  monoMedium:    'DMmono-Medium',
} as const;

export const typography = StyleSheet.create({
  h1: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.gray900,
    letterSpacing: -0.6,
    fontFamily: fontFamily.display,
  },
  h2: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.gray900,
    letterSpacing: -0.3,
    fontFamily: fontFamily.display,
  },
  h3: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.gray900,
    fontFamily: fontFamily.displayMedium,
  },
  body: {
    fontSize: 16,
    fontWeight: '400',
    color: colors.gray800,
    lineHeight: 24,
    fontFamily: fontFamily.body,
  },
  bodyMedium: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.gray800,
    lineHeight: 24,
    fontFamily: fontFamily.bodyMedium,
  },
  bodySmall: {
    fontSize: 14,
    fontWeight: '400',
    color: colors.gray600,
    lineHeight: 20,
    fontFamily: fontFamily.body,
  },
  caption: {
    fontSize: 12,
    fontWeight: '400',
    color: colors.gray500,
    fontFamily: fontFamily.body,
  },
  label: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.gray600,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    fontFamily: fontFamily.mono,
  },
  mono: {
    fontSize: 14,
    fontWeight: '400',
    color: colors.gray700,
    fontFamily: fontFamily.mono,
  },
  monoSmall: {
    fontSize: 12,
    fontWeight: '400',
    color: colors.gray500,
    fontFamily: fontFamily.mono,
  },
});
