/**
 * Health check script
 * Run with: npm run health-check or node src/scripts/health-check.js
 */

import { config } from '../config/env.js';
import { logger } from '../utils/logger.js';

async function healthCheck() {
  logger.info('Running health check...');
  
  const checks = {
    environment: config.nodeEnv,
    port: config.port,
    openaiConfigured: !!config.openaiApiKey,
    timestamp: new Date().toISOString(),
  };

  logger.info('Health check results:', checks);

  if (!checks.openaiConfigured) {
    logger.warn('OpenAI API key is not configured');
  }

  logger.info('Health check completed');
}

healthCheck();

