import type { Request, Response } from 'express';

import { NotFoundError } from '../../common/errors.js';
import chatServices from './chat.services.js';
import { validationResult } from 'express-validator';

export interface MessageReq {
  chat_id: string;
  sender_id: string;
  profilePhoto: string;
  content: string;
}

export async function messages(req: Request<{ chatId: string }>, res: Response) {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'uuid not valid',
      });
    }

    const chatId = req.params.chatId;
    if (!chatId) {
      return res.status(400).json({ error: 'chatId is isEmpty' });
    }

    const messages = await chatServices.getMessagesByChatId(chatId);

    return res.status(200).json(messages);
  } catch (error) {
    if (error instanceof NotFoundError) {
      return res.status(404).json({
        error: 'USER_NOT_FOUND',
      });
    }

    return res.status(500).json({
      error: 'INTERNAL_SERVER_ERROR',
    });
  }
}

export async function getMyChats(req: Request, res: Response) {
  try {
    const userId = req.userId!;
    const chats = await chatServices.getChatsByUser(userId);

    return res.status(200).json(chats);
  } catch (error) {
    if (error instanceof NotFoundError) {
      return res.status(404).json({
        error: 'USER_NOT_FOUND',
      });
    }

    return res.status(500).json({
      error: 'INTERNAL_SERVER_ERROR',
    });
  }
}
