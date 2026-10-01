import { Server, Socket } from 'socket.io';

import { lastReadSchema, messageSchema, startNewChatSchema } from './schemas.js';
import { onValidated } from './socket.validators.js';
import { requireAuth } from './socket.middlewares.js';
import { handleMessages } from './chat/handleMessages.js';
import { handleMessageRead } from './chat/handleLastReadMessage.js';
import { handleStartChat } from './chat/handleStartChat.js';
import { startTypingMessage, stopTypingMessage } from './chat/handleTypingMessage.ts';
import FriendshipsServices from '../social/friendships.services.js';

export const setupSocketConnection = (io: Server) => {
  io.use(requireAuth);

  io.on('connection', (socket: Socket) => {
    console.log('User connected:', socket.id);

    const userRoom = `user-${socket.userId}`;
    socket.join(userRoom);

    onValidated(socket, 'new-chat-message', messageSchema, handleMessages);
    onValidated(socket, 'last-read-message', lastReadSchema, handleMessageRead);
    onValidated(socket, 'start-new-chat', startNewChatSchema, handleStartChat);
    // onValidated(socket, 'chat:typing:start', lastReadSchema, startTypingMessage);
    // onValidated(socket, 'chat:typing:stop', lastReadSchema, stopTypingMessage);

    FriendshipsServices.getFriendsId(socket.userId);
    startTypingMessage(socket);
    stopTypingMessage(socket);
    socket.on('disconnect', (reason) => {
      console.log('User disconnected:', socket.id);
      console.log(`reason: ${reason}`);
    });
  });
};
