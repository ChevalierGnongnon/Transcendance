import { body, param, query } from 'express-validator';

export const chatIdParamValidate = [
  param('chatId').isUUID().withMessage('Invalid chat ID format. Must be a valid UUID.'),
];

export const userIdParamValidate = [
  param('userId').isUUID().withMessage('Invalid user ID format. Must be a valid UUID.'),
];

export const queryLimitValidate = [
  query('limit')
    .optional()
    .isInt({ min: 1, max: 500 })
    .toInt()
    .withMessage('query is 0 or too long'),
];
