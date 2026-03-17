import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { colors } from '../src/theme/colors';

export default function RootLayout() {
  return (
    <>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: colors.white },
          headerTintColor: colors.gray900,
          headerTitleStyle: { fontWeight: '600' },
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
