import { Server, Socket } from 'socket.io';
import { prisma } from '@/lib/prisma.js';

import type { lastReadInput } from '../schemas.js';

export async function handleMessageRead(socket: Socket, payload: lastReadInput) {
  const { chatId, userId, messageId } = payload;
  try {
    const lastReadMessage = await prisma.chatMember.update({
      where: {
        chatId_userId: {
          chatId: chatId,
          userId: userId,
        },
      },
      data: {
        lastReadMessagesId: messageId,
      },
    });
    return { ok: true, lastReadMessage };
  } catch (error) {
    console.error('Error save message', error);
    throw error;

    // socket.emit('chat_error', {
    //   event: 'last-read-message',
    //   code: 'NOT_UPDATE_LAST_READ',
    //   message: 'Error update last read message',
    // });
  }
}
