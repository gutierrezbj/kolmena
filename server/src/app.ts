import Fastify from 'fastify';
import {
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider,
} from 'fastify-type-provider-zod';
import { env } from './config/env.js';
import { registerCors } from './plugins/cors.js';
import { registerRateLimit } from './plugins/rate-limit.js';
import { registerSwagger } from './plugins/swagger.js';
import { errorHandler } from './shared/middleware/error-handler.js';
import { logger } from './shared/utils/logger.js';

// Module routes
import { authRoutes } from './modules/auth/routes.js';
import { coreRoutes } from './modules/core/routes.js';
import { fixRoutes } from './modules/fix/routes.js';
import { socialRoutes } from './modules/social/routes.js';

export async function buildApp() {
  const app = Fastify({
    logger: false, // we use our own pino instance
    genReqId: () => crypto.randomUUID(),
    requestTimeout: 30_000,
  }).withTypeProvider<ZodTypeProvider>();

  app.setValidatorCompiler(validatorCompiler);
  app.setSerializerCompiler(serializerCompiler);
  app.setErrorHandler(errorHandler);

  // Plugins
  await registerCors(app);
  await registerRateLimit(app);
  if (env.NODE_ENV !== 'production') {
    await registerSwagger(app);
  }

  // Request logging
  app.addHook('onRequest', async (request) => {
    logger.info({ method: request.method, url: request.url, id: request.id }, 'incoming request');
  });

  app.addHook('onResponse', async (request, reply) => {
    logger.info(
      { method: request.method, url: request.url, statusCode: reply.statusCode, id: request.id },
      'request completed',
    );
  });

  // Health check
  app.get('/health', async () => ({ status: 'ok', timestamp: new Date().toISOString() }));

  // Module routes
  await app.register(authRoutes, { prefix: '/api/v1/auth' });
  await app.register(coreRoutes, { prefix: '/api/v1' });
  await app.register(fixRoutes, { prefix: '/api/v1/fix' });
  await app.register(socialRoutes, { prefix: '/api/v1/social' });

  return app;
}
