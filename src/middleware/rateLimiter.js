import { rateLimiter } from '../utils/rateLimiter.js';
import { sendError } from '../utils/response.js';

export function rateLimitMiddleware(req, res, next) {
  const identifier = req.ip || req.socket.remoteAddress || 'unknown';
  const result = rateLimiter.isAllowed(identifier);

  res.setHeader('X-RateLimit-Limit', '100');
  res.setHeader('X-RateLimit-Remaining', result.remaining.toString());
  res.setHeader('X-RateLimit-Reset', new Date(result.resetTime).toISOString());

  if (!result.allowed) {
    return sendError(res, 'Too many requests. Please try again later.', 429);
  }

  next();
}

