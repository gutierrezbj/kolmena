import { type ErrorCode, ErrorHttpStatus } from './error-codes.js';

export class AppError extends Error {
  public readonly code: ErrorCode;
  public readonly statusCode: number;
  public readonly details?: unknown;

  constructor(code: ErrorCode, message: string, details?: unknown) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.statusCode = ErrorHttpStatus[code];
    this.details = details;
  }
}
