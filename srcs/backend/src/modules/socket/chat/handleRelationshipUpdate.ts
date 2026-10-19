import { Server, Socket } from 'socket.io';
import { prisma } from '@/lib/prisma.js';

import type { updateRelationshipUpdated } from '../schemas.js';

export async function handleRelationshipUpdate(socket: Socket, payload: updateRelationshipUpdated) {
  const { fromId, toId } = payload;

  if (!socket.userId || socket.userId !== fromId) {
    throw new Error('Not authorized');
  }

  console.log(payload);

  socket.to(`user-${toId}`).emit('relationship:update', { userId: toId }, (res) => {
    console.log('response');
  });
}
