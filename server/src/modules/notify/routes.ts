import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { authGuard } from '../../shared/middleware/auth-guard.js';
import { listNotifications, getUnreadCount, markAsRead, markAllAsRead } from './notify.service.js';

const idParam = z.object({ id: z.string().uuid() });

export async function notifyRoutes(app: FastifyInstance) {
  const typedApp = app.withTypeProvider<ZodTypeProvider>();
  typedApp.addHook('preHandler', authGuard);

  typedApp.get('/notifications', {
    schema: {
      querystring: z.object({ communityId: z.string().uuid().optional() }),
      tags: ['notifications'],
    },
  }, async (request) => {
    const items = await listNotifications(request.user!.id, request.query.communityId);
    const unread = await getUnreadCount(request.user!.id);
    return { notifications: items, unread };
  });

  typedApp.patch('/notifications/:id/read', {
    schema: { params: idParam, tags: ['notifications'] },
  }, async (request) => {
    return { notification: await markAsRead(request.params.id, request.user!.id) };
  });

  typedApp.post('/notifications/read-all', {
    schema: { tags: ['notifications'] },
  }, async (request, reply) => {
    await markAllAsRead(request.user!.id);
    return reply.status(204).send();
  });
}
