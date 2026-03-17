import type { FastifyInstance } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { authGuard } from '../../shared/middleware/auth-guard.js';
import {
  getDashboardStats,
  getIncidentsByStatus,
  getCommunitiesWithMembers,
  getRecentIncidents,
} from './admin.service.js';

export async function adminRoutes(app: FastifyInstance) {
  const typedApp = app.withTypeProvider<ZodTypeProvider>();

  // GET /api/v1/admin/stats
  typedApp.get('/stats', {
    preHandler: [authGuard],
    schema: { tags: ['admin'] },
  }, async () => {
    return { stats: await getDashboardStats() };
  });

  // GET /api/v1/admin/incidents/by-status
  typedApp.get('/incidents/by-status', {
    preHandler: [authGuard],
    schema: { tags: ['admin'] },
  }, async () => {
    return { breakdown: await getIncidentsByStatus() };
  });

  // GET /api/v1/admin/communities
  typedApp.get('/communities', {
    preHandler: [authGuard],
    schema: { tags: ['admin'] },
  }, async () => {
    return { communities: await getCommunitiesWithMembers() };
  });

  // GET /api/v1/admin/incidents/recent
  typedApp.get('/incidents/recent', {
    preHandler: [authGuard],
    schema: { tags: ['admin'] },
  }, async () => {
    return { incidents: await getRecentIncidents() };
  });
}
