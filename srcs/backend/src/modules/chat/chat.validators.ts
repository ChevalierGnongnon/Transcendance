import { body, param } from 'express-validator';

export const userIdParamValidate = [
  param('userId').isUUID().withMessage('Invalid user ID format. Must be a valid UUID.'),
];

export const chatIdParamValidate = [
  param('chatId').isUUID().withMessage('Invalid chat ID format. Must be a valid UUID.'),
];
