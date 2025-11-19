import crypto from 'crypto';

/**
 * Request ID middleware - generates a unique UUID for each request
 * Enables distributed tracing and log correlation across the request lifecycle
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export function requestIdMiddleware(req, res, next) {
  // Generate unique RFC 4122 compliant UUID v4
  const requestId = crypto.randomUUID();

  // Attach to request object for use in controllers and other middleware
  req.requestId = requestId;

  // Add to response headers for client tracking and support correlation
  res.setHeader('X-Request-ID', requestId);

  next();
}
