import { Server, Socket } from 'socket.io';
import { handleMessages } from './modules/chat/chat.ts';

export const setupSocketConnection = (io: Server) => {
  io.on('connection', (socket: Socket) => {
    console.log('User connected:', socket.id);

    handleMessages(io, socket);

    // Регистрируем все обработчики
    // registerAuthHandlers(io, socket);
    // registerChatHandlers(io, socket);
    // registerNotificationHandlers(io, socket);

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });
};
