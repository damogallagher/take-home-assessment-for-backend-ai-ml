import { userStore } from '../models/User.model.js';
import { sendSuccess } from '../utils/response.js';
import { validate } from '../utils/validation.js';
import { z } from 'zod';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { NotFoundError, ValidationError } from '../utils/errors.js';
import { commonSchemas } from '../utils/validation.js';

const createUserSchema = z.object({
  email: commonSchemas.email,
  name: z.string().min(1).max(100),
  password: z.string().min(8),
  role: z.enum(['user', 'admin']).optional(),
});

const updateUserSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  email: commonSchemas.email.optional(),
  role: z.enum(['user', 'admin']).optional(),
});

export const userController = {
  getAll: asyncHandler(async (_req, res) => {
    const users = await userStore.findAll();
    sendSuccess(res, users, 'Users retrieved successfully');
  }),

  getById: asyncHandler(async (req, res) => {
    const user = await userStore.findById(req.params.id);
    if (!user) throw new NotFoundError('User');
    sendSuccess(res, user, 'User retrieved successfully');
  }),

  create: asyncHandler(async (req, res) => {
    const data = validate(createUserSchema, req.body);
    const user = await userStore.create(data);
    if (!user) throw new ValidationError('Email already exists');
    sendSuccess(res, user, 'User created successfully', 201);
  }),

  update: asyncHandler(async (req, res) => {
    const user = await userStore.update(req.params.id, validate(updateUserSchema, req.body));
    if (!user) throw new NotFoundError('User');
    sendSuccess(res, user, 'User updated successfully');
  }),

  delete: asyncHandler(async (req, res) => {
    const deleted = await userStore.delete(req.params.id);
    if (!deleted) throw new NotFoundError('User');
    sendSuccess(res, { id: req.params.id }, 'User deleted successfully');
  }),
};
