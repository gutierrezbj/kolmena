import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { authGuard } from '../../shared/middleware/auth-guard.js';
import {
  listIncidents,
  getIncident,
  createIncident,
  updateIncidentStatus,
  assignIncident,
  listComments,
  addComment,
  getStatusLog,
} from './fix.service.js';

const communityParam = z.object({ communityId: z.string().uuid() });
const idParam = z.object({ id: z.string().uuid() });

const createBody = z.object({
  title: z.string().min(3).max(255),
  description: z.string().min(5),
  category: z.enum(['plumbing', 'electrical', 'elevator', 'structural', 'cleaning', 'garden', 'security', 'other']).optional(),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).optional(),
  location: z.string().max(255).optional(),
});

const statusBody = z.object({
  status: z.enum(['open', 'assigned', 'in_progress', 'waiting_parts', 'resolved', 'closed']),
  note: z.string().optional(),
});

const assignBody = z.object({
  assigneeId: z.string().uuid(),
});

const commentBody = z.object({
  body: z.string().min(1),
  isInternal: z.boolean().optional(),
});

export async function fixRoutes(app: FastifyInstance) {
  const typedApp = app.withTypeProvider<ZodTypeProvider>();

  // All fix routes require auth
  typedApp.addHook('preHandler', authGuard);

  // GET /api/v1/fix/communities/:communityId/incidents
  typedApp.get('/communities/:communityId/incidents', {
    schema: { params: communityParam, tags: ['fix'] },
  }, async (request) => {
    const list = await listIncidents(request.params.communityId);
    return { incidents: list };
  });

  // POST /api/v1/fix/communities/:communityId/incidents
  typedApp.post('/communities/:communityId/incidents', {
    schema: { params: communityParam, body: createBody, tags: ['fix'] },
  }, async (request, reply) => {
    const incident = await createIncident(
      request.params.communityId,
      request.user!.id,
      request.body,
    );
    return reply.status(201).send({ incident });
  });

  // GET /api/v1/fix/incidents/:id
  typedApp.get('/incidents/:id', {
    schema: { params: idParam, tags: ['fix'] },
  }, async (request) => {
    const incident = await getIncident(request.params.id);
    return { incident };
  });

  // PATCH /api/v1/fix/incidents/:id/status
  typedApp.patch('/incidents/:id/status', {
    schema: { params: idParam, body: statusBody, tags: ['fix'] },
  }, async (request) => {
    const incident = await updateIncidentStatus(
      request.params.id,
      request.body.status,
      request.user!.id,
      request.body.note,
    );
    return { incident };
  });

  // PATCH /api/v1/fix/incidents/:id/assign
  typedApp.patch('/incidents/:id/assign', {
    schema: { params: idParam, body: assignBody, tags: ['fix'] },
  }, async (request) => {
    const incident = await assignIncident(
      request.params.id,
      request.body.assigneeId,
      request.user!.id,
    );
    return { incident };
  });

  // GET /api/v1/fix/incidents/:id/comments
  typedApp.get('/incidents/:id/comments', {
    schema: { params: idParam, tags: ['fix'] },
  }, async (request) => {
    const comments = await listComments(request.params.id);
    return { comments };
  });

  // POST /api/v1/fix/incidents/:id/comments
  typedApp.post('/incidents/:id/comments', {
    schema: { params: idParam, body: commentBody, tags: ['fix'] },
  }, async (request, reply) => {
    const comment = await addComment(
      request.params.id,
      request.user!.id,
      request.body.body,
      request.body.isInternal,
    );
    return reply.status(201).send({ comment });
  });

  // GET /api/v1/fix/incidents/:id/log
  typedApp.get('/incidents/:id/log', {
    schema: { params: idParam, tags: ['fix'] },
  }, async (request) => {
    const log = await getStatusLog(request.params.id);
    return { log };
  });
}
