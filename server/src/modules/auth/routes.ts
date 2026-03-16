import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { registerUser, loginUser, rotateRefreshToken } from './auth.service.js';
import { authGuard } from '../../shared/middleware/auth-guard.js';

const registerBody = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(128),
  name: z.string().min(2).max(255),
});

const loginBody = z.object({
  email: z.string().email(),
  password: z.string(),
});

const refreshBody = z.object({
  refreshToken: z.string(),
});

export async function authRoutes(app: FastifyInstance) {
  const typedApp = app.withTypeProvider<ZodTypeProvider>();

  // POST /api/v1/auth/register
  typedApp.post('/register', {
    schema: { body: registerBody, tags: ['auth'] },
  }, async (request, reply) => {
    const { email, password, name } = request.body;
    const user = await registerUser(email, password, name);
    return reply.status(201).send({ id: user!.id, email: user!.email, name: user!.name });
  });

  // POST /api/v1/auth/login
  typedApp.post('/login', {
    schema: { body: loginBody, tags: ['auth'] },
  }, async (request) => {
    const { email, password } = request.body;
    const result = await loginUser(email, password);
    return {
      user: result.user,
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
    };
  });

  // POST /api/v1/auth/refresh
  typedApp.post('/refresh', {
    schema: { body: refreshBody, tags: ['auth'] },
  }, async (request) => {
    const { refreshToken } = request.body;
    const tokens = await rotateRefreshToken(refreshToken);
    return tokens;
  });

  // GET /api/v1/auth/me
  typedApp.get('/me', {
    preHandler: [authGuard],
    schema: { tags: ['auth'] },
  }, async (request) => {
    return { user: request.user };
  });
}
