import type { FastifyReply, FastifyRequest } from 'fastify';
import { AppError } from '../errors/app-error.js';
import { ErrorCode } from '../errors/error-codes.js';

export async function authGuard(request: FastifyRequest, _reply: FastifyReply) {
  const authHeader = request.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    throw new AppError(ErrorCode.UNAUTHORIZED, 'Missing or invalid authorization header');
  }

  // TODO: verify JWT and attach user to request
  // const token = authHeader.slice(7);
  // request.user = await verifyToken(token);
}
