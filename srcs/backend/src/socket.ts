import { Server, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';

import { handleMessages } from './modules/chat/chat.js';

export const setupSocketConnection = (io: Server) => {
  // chack auth
  // io.use((socket, next) => {
  //   try {
  //     const cookie = socket.handshake.headers.cookie;
  //     const token = cookieParser(cookie);
  //     console.log(token);

  //     const secret = process.env.JWT_SECRET;

  //     if (!secret) {
  //       throw new Error('Internal server error');
  //     }
  //     const payload = jwt.verify(token, secret);

  //     socket.user = {
  //       id: payload.userId,
  //     };

  //     next();
  //   } catch (error) {
  //     next(new Error('Unauthorized'));
  //   }
  // });
  // connection
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
