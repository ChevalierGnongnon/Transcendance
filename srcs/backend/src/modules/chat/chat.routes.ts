import express from 'express';
import type { Request, Response } from 'express';

import { requireAuth } from '../auth/auth.middlewares.js';
import { validate } from './chat.middlewares.ts';
import { chatIdParamValidate, userIdParamValidate } from './chat.validators.js';
import { getChatByUserId, getMyChats, messages } from './chat.controllers.js';

const router = express.Router();

router.get('/me/chats', requireAuth, getMyChats);
router.get('/messages/:chatId', requireAuth, chatIdParamValidate, validate, messages);
router.get('/chats/with/:userId', requireAuth, userIdParamValidate, validate, getChatByUserId);

export default router;
