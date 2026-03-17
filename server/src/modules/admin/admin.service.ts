import { sql, eq, count } from 'drizzle-orm';
import { db } from '../../shared/db/client.js';
import {
  users,
  communities,
  userCommunities,
  incidents,
  posts,
  polls,
  spaces,
  bookings,
} from '../../shared/db/schema.js';

export async function getDashboardStats() {
  const [[userCount], [communityCount], [incidentCount], [postCount], [pollCount], [bookingCount]] =
    await Promise.all([
      db.select({ value: count() }).from(users),
      db.select({ value: count() }).from(communities).where(eq(communities.isActive, true)),
      db.select({ value: count() }).from(incidents),
      db.select({ value: count() }).from(posts),
      db.select({ value: count() }).from(polls),
      db.select({ value: count() }).from(bookings),
    ]);

  return {
    users: userCount.value,
    communities: communityCount.value,
    incidents: incidentCount.value,
    posts: postCount.value,
    polls: pollCount.value,
    bookings: bookingCount.value,
  };
}

export async function getIncidentsByStatus() {
  const rows = await db
    .select({ status: incidents.status, count: count() })
    .from(incidents)
    .groupBy(incidents.status);
  return rows;
}

export async function getCommunitiesWithMembers() {
  const rows = await db
    .select({
      id: communities.id,
      name: communities.name,
      city: communities.city,
      tier: communities.tier,
      createdAt: communities.createdAt,
      memberCount: count(userCommunities.userId),
    })
    .from(communities)
    .leftJoin(userCommunities, eq(communities.id, userCommunities.communityId))
    .where(eq(communities.isActive, true))
    .groupBy(communities.id, communities.name, communities.city, communities.tier, communities.createdAt)
    .orderBy(communities.createdAt);
  return rows;
}

export async function getRecentIncidents(limit = 20) {
  const rows = await db
    .select({
      id: incidents.id,
      title: incidents.title,
      category: incidents.category,
      priority: incidents.priority,
      status: incidents.status,
      communityId: incidents.communityId,
      createdAt: incidents.createdAt,
    })
    .from(incidents)
    .orderBy(sql`${incidents.createdAt} DESC`)
    .limit(limit);
  return rows;
}
