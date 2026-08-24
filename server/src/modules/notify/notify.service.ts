import { eq, and, desc, inArray } from 'drizzle-orm';
import { db } from '../../shared/db/client.js';
import { notifications, deviceTokens, users, userCommunities } from '../../shared/db/schema.js';
import { generateId } from '../../shared/utils/uuid.js';
import { AppError } from '../../shared/errors/app-error.js';
import { ErrorCode } from '../../shared/errors/error-codes.js';
import { sendEmail } from '../../services/email.js';
import { sendPush } from '../../services/push.js';
import { logger } from '../../shared/utils/logger.js';

type NotificationChannel = 'push' | 'email' | 'in_app';

export async function listNotifications(userId: string, communityId?: string) {
  const conditions = [eq(notifications.userId, userId)];
  if (communityId) conditions.push(eq(notifications.communityId, communityId));
  return db.select().from(notifications)
    .where(and(...conditions))
    .orderBy(desc(notifications.createdAt))
    .limit(50);
}

export async function getUnreadCount(userId: string) {
  const unread = await db.select({ id: notifications.id }).from(notifications)
    .where(and(eq(notifications.userId, userId), eq(notifications.isRead, false)));
  return unread.length;
}

export async function markAsRead(id: string, userId: string) {
  const [notif] = await db.update(notifications)
    .set({ isRead: true })
    .where(and(eq(notifications.id, id), eq(notifications.userId, userId)))
    .returning();
  if (!notif) throw new AppError(ErrorCode.NOT_FOUND, 'Notification not found');
  return notif;
}

export async function markAllAsRead(userId: string) {
  await db.update(notifications)
    .set({ isRead: true })
    .where(and(eq(notifications.userId, userId), eq(notifications.isRead, false)));
}

// -- Device tokens --

export async function registerDeviceToken(userId: string, token: string, platform: string) {
  // Upsert: if token already exists (same device, different user after re-login), reassign it
  const existing = await db.select({ id: deviceTokens.id, userId: deviceTokens.userId })
    .from(deviceTokens).where(eq(deviceTokens.token, token)).limit(1);

  if (existing.length > 0) {
    if (existing[0]!.userId === userId) return; // already registered, nothing to do
    // Token belongs to another user (e.g. device re-used) — reassign
    await db.update(deviceTokens)
      .set({ userId })
      .where(eq(deviceTokens.token, token));
    return;
  }

  await db.insert(deviceTokens).values({
    id: generateId(),
    userId,
    token,
    platform,
  });
}

export async function deregisterDeviceToken(userId: string, token: string) {
  await db.delete(deviceTokens)
    .where(and(eq(deviceTokens.userId, userId), eq(deviceTokens.token, token)));
}

// -- Internal notification dispatch --

/** Internal: create a notification and optionally dispatch via push/email. Called by other modules. */
export async function sendNotification(data: {
  userId: string;
  communityId?: string;
  channel?: NotificationChannel;
  title: string;
  body: string;
  resource?: string;
  resourceId?: string;
  /** Override email address (defaults to user's registered email) */
  emailTo?: string;
}) {
  const channel = data.channel ?? 'in_app';

  // Always persist in-app record
  const [notif] = await db.insert(notifications).values({
    id: generateId(),
    userId: data.userId,
    communityId: data.communityId ?? null,
    channel,
    title: data.title,
    body: data.body,
    resource: data.resource ?? null,
    resourceId: data.resourceId ?? null,
  }).returning();

  // Dispatch to external channel
  if (channel === 'push') {
    const tokens = await db.select({ token: deviceTokens.token })
      .from(deviceTokens)
      .where(eq(deviceTokens.userId, data.userId));

    if (tokens.length > 0) {
      const stale = await sendPush(tokens.map((r) => r.token), {
        title: data.title,
        body: data.body,
        data: {
          resource: data.resource,
          resourceId: data.resourceId,
          communityId: data.communityId,
        },
      });
      await purgeStaleTokens(stale);
    } else {
      logger.debug({ userId: data.userId }, 'No device tokens for push notification');
    }
  } else if (channel === 'email') {
    let emailAddress = data.emailTo;

    if (!emailAddress) {
      const [user] = await db.select({ email: users.email })
        .from(users).where(eq(users.id, data.userId)).limit(1);
      emailAddress = user?.email;
    }

    if (emailAddress) {
      await sendEmail({
        to: emailAddress,
        subject: data.title,
        html: `<p>${data.body}</p>`,
        text: data.body,
      }).catch((err) => {
        logger.error({ err, userId: data.userId }, 'Failed to deliver email notification');
      });
    }
  }

  return notif!;
}

/** Remove device tokens that Expo reported as DeviceNotRegistered. */
async function purgeStaleTokens(staleTokens: string[]) {
  if (staleTokens.length === 0) return;
  await db.delete(deviceTokens).where(inArray(deviceTokens.token, staleTokens));
  logger.info({ count: staleTokens.length }, 'Purged stale device tokens');
}

/**
 * Broadcast a notification to every member of a community (optionally filtered
 * by role), persisting one in-app record per member and sending a single
 * batched push. Called by other modules (announcements, new incidents, etc.).
 */
export async function notifyCommunityMembers(data: {
  communityId: string;
  title: string;
  body: string;
  resource?: string;
  resourceId?: string;
  /** Restrict to these roles (default: all members) */
  roles?: Array<'admin' | 'president' | 'resident' | 'provider' | 'inquiry'>;
  /** Don't notify this user (typically the author of the action) */
  excludeUserId?: string;
}) {
  const conditions = [eq(userCommunities.communityId, data.communityId)];
  if (data.roles && data.roles.length > 0) {
    conditions.push(inArray(userCommunities.role, data.roles));
  }

  const members = await db.select({ userId: userCommunities.userId })
    .from(userCommunities)
    .where(and(...conditions));

  const targets = [...new Set(members.map((m) => m.userId))]
    .filter((id) => id !== data.excludeUserId);
  if (targets.length === 0) return;

  // One in-app record per member
  await db.insert(notifications).values(targets.map((userId) => ({
    id: generateId(),
    userId,
    communityId: data.communityId,
    channel: 'push' as const,
    title: data.title,
    body: data.body,
    resource: data.resource ?? null,
    resourceId: data.resourceId ?? null,
  })));

  // Single batched push for all their devices
  const tokens = await db.select({ token: deviceTokens.token })
    .from(deviceTokens)
    .where(inArray(deviceTokens.userId, targets));

  if (tokens.length > 0) {
    const stale = await sendPush(tokens.map((r) => r.token), {
      title: data.title,
      body: data.body,
      data: {
        resource: data.resource,
        resourceId: data.resourceId,
        communityId: data.communityId,
      },
    });
    await purgeStaleTokens(stale);
  }
}
