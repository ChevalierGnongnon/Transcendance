import express from 'express';
import type { Request, Response } from 'express';

import { requireAuth } from '../auth/auth.middlewares.js';
import { chatIdParamValidate, userIdParamValidate } from './chat.validators.js';
import { getChatByUserId, getMyChats, messages } from './chat.controllers.js';
import { validate } from './chat.middlewares.ts';

const router = express.Router();

router.get('/me/chats', requireAuth, getMyChats);
router.get('/messages/:chatId', requireAuth, chatIdParamValidate, validate, messages);
router.get('/chats/with/:userId', requireAuth, userIdParamValidate, validate, getChatByUserId);
// router.get('/chats/:id', requireAuth, getUserChats);
// router.get('/chats/:userId/chats', requireAuth, getUserChats);

export default router;
