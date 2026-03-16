import { eq, and, desc } from 'drizzle-orm';
import { db } from '../../shared/db/client.js';
import { notifications } from '../../shared/db/schema.js';
import { generateId } from '../../shared/utils/uuid.js';
import { AppError } from '../../shared/errors/app-error.js';
import { ErrorCode } from '../../shared/errors/error-codes.js';

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

/** Internal: create a notification for a user. Called by other modules. */
export async function sendNotification(data: {
  userId: string;
  communityId?: string;
  channel?: NotificationChannel;
  title: string;
  body: string;
  resource?: string;
  resourceId?: string;
}) {
  const [notif] = await db.insert(notifications).values({
    id: generateId(),
    userId: data.userId,
    communityId: data.communityId ?? null,
    channel: data.channel ?? 'in_app',
    title: data.title,
    body: data.body,
    resource: data.resource ?? null,
    resourceId: data.resourceId ?? null,
  }).returning();
  return notif;
}
