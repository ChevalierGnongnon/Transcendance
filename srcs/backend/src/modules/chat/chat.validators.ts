import { body, param } from 'express-validator';

export const validateUuid = [
  param('chatId').isUUID().withMessage('Invalid chat ID format. Must be a valid UUID.'),
];
