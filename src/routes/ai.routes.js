import { Router } from 'express';
import { aiController } from '../controllers/ai.controller.js';

const router = Router();

router.post('/chat', aiController.chat);
router.post('/generate', aiController.generate);
router.post('/sentiment', aiController.sentiment);
router.post('/summarize', aiController.summarize);

export default router;

