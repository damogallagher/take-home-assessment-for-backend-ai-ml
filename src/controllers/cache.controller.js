import { cacheService } from '../services/cache.service.js';
import { sendSuccess } from '../utils/response.js';
import { asyncHandler } from '../middleware/asyncHandler.js';

/**
 * Cache Controller
 * Handles cache-related endpoints for monitoring and observability
 */
export const cacheController = {
  /**
   * Get cache statistics
   * @route GET /api/cache/stats
   * @returns {Object} Cache statistics including size, TTL, hits, misses, and hit rate
   */
  getStats: asyncHandler(async (_req, res) => {
    const stats = cacheService.getStats();
    sendSuccess(res, stats, 'Cache statistics retrieved successfully');
  }),
};
