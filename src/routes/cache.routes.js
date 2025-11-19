import { Router } from 'express';
import { cacheController } from '../controllers/cache.controller.js';

const router = Router();

/**
 * Cache Routes
 * Provides endpoints for cache monitoring and statistics
 */

// GET /api/cache/stats - Retrieve cache statistics
router.get('/stats', cacheController.getStats);

export default router;
