import express from 'express';
import type { Request, Response } from 'express';

import { requireAuth } from '../auth/auth.middlewares.js';
import { validateUuid } from './chat.validators.js';
import { getMyChats, messages } from './chat.controllers.js';

const router = express.Router();

router.get('/me/chats', requireAuth, getMyChats);
// router.get('/chats/:id', requireAuth, getUserChats);
// router.get('/chats/:userId/chats', requireAuth, getUserChats);
// router.get('/chats/:user_id');
router.get('/messages/:chatId', validateUuid, messages);
// router.get('/messages/:chat_id', messages);
export default router;
