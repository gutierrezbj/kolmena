import type { FastifyInstance } from 'fastify';
import { authGuard } from '../../shared/middleware/auth-guard.js';
import { uploadFile } from '../../services/storage.js';
import { AppError } from '../../shared/errors/app-error.js';
import { ErrorCode } from '../../shared/errors/error-codes.js';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/heic'];

export async function uploadRoutes(app: FastifyInstance) {
  app.addHook('preHandler', authGuard);

  // POST /api/v1/upload — multipart single file
  app.post('/', async (request, reply) => {
    const file = await request.file();

    if (!file) {
      throw new AppError(ErrorCode.VALIDATION_ERROR, 'No file provided');
    }

    if (!ALLOWED_TYPES.includes(file.mimetype)) {
      throw new AppError(
        ErrorCode.VALIDATION_ERROR,
        `File type not allowed. Accepted: ${ALLOWED_TYPES.join(', ')}`,
      );
    }

    const buffer = await file.toBuffer();

    if (buffer.length > MAX_FILE_SIZE) {
      throw new AppError(ErrorCode.VALIDATION_ERROR, 'File too large (max 10 MB)');
    }

    const url = await uploadFile(buffer, file.filename, file.mimetype);

    return reply.status(201).send({ url });
  });

  // POST /api/v1/upload/batch — multipart multiple files (max 5)
  app.post('/batch', async (request, reply) => {
    const parts = request.files();
    const urls: string[] = [];
    let count = 0;

    for await (const file of parts) {
      if (count >= 5) {
        throw new AppError(ErrorCode.VALIDATION_ERROR, 'Maximum 5 files per upload');
      }

      if (!ALLOWED_TYPES.includes(file.mimetype)) {
        throw new AppError(
          ErrorCode.VALIDATION_ERROR,
          `File type not allowed: ${file.filename}`,
        );
      }

      const buffer = await file.toBuffer();

      if (buffer.length > MAX_FILE_SIZE) {
        throw new AppError(ErrorCode.VALIDATION_ERROR, `File too large: ${file.filename}`);
      }

      const url = await uploadFile(buffer, file.filename, file.mimetype);
      urls.push(url);
      count++;
    }

    if (urls.length === 0) {
      throw new AppError(ErrorCode.VALIDATION_ERROR, 'No files provided');
    }

    return reply.status(201).send({ urls });
  });
}
