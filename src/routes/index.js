import { Router } from 'express';
import aiRoutes from './ai.routes.js';
import userRoutes from './user.routes.js';
import cacheRoutes from './cache.routes.js';

const router = Router();

router.use('/ai', aiRoutes);
router.use('/users', userRoutes);
router.use('/cache', cacheRoutes);

export default router;

