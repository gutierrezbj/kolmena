import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import { useKolmenaFonts } from '../src/lib/fonts';
import { colors } from '../src/theme/colors';
import { fontFamily } from '../src/theme/typography';

export default function RootLayout() {
  const [fontsLoaded] = useKolmenaFonts();

  // Mantiene splash hasta que las fuentes estén listas
  if (!fontsLoaded) return <View style={{ flex: 1, backgroundColor: colors.background }} />;

  return (
    <>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: colors.surface },
          headerTintColor: colors.gray900,
          headerTitleStyle: { fontWeight: '700', fontFamily: fontFamily.display },
          contentStyle: { backgroundColor: colors.background },
        }}
      >
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="create-incident" options={{ title: 'Nueva incidencia', presentation: 'modal' }} />
        <Stack.Screen name="create-booking" options={{ title: 'Nueva reserva', presentation: 'modal' }} />
        <Stack.Screen name="create-post" options={{ title: 'Nuevo post', presentation: 'modal' }} />
      </Stack>
    </>
  );
}
