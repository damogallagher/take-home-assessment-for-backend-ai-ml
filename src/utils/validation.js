import { z } from 'zod';
import { ValidationError } from './errors.js';

export function validate(schema, data) {
  try {
    return schema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new ValidationError('Validation failed', error.errors);
    }
    throw error;
  }
}

export const commonSchemas = {
  id: z.string().min(1),
  email: z.string().email(),
  url: z.string().url(),
  pagination: z.object({
    page: z.number().int().positive().default(1),
    limit: z.number().int().positive().max(100).default(10),
  }),
};

