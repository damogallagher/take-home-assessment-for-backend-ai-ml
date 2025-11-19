/**
 * Database seeding script
 * Run with: npm run seed or node src/scripts/seed.js
 */

import { userStore } from '../models/User.model.js';
import { logger } from '../utils/logger.js';

async function seed() {
  try {
    logger.info('Starting database seed...');

    // Create example users
    const users = [
      {
        email: 'admin@example.com',
        name: 'Admin User',
        password: 'securepassword123',
        role: 'admin',
      },
      {
        email: 'user@example.com',
        name: 'Regular User',
        password: 'securepassword123',
        role: 'user',
      },
    ];

    for (const userData of users) {
      const existingUser = await userStore.findByEmail(userData.email);
      if (!existingUser) {
        await userStore.create(userData);
        logger.info(`Created user: ${userData.email}`);
      } else {
        logger.info(`User already exists: ${userData.email}`);
      }
    }

    logger.info('Database seed completed successfully');
  } catch (error) {
    logger.error('Error seeding database', error);
    process.exit(1);
  }
}

seed();

