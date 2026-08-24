/**
 * Kolmena — Custom font loader (Identity Sprint v1.0)
 *
 * Bricolage Grotesque: display/headers — carácter, no genérica
 * Plus Jakarta Sans: body — sustituto de General Sans (misma familia humanista)
 * DM Mono: datos, fechas, IDs, badges — tensión legible
 *
 * Usage en app/_layout.tsx:
 *   const [fontsLoaded] = useKolmenaFonts();
 *   if (!fontsLoaded) return null;
 */
import { useFonts } from 'expo-font';
import {
  BricolageGrotesque_400Regular,
  BricolageGrotesque_500Medium,
  BricolageGrotesque_600SemiBold,
  BricolageGrotesque_700Bold,
  BricolageGrotesque_800ExtraBold,
} from '@expo-google-fonts/bricolage-grotesque';
import {
  PlusJakartaSans_400Regular,
  PlusJakartaSans_500Medium,
  PlusJakartaSans_600SemiBold,
  PlusJakartaSans_700Bold,
} from '@expo-google-fonts/plus-jakarta-sans';
import {
  DMMono_400Regular,
  DMMono_500Medium,
} from '@expo-google-fonts/dm-mono';

export function useKolmenaFonts() {
  return useFonts({
    'BricolageGrotesque-Regular':   BricolageGrotesque_400Regular,
    'BricolageGrotesque-Medium':    BricolageGrotesque_500Medium,
    'BricolageGrotesque-SemiBold':  BricolageGrotesque_600SemiBold,
    'BricolageGrotesque-Bold':      BricolageGrotesque_700Bold,
    'BricolageGrotesque-ExtraBold': BricolageGrotesque_800ExtraBold,

    'GeneralSans-Regular':   PlusJakartaSans_400Regular,
    'GeneralSans-Medium':    PlusJakartaSans_500Medium,
    'GeneralSans-Semibold':  PlusJakartaSans_600SemiBold,
    'GeneralSans-Bold':      PlusJakartaSans_700Bold,

    'DMmono-Regular': DMMono_400Regular,
    'DMmono-Medium':  DMMono_500Medium,
  });
}
