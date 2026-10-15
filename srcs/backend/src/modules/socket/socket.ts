import { Server, Socket } from 'socket.io';

import { lastReadSchema, messageSchema, startNewChatSchema } from './schemas.js';
import { onValidated } from './socket.validators.js';
import { requireAuth } from './socket.middlewares.js';
import { handleMessages } from './chat/handleMessages.js';
import { handleMessageRead } from './chat/handleLastReadMessage.js';
import { handleStartChat } from './chat/handleStartChat.js';
import { showConnectedUsers, connectUser, disconnectUser, announceOnline, announceOffline, filterAndEmit } from './user_status/status_management.ts'

export const setupSocketConnection = (io: Server) => {
  io.use(requireAuth);

  io.on('connection', (socket: Socket) => {
    console.log('User connected:', socket.id);
    if (!socket.userId)
      throw new Error('Internal server error');
    const userRoom = `user-${socket.userId}`;
    const isFirstConnection = connectUser(socket.userId);
    if (isFirstConnection === true)
      announceOnline(socket.userId, socket);
    filterAndEmit(socket.userId, socket)

    socket.join(userRoom);
    

    onValidated(socket, 'new-chat-message', messageSchema, handleMessages);
    onValidated(socket, 'last-read-message', lastReadSchema, handleMessageRead);
    onValidated(socket, 'start-new-chat', startNewChatSchema, handleStartChat);

    socket.on('disconnect', (reason) => {
      console.log('User disconnected:', socket.id);
      console.log(`reason: ${reason}`);
      if (!socket.userId)
        throw new Error('Internal server error');
      const isLastDeconnection = disconnectUser(socket.userId);
      if (isLastDeconnection === true)
        announceOffline(socket.userId, socket);
    });
  });
};
