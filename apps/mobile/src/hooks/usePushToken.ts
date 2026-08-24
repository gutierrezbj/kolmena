/**
 * usePushToken — registers an Expo push token with the server.
 * Call this once the user is authenticated.
 *
 * Requirements:
 *  - expo-notifications must be installed and linked (via expo-notifications plugin in app.json)
 *  - expo-device for physical device detection (push tokens only work on real devices)
 */
import { useEffect } from 'react';
import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { api } from '../lib/api';

// Configure how notifications are shown while the app is foregrounded
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

async function requestAndGetToken(): Promise<string | null> {
  if (!Device.isDevice) {
    // Push tokens are not available on simulators/emulators
    return null;
  }

  const { status: existing } = await Notifications.getPermissionsAsync();
  let finalStatus = existing;

  if (existing !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') return null;

  // Android requires a notification channel
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
    });
  }

  const tokenData = await Notifications.getExpoPushTokenAsync();
  return tokenData.data;
}

/**
 * Registers the device push token with the Kolmena API.
 * Safe to call multiple times — server handles duplicates.
 *
 * @param isAuthenticated - only registers when the user is logged in
 */
export function usePushToken(isAuthenticated: boolean) {
  useEffect(() => {
    if (!isAuthenticated) return;

    requestAndGetToken()
      .then((token) => {
        if (!token) return;
        const platform = Platform.OS === 'ios' ? 'ios' : 'android';
        return api('/notifications/device-token', {
          method: 'POST',
          body: { token, platform },
        });
      })
      .catch(() => {
        // Non-blocking — push is optional, failures are silent
      });
  }, [isAuthenticated]);
}
