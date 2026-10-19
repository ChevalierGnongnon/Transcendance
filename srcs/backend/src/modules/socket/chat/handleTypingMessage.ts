import { Server, Socket } from 'socket.io';
import { prisma } from '@/lib/prisma.js';

import type { typingMessage } from '../schemas.js';

export async function startTypingMessage(socket: Socket, payload: typingMessage) {
  const { from, to, chatId } = payload;

  if (!socket.userId || socket.userId !== from) {
    throw new Error('Not authorized');
  }

  const isblocked = await prisma.block.findFirst({
    where: {
      OR: [
        { blockerId: from, blockedId: to },
        { blockerId: to, blockedId: from },
      ],
    },
  });

  if (isblocked) throw new Error('You are blocked');

  socket.to(`user-${to}`).emit('chat:typing:start', { chatId });
}

export async function stopTypingMessage(socket: Socket, payload: typingMessage) {
  const { from, to, chatId } = payload;

  if (!socket.userId || socket.userId !== from) {
    throw new Error('Not authorized');
  }

  const isblocked = await prisma.block.findFirst({
    where: {
      OR: [
        { blockerId: from, blockedId: to },
        { blockerId: to, blockedId: from },
      ],
    },
  });

  if (isblocked) throw new Error('You are blocked');

  socket.to(`user-${to}`).emit('chat:typing:stop', { chatId });
}
