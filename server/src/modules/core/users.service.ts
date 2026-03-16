import { eq } from 'drizzle-orm';
import { db } from '../../shared/db/client.js';
import { users, userCommunities } from '../../shared/db/schema.js';
import { AppError } from '../../shared/errors/app-error.js';
import { ErrorCode } from '../../shared/errors/error-codes.js';

export async function getUser(id: string) {
  const [user] = await db.select({
    id: users.id,
    email: users.email,
    name: users.name,
    phone: users.phone,
    avatarUrl: users.avatarUrl,
    isActive: users.isActive,
    createdAt: users.createdAt,
  }).from(users).where(eq(users.id, id)).limit(1);

  if (!user) {
    throw new AppError(ErrorCode.NOT_FOUND, 'User not found');
  }
  return user;
}

export async function updateUser(id: string, data: { name?: string; phone?: string; avatarUrl?: string }) {
  const [user] = await db.update(users)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(users.id, id))
    .returning({
      id: users.id,
      email: users.email,
      name: users.name,
      phone: users.phone,
      avatarUrl: users.avatarUrl,
    });

  if (!user) {
    throw new AppError(ErrorCode.NOT_FOUND, 'User not found');
  }
  return user;
}

export async function getUserCommunities(userId: string) {
  return db.select().from(userCommunities).where(eq(userCommunities.userId, userId));
}
