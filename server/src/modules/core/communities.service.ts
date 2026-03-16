import { eq } from 'drizzle-orm';
import { db } from '../../shared/db/client.js';
import { communities, userCommunities } from '../../shared/db/schema.js';
import { generateId } from '../../shared/utils/uuid.js';
import { AppError } from '../../shared/errors/app-error.js';
import { ErrorCode } from '../../shared/errors/error-codes.js';
import type { CreateCommunity } from '@kolmena/shared';

function toSchemaName(name: string): string {
  return `tenant_${name.toLowerCase().replace(/[^a-z0-9]/g, '_').replace(/_+/g, '_').slice(0, 50)}`;
}

export async function listCommunities() {
  return db.select().from(communities).where(eq(communities.isActive, true));
}

export async function getCommunity(id: string) {
  const [community] = await db.select().from(communities).where(eq(communities.id, id)).limit(1);
  if (!community) {
    throw new AppError(ErrorCode.NOT_FOUND, 'Community not found');
  }
  return community;
}

export async function createCommunity(data: CreateCommunity, creatorId: string) {
  const id = generateId();
  const schemaName = toSchemaName(data.name);

  const [community] = await db.insert(communities).values({
    id,
    ...data,
    schemaName,
  }).returning();

  // Add creator as president of the new community
  await db.insert(userCommunities).values({
    id: generateId(),
    userId: creatorId,
    communityId: id,
    role: 'president',
  });

  return community;
}

export async function updateCommunity(id: string, data: Partial<CreateCommunity>) {
  const [community] = await db.update(communities)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(communities.id, id))
    .returning();

  if (!community) {
    throw new AppError(ErrorCode.NOT_FOUND, 'Community not found');
  }
  return community;
}

export async function getCommunityMembers(communityId: string) {
  return db.select().from(userCommunities).where(eq(userCommunities.communityId, communityId));
}
