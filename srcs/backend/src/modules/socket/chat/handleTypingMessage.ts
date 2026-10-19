import { Server, Socket } from 'socket.io';
import type { typingMessage } from '../schemas.js';

export async function startTypingMessage(socket: Socket, payload: typingMessage) {
  socket.to(`user-${payload.to}`).emit('chat:typing:start', { chatId: payload.chatId });
}

export async function stopTypingMessage(socket: Socket, payload: typingMessage) {
  socket.to(`user-${payload.to}`).emit('chat:typing:stop', { chatId: payload.chatId });
}
