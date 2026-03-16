import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { createCommunitySchema } from '@kolmena/shared';
import { authGuard } from '../../shared/middleware/auth-guard.js';
import {
  listCommunities,
  getCommunity,
  createCommunity,
  updateCommunity,
  getCommunityMembers,
} from './communities.service.js';
import { getUser, updateUser, getUserCommunities } from './users.service.js';

const idParam = z.object({ id: z.string().uuid() });

const updateCommunityBody = z.object({
  name: z.string().min(1).max(255).optional(),
  address: z.string().min(1).optional(),
  city: z.string().min(1).max(100).optional(),
  postalCode: z.string().regex(/^\d{5}$/).optional(),
  province: z.string().min(1).max(100).optional(),
  cif: z.string().optional(),
});

const updateUserBody = z.object({
  name: z.string().min(2).max(255).optional(),
  phone: z.string().max(20).optional(),
  avatarUrl: z.string().url().optional(),
});

export async function coreRoutes(app: FastifyInstance) {
  const typedApp = app.withTypeProvider<ZodTypeProvider>();

  // --- Communities ---

  // GET /api/v1/communities
  typedApp.get('/communities', {
    preHandler: [authGuard],
    schema: { tags: ['communities'] },
  }, async () => {
    return { communities: await listCommunities() };
  });

  // GET /api/v1/communities/:id
  typedApp.get('/communities/:id', {
    preHandler: [authGuard],
    schema: { params: idParam, tags: ['communities'] },
  }, async (request) => {
    const community = await getCommunity(request.params.id);
    return { community };
  });

  // POST /api/v1/communities
  typedApp.post('/communities', {
    preHandler: [authGuard],
    schema: { body: createCommunitySchema, tags: ['communities'] },
  }, async (request, reply) => {
    const community = await createCommunity(request.body, request.user!.id);
    return reply.status(201).send({ community });
  });

  // PATCH /api/v1/communities/:id
  typedApp.patch('/communities/:id', {
    preHandler: [authGuard],
    schema: { params: idParam, body: updateCommunityBody, tags: ['communities'] },
  }, async (request) => {
    const community = await updateCommunity(request.params.id, request.body);
    return { community };
  });

  // GET /api/v1/communities/:id/members
  typedApp.get('/communities/:id/members', {
    preHandler: [authGuard],
    schema: { params: idParam, tags: ['communities'] },
  }, async (request) => {
    const members = await getCommunityMembers(request.params.id);
    return { members };
  });

  // --- Users ---

  // GET /api/v1/users/:id
  typedApp.get('/users/:id', {
    preHandler: [authGuard],
    schema: { params: idParam, tags: ['users'] },
  }, async (request) => {
    const user = await getUser(request.params.id);
    return { user };
  });

  // PATCH /api/v1/users/:id
  typedApp.patch('/users/:id', {
    preHandler: [authGuard],
    schema: { params: idParam, body: updateUserBody, tags: ['users'] },
  }, async (request) => {
    const user = await updateUser(request.params.id, request.body);
    return { user };
  });

  // GET /api/v1/users/:id/communities
  typedApp.get('/users/:id/communities', {
    preHandler: [authGuard],
    schema: { params: idParam, tags: ['users'] },
  }, async (request) => {
    const communities = await getUserCommunities(request.params.id);
    return { communities };
  });
}
