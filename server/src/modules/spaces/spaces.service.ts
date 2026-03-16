import { eq, and, or, gt, lt, desc } from 'drizzle-orm';
import { db } from '../../shared/db/client.js';
import { spaces, bookings } from '../../shared/db/schema.js';
import { generateId } from '../../shared/utils/uuid.js';
import { AppError } from '../../shared/errors/app-error.js';
import { ErrorCode } from '../../shared/errors/error-codes.js';

// --- Spaces ---

export async function listSpaces(communityId: string) {
  return db.select().from(spaces)
    .where(and(eq(spaces.communityId, communityId), eq(spaces.isActive, true)));
}

export async function getSpace(id: string) {
  const [space] = await db.select().from(spaces).where(eq(spaces.id, id)).limit(1);
  if (!space) throw new AppError(ErrorCode.NOT_FOUND, 'Space not found');
  return space;
}

export async function createSpace(communityId: string, data: { name: string; description?: string; maxCapacity?: number; rules?: string }) {
  const [space] = await db.insert(spaces).values({
    id: generateId(),
    communityId,
    name: data.name,
    description: data.description ?? null,
    maxCapacity: data.maxCapacity ?? null,
    rules: data.rules ?? null,
  }).returning();
  return space;
}

export async function updateSpace(id: string, data: { name?: string; description?: string; maxCapacity?: number; rules?: string; isActive?: boolean }) {
  const [space] = await db.update(spaces).set(data).where(eq(spaces.id, id)).returning();
  if (!space) throw new AppError(ErrorCode.NOT_FOUND, 'Space not found');
  return space;
}

// --- Bookings ---

export async function listBookings(communityId: string, spaceId?: string) {
  const conditions = [eq(bookings.communityId, communityId)];
  if (spaceId) conditions.push(eq(bookings.spaceId, spaceId));
  return db.select().from(bookings).where(and(...conditions)).orderBy(bookings.startsAt);
}

export async function createBooking(
  communityId: string,
  userId: string,
  data: { spaceId: string; startsAt: string; endsAt: string; note?: string },
) {
  const start = new Date(data.startsAt);
  const end = new Date(data.endsAt);

  if (end <= start) {
    throw new AppError(ErrorCode.VALIDATION_ERROR, 'End time must be after start time');
  }

  // Check for overlapping confirmed bookings
  const overlapping = await db.select({ id: bookings.id }).from(bookings)
    .where(and(
      eq(bookings.spaceId, data.spaceId),
      eq(bookings.status, 'confirmed'),
      lt(bookings.startsAt, end),
      gt(bookings.endsAt, start),
    ))
    .limit(1);

  if (overlapping.length > 0) {
    throw new AppError(ErrorCode.CONFLICT, 'Time slot already booked');
  }

  const [booking] = await db.insert(bookings).values({
    id: generateId(),
    spaceId: data.spaceId,
    userId,
    communityId,
    startsAt: start,
    endsAt: end,
    note: data.note ?? null,
  }).returning();
  return booking;
}

export async function cancelBooking(id: string, userId: string) {
  const [booking] = await db.select().from(bookings).where(eq(bookings.id, id)).limit(1);
  if (!booking) throw new AppError(ErrorCode.NOT_FOUND, 'Booking not found');
  if (booking.userId !== userId) {
    throw new AppError(ErrorCode.FORBIDDEN, 'Cannot cancel another user\'s booking');
  }

  const [updated] = await db.update(bookings)
    .set({ status: 'cancelled' })
    .where(eq(bookings.id, id))
    .returning();
  return updated;
}
