import type { FastifyInstance } from 'fastify';

export async function authRoutes(app: FastifyInstance) {
  app.get('/me', async (request) => {
    // TODO: implement with auth guard
    return { message: 'auth module ready' };
  });
}
