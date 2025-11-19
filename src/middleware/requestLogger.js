import { logger } from '../utils/logger.js';

export function requestLogger(req, res, next) {
  const start = Date.now();
  const { method, url, ip } = req;

  res.on('finish', () => {
    const duration = Date.now() - start;
    const { statusCode } = res;
    // Only log slow requests or errors in production
    if (process.env.NODE_ENV === 'development' || duration > 1000 || statusCode >= 400) {
      logger.info(`${method} ${url} ${statusCode} - ${duration}ms`, { ip });
    }
  });

  next();
}

