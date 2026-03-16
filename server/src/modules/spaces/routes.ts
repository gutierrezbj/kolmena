import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { authGuard } from '../../shared/middleware/auth-guard.js';
import { listSpaces, getSpace, createSpace, updateSpace, listBookings, createBooking, cancelBooking } from './spaces.service.js';

const communityParam = z.object({ communityId: z.string().uuid() });
const idParam = z.object({ id: z.string().uuid() });

const createSpaceBody = z.object({
  name: z.string().min(1).max(255),
  description: z.string().optional(),
  maxCapacity: z.number().int().positive().optional(),
  rules: z.string().optional(),
});

const updateSpaceBody = z.object({
  name: z.string().min(1).max(255).optional(),
  description: z.string().optional(),
  maxCapacity: z.number().int().positive().optional(),
  rules: z.string().optional(),
  isActive: z.boolean().optional(),
});

const createBookingBody = z.object({
  spaceId: z.string().uuid(),
  startsAt: z.string().datetime(),
  endsAt: z.string().datetime(),
  note: z.string().optional(),
});

export async function spacesRoutes(app: FastifyInstance) {
  const typedApp = app.withTypeProvider<ZodTypeProvider>();
  typedApp.addHook('preHandler', authGuard);

  // --- Spaces ---

  typedApp.get('/communities/:communityId/spaces', {
    schema: { params: communityParam, tags: ['spaces'] },
  }, async (request) => {
    return { spaces: await listSpaces(request.params.communityId) };
  });

  typedApp.post('/communities/:communityId/spaces', {
    schema: { params: communityParam, body: createSpaceBody, tags: ['spaces'] },
  }, async (request, reply) => {
    const space = await createSpace(request.params.communityId, request.body);
    return reply.status(201).send({ space });
  });

  typedApp.get('/spaces/:id', {
    schema: { params: idParam, tags: ['spaces'] },
  }, async (request) => {
    return { space: await getSpace(request.params.id) };
  });

  typedApp.patch('/spaces/:id', {
    schema: { params: idParam, body: updateSpaceBody, tags: ['spaces'] },
  }, async (request) => {
    return { space: await updateSpace(request.params.id, request.body) };
  });

  // --- Bookings ---

  typedApp.get('/communities/:communityId/bookings', {
    schema: {
      params: communityParam,
      querystring: z.object({ spaceId: z.string().uuid().optional() }),
      tags: ['spaces'],
    },
  }, async (request) => {
    return { bookings: await listBookings(request.params.communityId, request.query.spaceId) };
  });

  typedApp.post('/communities/:communityId/bookings', {
    schema: { params: communityParam, body: createBookingBody, tags: ['spaces'] },
  }, async (request, reply) => {
    const booking = await createBooking(request.params.communityId, request.user!.id, request.body);
    return reply.status(201).send({ booking });
  });

  typedApp.patch('/bookings/:id/cancel', {
    schema: { params: idParam, tags: ['spaces'] },
  }, async (request) => {
    return { booking: await cancelBooking(request.params.id, request.user!.id) };
  });
}
