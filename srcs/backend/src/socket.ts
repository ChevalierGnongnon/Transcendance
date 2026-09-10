import { Server, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import cookie from 'cookie';

import {
  handleChatRoom,
  handleMessageRead,
  handleMessages,
  handleStartChat,
  setupUser,
} from './modules/chat/chat.js';

export const setupSocketConnection = (io: Server) => {
  // check Auth
  io.use((socket, next) => {
    const cookieHeader = socket.handshake.headers.cookie;
    if (!cookieHeader) {
      console.error('Dont have cookie in request');
      return next(new Error('Authentication required'));
    }
    try {
      const cookies = cookie.parse(cookieHeader);
      const token = cookies.token;

      const secret = process.env.JWT_SECRET;
      if (!secret) {
        throw new Error('Internal server error');
      }

      if (!token) {
        console.log('Do not have token in cookie');
        return next(new Error('Token not found'));
      }

      const decoded = jwt.verify(token, secret || 'secret');
      socket.userId = decoded.userId;

      console.log(`User ${socket.userId} connected`);
      next();
    } catch (error) {
      console.error('Error Authentication', error);
      return next(new Error('Invalid token'));
    }
  });

  // connection
  io.on('connection', (socket: Socket) => {
    console.log('User connected:', socket.id);

    // handleChatRoom(io, socket);
    setupUser(io, socket);
    handleMessages(io, socket);
    handleMessageRead(io, socket);
    handleStartChat(io, socket);

    // Регистрируем все обработчики
    // registerAuthHandlers(io, socket);
    // registerChatHandlers(io, socket);
    // registerNotificationHandlers(io, socket);
    //
    // DEBUG

    socket.on('disconnect', (reason) => {
      console.log('User disconnected:', socket.id);
      console.log(`reason: ${reason}`);
    });
  });
};
