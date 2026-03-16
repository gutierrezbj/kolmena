import { eq, and, desc, sql } from 'drizzle-orm';
import { db } from '../../shared/db/client.js';
import { posts, polls, pollOptions, pollVotes } from '../../shared/db/schema.js';
import { generateId } from '../../shared/utils/uuid.js';
import { AppError } from '../../shared/errors/app-error.js';
import { ErrorCode } from '../../shared/errors/error-codes.js';

type PostType = 'announcement' | 'general' | 'event';

// --- Posts ---

export async function listPosts(communityId: string) {
  return db.select().from(posts)
    .where(eq(posts.communityId, communityId))
    .orderBy(desc(posts.isPinned), desc(posts.createdAt));
}

export async function getPost(id: string) {
  const [post] = await db.select().from(posts).where(eq(posts.id, id)).limit(1);
  if (!post) throw new AppError(ErrorCode.NOT_FOUND, 'Post not found');
  return post;
}

export async function createPost(communityId: string, authorId: string, data: { title: string; body: string; type?: PostType; isPinned?: boolean }) {
  const [post] = await db.insert(posts).values({
    id: generateId(),
    communityId,
    authorId,
    title: data.title,
    body: data.body,
    type: data.type ?? 'general',
    isPinned: data.isPinned ?? false,
  }).returning();
  return post;
}

export async function updatePost(id: string, data: { title?: string; body?: string; isPinned?: boolean }) {
  const [post] = await db.update(posts)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(posts.id, id))
    .returning();
  if (!post) throw new AppError(ErrorCode.NOT_FOUND, 'Post not found');
  return post;
}

export async function deletePost(id: string) {
  const [post] = await db.delete(posts).where(eq(posts.id, id)).returning();
  if (!post) throw new AppError(ErrorCode.NOT_FOUND, 'Post not found');
}

// --- Polls ---

export async function listPolls(communityId: string) {
  return db.select().from(polls)
    .where(eq(polls.communityId, communityId))
    .orderBy(desc(polls.createdAt));
}

export async function getPollWithOptions(id: string) {
  const [poll] = await db.select().from(polls).where(eq(polls.id, id)).limit(1);
  if (!poll) throw new AppError(ErrorCode.NOT_FOUND, 'Poll not found');

  const options = await db.select().from(pollOptions)
    .where(eq(pollOptions.pollId, id))
    .orderBy(pollOptions.sortOrder);

  // Count votes per option
  const voteCounts = await db.select({
    optionId: pollVotes.optionId,
    count: sql<number>`count(*)::int`,
  }).from(pollVotes)
    .where(eq(pollVotes.pollId, id))
    .groupBy(pollVotes.optionId);

  const voteMap = new Map(voteCounts.map(v => [v.optionId, v.count]));

  return {
    ...poll,
    options: options.map(o => ({
      ...o,
      votes: voteMap.get(o.id) ?? 0,
    })),
  };
}

export async function createPoll(
  communityId: string,
  authorId: string,
  data: { question: string; options: string[]; endsAt?: string },
) {
  if (data.options.length < 2) {
    throw new AppError(ErrorCode.VALIDATION_ERROR, 'Poll needs at least 2 options');
  }

  const pollId = generateId();
  const [poll] = await db.insert(polls).values({
    id: pollId,
    communityId,
    authorId,
    question: data.question,
    endsAt: data.endsAt ? new Date(data.endsAt) : null,
  }).returning();

  const optionValues = data.options.map((label, i) => ({
    id: generateId(),
    pollId,
    label,
    sortOrder: i,
  }));
  const createdOptions = await db.insert(pollOptions).values(optionValues).returning();

  return { ...poll, options: createdOptions.map(o => ({ ...o, votes: 0 })) };
}

export async function votePoll(pollId: string, optionId: string, voterId: string) {
  // Verify poll exists and is active
  const [poll] = await db.select().from(polls).where(eq(polls.id, pollId)).limit(1);
  if (!poll) throw new AppError(ErrorCode.NOT_FOUND, 'Poll not found');
  if (poll.status !== 'active') throw new AppError(ErrorCode.VALIDATION_ERROR, 'Poll is not active');
  if (poll.endsAt && poll.endsAt < new Date()) {
    throw new AppError(ErrorCode.VALIDATION_ERROR, 'Poll has ended');
  }

  // Check option belongs to poll
  const [option] = await db.select().from(pollOptions)
    .where(and(eq(pollOptions.id, optionId), eq(pollOptions.pollId, pollId)))
    .limit(1);
  if (!option) throw new AppError(ErrorCode.NOT_FOUND, 'Option not found in this poll');

  // Check for existing vote (one vote per user per poll)
  const existing = await db.select({ id: pollVotes.id }).from(pollVotes)
    .where(and(eq(pollVotes.pollId, pollId), eq(pollVotes.voterId, voterId)))
    .limit(1);
  if (existing.length > 0) {
    throw new AppError(ErrorCode.CONFLICT, 'Already voted in this poll');
  }

  const [vote] = await db.insert(pollVotes).values({
    id: generateId(),
    pollId,
    optionId,
    voterId,
  }).returning();
  return vote;
}

export async function closePoll(pollId: string) {
  const [poll] = await db.update(polls)
    .set({ status: 'closed' })
    .where(eq(polls.id, pollId))
    .returning();
  if (!poll) throw new AppError(ErrorCode.NOT_FOUND, 'Poll not found');
  return poll;
}
