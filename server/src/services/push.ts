/**
 * Kolmena — Push Notification service (Expo Push API)
 * Expo's push service wraps both FCM (Android) and APNs (iOS).
 * No Firebase credentials needed — Expo handles the routing.
 * https://docs.expo.dev/push-notifications/sending-notifications/
 */
import Expo, { type ExpoPushMessage } from 'expo-server-sdk';
import { logger } from '../shared/utils/logger.js';
import { env } from '../config/env.js';

const expo = new Expo({
  accessToken: env.EXPO_ACCESS_TOKEN,
});

export interface PushPayload {
  title: string;
  body: string;
  data?: Record<string, unknown>;
  badge?: number;
  sound?: 'default' | null;
}

/**
 * Send a push notification to one or more Expo push tokens.
 * Invalid tokens are logged and silently skipped — never throws on token errors.
 * Returns the stale tokens (DeviceNotRegistered) so callers can purge them from DB.
 */
export async function sendPush(tokens: string[], payload: PushPayload): Promise<string[]> {
  if (tokens.length === 0) return [];

  const validTokens = tokens.filter((t) => {
    if (!Expo.isExpoPushToken(t)) {
      logger.warn({ token: t }, 'Invalid Expo push token, skipping');
      return false;
    }
    return true;
  });

  if (validTokens.length === 0) return [];

  const messages: ExpoPushMessage[] = validTokens.map((to) => ({
    to,
    title: payload.title,
    body: payload.body,
    data: payload.data ?? {},
    badge: payload.badge,
    sound: payload.sound ?? 'default',
    priority: 'high',
  }));

  const chunks = expo.chunkPushNotifications(messages);
  const staleTokens: string[] = [];

  for (const chunk of chunks) {
    try {
      const tickets = await expo.sendPushNotificationsAsync(chunk);

      // Tickets are positional: tickets[i] corresponds to chunk[i]
      tickets.forEach((ticket, i) => {
        if (ticket.status === 'error') {
          logger.error({ ticket }, 'Push notification delivery error');
          if (ticket.details?.error === 'DeviceNotRegistered') {
            const to = chunk[i]?.to;
            if (typeof to === 'string') staleTokens.push(to);
          }
        }
      });
    } catch (err) {
      logger.error({ err }, 'Failed to send push notification chunk');
    }
  }

  return staleTokens;
}

/**
 * Send to a single token — convenience wrapper.
 */
export async function sendPushToToken(token: string, payload: PushPayload): Promise<string[]> {
  return sendPush([token], payload);
}
