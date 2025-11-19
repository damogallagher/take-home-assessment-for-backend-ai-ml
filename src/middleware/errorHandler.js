import { AppError } from '../utils/errors.js';
import { logger } from '../utils/logger.js';
import { sendError } from '../utils/response.js';

export function errorHandler(err, _req, res, _next) {
  if (err instanceof AppError) {
    logger.warn(`AppError: ${err.message}`, err);
    sendError(res, err.message, err.statusCode);
    return;
  }

  logger.error('Unhandled error', err);
  sendError(res, 'Internal server error', 500);
}

