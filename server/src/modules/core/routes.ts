import type { FastifyInstance } from 'fastify';

export async function coreRoutes(app: FastifyInstance) {
  app.get('/communities', async () => {
    // TODO: implement community listing
    return { message: 'core module ready' };
  });
}
