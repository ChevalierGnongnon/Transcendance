import type { Request, Response } from 'express';
import { prisma } from '../../lib/prisma.js';


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

export async function findChat(req: Request, res: Response) {
  try {
    const user1 = req.query.user1 as string;
    const user2 = req.query.user2 as string;

    if (!user1 || !user2) {
      return res.status(400).json({ error: "Missing user1 or user2" });
    }

    // 1. Find all chats where user1 is a member
    const chats = await prisma.chatMember.findMany({
      where: { userId: user1 },
      select: { chatId: true }
    });

    if (chats.length === 0) {
      return res.json({ chatId: null });
    }

    // 2. Check if user2 is also a member of any of these chats
    for (const c of chats) {
      const member2 = await prisma.chatMember.findFirst({
        where: {
          chatId: c.chatId,
          userId: user2
        }
      });

      if (member2) {
        return res.json({ chatId: c.chatId });
      }
    }

    return res.json({ chatId: null });
  } catch (err) {
    console.error("findChat error:", err);
    return res.status(500).json({ error: "INTERNAL_SERVER_ERROR" });
  }
}




export async function createChat(req: Request, res: Response) {
  try {
    const { user1, user2 } = req.body;

    if (!user1 || !user2) {
      return res.status(400).json({ error: "Missing user1 or user2" });
    }

    // 1. Create chat
    const chat = await prisma.chat.create({
      data: {}
    });

    // 2. Add members
    await prisma.chatMember.createMany({
      data: [
        { chatId: chat.id, userId: user1 },
        { chatId: chat.id, userId: user2 }
      ]
    });

    return res.json({ chatId: chat.id });
  } catch (err) {
    console.error("createChat error:", err);
    return res.status(500).json({ error: "INTERNAL_SERVER_ERROR" });
  }
}


