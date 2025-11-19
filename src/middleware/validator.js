import { validate } from '../utils/validation.js';

const createValidator = (target) => (schema) => (req, _res, next) => {
  try {
    req[target] = validate(schema, req[target]);
    next();
  } catch (error) {
    next(error);
  }
};

export const validateBody = createValidator('body');
export const validateQuery = createValidator('query');
export const validateParams = createValidator('params');
