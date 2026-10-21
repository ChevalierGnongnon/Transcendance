import express from 'express';
import type { Request, Response } from 'express';

import { requireAuth } from '../auth/auth.middlewares.js';
import { validate } from './chat.middlewares.ts';
import { chatIdParamValidate, queryLimitValidate, userIdParamValidate } from './chat.validators.js';
import { getChatByUserId, getMyChats, messages, findChat, createChat } from './chat.controllers.js';

const router = express.Router();

router.get('/me/chats', requireAuth, getMyChats);
router.get(
  '/messages/:chatId',
  requireAuth,
  chatIdParamValidate,
  queryLimitValidate,
  validate,
  messages
);
router.get('/chats/with/:userId', requireAuth, userIdParamValidate, validate, getChatByUserId);
router.get('/chat/find', requireAuth, findChat);
router.post('/chat/create', requireAuth, createChat);

export default router;
