import type { FastifyError, FastifyReply, FastifyRequest } from 'fastify';
import { ZodError } from 'zod';
import { AppError } from '../errors/app-error.js';
import { ErrorCode } from '../errors/error-codes.js';
import { logger } from '../utils/logger.js';

export function errorHandler(error: FastifyError, request: FastifyRequest, reply: FastifyReply) {
  const correlationId = request.id;

  if (error instanceof AppError) {
    logger.warn({ code: error.code, message: error.message, correlationId }, 'App error');
    return reply.status(error.statusCode).send({
      error: error.code,
      message: error.message,
      details: error.details,
      correlationId,
    });
  }

  if (error instanceof ZodError) {
    logger.warn({ issues: error.issues, correlationId }, 'Validation error');
    return reply.status(400).send({
      error: ErrorCode.VALIDATION_ERROR,
      message: 'Validation failed',
      details: error.flatten(),
      correlationId,
    });
  }

  logger.error({ err: error, correlationId }, 'Unhandled error');
  return reply.status(500).send({
    error: ErrorCode.INTERNAL_ERROR,
    message: 'Internal server error',
    correlationId,
  });
}
