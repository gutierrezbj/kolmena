import { pgTable, uuid, varchar, text, timestamp, boolean, pgEnum, integer } from 'drizzle-orm/pg-core';

export const userRoleEnum = pgEnum('user_role', [
  'admin',
  'president',
  'resident',
  'provider',
  'inquiry',
]);

export const subscriptionTierEnum = pgEnum('subscription_tier', ['free', 'basic', 'pro']);

export const incidentStatusEnum = pgEnum('incident_status', [
  'open',
  'assigned',
  'in_progress',
  'waiting_parts',
  'resolved',
  'closed',
]);

export const incidentPriorityEnum = pgEnum('incident_priority', ['low', 'medium', 'high', 'urgent']);

export const incidentCategoryEnum = pgEnum('incident_category', [
  'plumbing',
  'electrical',
  'elevator',
  'structural',
  'cleaning',
  'garden',
  'security',
  'other',
]);

// -- Public schema: shared across all tenants --

export const users = pgTable('users', {
  id: uuid('id').primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  passwordHash: varchar('password_hash', { length: 255 }),
  name: varchar('name', { length: 255 }).notNull(),
  phone: varchar('phone', { length: 20 }),
  avatarUrl: text('avatar_url'),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

export const refreshTokens = pgTable('refresh_tokens', {
  id: uuid('id').primaryKey(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  tokenHash: varchar('token_hash', { length: 255 }).notNull(),
  expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

export const communities = pgTable('communities', {
  id: uuid('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  address: text('address').notNull(),
  city: varchar('city', { length: 100 }).notNull(),
  postalCode: varchar('postal_code', { length: 10 }).notNull(),
  province: varchar('province', { length: 100 }).notNull(),
  cif: varchar('cif', { length: 20 }),
  schemaName: varchar('schema_name', { length: 63 }).notNull().unique(),
  tier: subscriptionTierEnum('tier').notNull().default('free'),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

export const userCommunities = pgTable('user_communities', {
  id: uuid('id').primaryKey(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id),
  communityId: uuid('community_id')
    .notNull()
    .references(() => communities.id),
  role: userRoleEnum('role').notNull().default('resident'),
  joinedAt: timestamp('joined_at', { withTimezone: true }).notNull().defaultNow(),
});

// -- Fix module: incidents & comments --

export const incidents = pgTable('incidents', {
  id: uuid('id').primaryKey(),
  communityId: uuid('community_id')
    .notNull()
    .references(() => communities.id),
  reporterId: uuid('reporter_id')
    .notNull()
    .references(() => users.id),
  assigneeId: uuid('assignee_id')
    .references(() => users.id),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description').notNull(),
  category: incidentCategoryEnum('category').notNull().default('other'),
  priority: incidentPriorityEnum('priority').notNull().default('medium'),
  status: incidentStatusEnum('status').notNull().default('open'),
  location: varchar('location', { length: 255 }),
  imageUrls: text('image_urls'),
  resolvedAt: timestamp('resolved_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

export const incidentComments = pgTable('incident_comments', {
  id: uuid('id').primaryKey(),
  incidentId: uuid('incident_id')
    .notNull()
    .references(() => incidents.id, { onDelete: 'cascade' }),
  authorId: uuid('author_id')
    .notNull()
    .references(() => users.id),
  body: text('body').notNull(),
  isInternal: boolean('is_internal').notNull().default(false),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

export const incidentStatusLog = pgTable('incident_status_log', {
  id: uuid('id').primaryKey(),
  incidentId: uuid('incident_id')
    .notNull()
    .references(() => incidents.id, { onDelete: 'cascade' }),
  changedById: uuid('changed_by_id')
    .notNull()
    .references(() => users.id),
  fromStatus: incidentStatusEnum('from_status').notNull(),
  toStatus: incidentStatusEnum('to_status').notNull(),
  note: text('note'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});
