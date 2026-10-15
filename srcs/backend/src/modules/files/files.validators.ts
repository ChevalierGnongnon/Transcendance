import { body, param } from 'express-validator';

export const validateChatIdUuid = [
  param('chatId').notEmpty().withMessage('CHATID_REQUIRED').isUUID().withMessage('INVALID_CHATID.'),
];
