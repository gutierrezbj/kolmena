import { StyleSheet } from 'react-native';
import { colors } from './colors';

export const typography = StyleSheet.create({
  h1: { fontSize: 28, fontWeight: '700', color: colors.gray900, letterSpacing: -0.5 },
  h2: { fontSize: 22, fontWeight: '600', color: colors.gray900 },
  h3: { fontSize: 18, fontWeight: '600', color: colors.gray900 },
  body: { fontSize: 16, fontWeight: '400', color: colors.gray800, lineHeight: 24 },
  bodySmall: { fontSize: 14, fontWeight: '400', color: colors.gray600, lineHeight: 20 },
  caption: { fontSize: 12, fontWeight: '400', color: colors.gray500 },
  label: { fontSize: 14, fontWeight: '600', color: colors.gray700, textTransform: 'uppercase', letterSpacing: 0.5 },
});
