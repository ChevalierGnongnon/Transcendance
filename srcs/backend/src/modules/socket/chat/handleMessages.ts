import { Server, Socket } from 'socket.io';
import { prisma } from '@/lib/prisma.js';

import type { newMessageInput } from '../schemas.js';

export async function handleMessages(socket: Socket, payload: newMessageInput) {
  const { chatId, recipientId, sender, content } = payload;
  try {
    const chat = await prisma.chat.findFirst({
      where: {
        id: chatId,
        members: { every: { userId: { in: [sender.id, recipientId] } } },
      },
      include: {
        members: {
          select: { userId: true },
        },
      },
    });

    if (!chat) throw new Error('Chat not found or access denied');

    const savedMessage = await prisma.message.create({
      data: { chatId, senderId: sender.id, content },
      select: {
        id: true,
        chatId: true,
        content: true,
        createdAt: true,
        sender: {
          select: {
            id: true,
            pseudo: true,
            profilePhoto: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

    if (!savedMessage) throw new Error('Can not save message');
    console.log(savedMessage);

    socket.to(`user-${recipientId}`).emit('new-chat-message', savedMessage);

    return 'Message saved and send to recipient';
  } catch (error) {
    console.error('Error save message', error);

    throw new Error('Error sending message, save in DB');

    // return {
    //   ok: false,
    //   data: {
    //     event: 'new-chat-message',
    //     code: 'DB_SAVE_ERROR',
    //     message: 'Error sending message, save in DB',
    //   },
    // };
  }
}
