import { Server, Socket } from 'socket.io';
import { prisma } from '../../lib/prisma.ts';
import chatServices from './chat.services.ts';
import { NotFoundError } from '../../common/errors.ts';
import { error } from 'console';

export const handleChatRoom = async (io: Server, socket: Socket) => {
  socket.on('join-chat-request', async (req) => {
    console.log(`Recieve request to join chat: {chatId: ${req.chatId}, userId: ${req.userId}}`);
    // TODO: validate data
    try {
      const chat = await prisma.chat.findUnique({
        where: { id: req.chatId },
        select: {
          id: true,
        },
      });
      if (!chat) throw new NotFoundError(`Can not find chat, chatId: ${req.chatId}`);

      socket.join(`chat-${chat.id}`);
      console.log(`socket ${socket.id} is joined to room chat-${chat.id}`);
      socket.emit('chat-room-joined', { success: true });

      const rooms = io.sockets.adapter.rooms;

      for (const [roomName, sockets] of rooms) {
        if (!io.sockets.sockets.has(roomName)) {
          console.log(`Room: ${roomName}`);
          console.log(`sockets: ${sockets.size}`);
          console.log(`ID of sockets:`, Array.from(sockets));
        }
      }
    } catch (error) {
      console.error(`Error join, ${error}`);
      socket.emit('chat-room-joined', { success: false });
    }
  });

  socket.on('leave-chat-request', async (req) => {
    const chatId = req.chatId;
    socket.leave(`chat-${chatId}`);
  });
};

export const handleMessages = (io: Server, socket: Socket) => {
  socket.on('new-chat-message', async (message) => {
    console.log(`Recieve message from: ${socket.id}`);
    try {
      console.log(message);
      // validate messages date with zod
      const savedMessage = await prisma.message.create({
        data: {
          chatId: message.chatId,
          senderId: message.sender.id,
          content: message.content,
        },
      });

      if (!savedMessage) {
        throw new Error('Error save message');
      }
      console.log({ ...message, id: savedMessage.id });

      socket.to(`user-${message.to}`).emit('new-chat-message', { ...message, id: savedMessage.id });
    } catch (error) {
      console.error('Error save message', error);
    }
  });
};

export const handleMessageRead = (io: Server, Socket: Socket) => {
  Socket.on('last-read-message', async (data) => {
    try {
      // validate data
      //
      const lastReadMessage = await prisma.chatMember.update({
        where: {
          chatId_userId: {
            chatId: data.chatId,
            userId: data.userId,
          },
        },
        data: {
          lastReadMessagesId: data.messageId,
        },
      });
      console.log(`last read message updated: ${data.messageId}`);
    } catch (error) {
      console.error(`Error update last read message`, error);
      return;
    }
  });
};

export const setupUser = (io: Server, socket: Socket) => {
  const userRoom = `user-${socket.userId}`;

  socket.join(userRoom);
  console.log(`User '${socket.userId}' connected`);
};

// // 1. Слушать новые подключения
// io.on('connection', (socket) => {
//   // ...``
// });

// // 2. Отправлять сообщения ВСЕМ подключенным клиентам
// io.emit('global-message', 'Hello everyone!');

// // 3. Отправлять сообщения в комнаты
// io.to('room-1').emit('room-message', 'Hello room!');

// // 4. Получать список всех подключений
// const sockets = io.sockets.sockets;

// // 5. Использовать middleware для всех подключений
// io.use((socket, next) => {
//   // Проверка авторизации для всех сокетов
//   next();
// });

// // 6. Получать статистику
// const count = io.engine.clientsCount; // количество подключений
//
// io.on('connection', (socket) => {
//   // 1. Слушать события от ЭТОГО конкретного клиента
//   socket.on('sendMessage', (data) => {
//     console.log('Получено от клиента:', data);
//   });

//   // 2. Отправлять сообщение ТОЛЬКО ЭТОМУ клиенту
//   socket.emit('private-message', 'Hello only you!');

//   // 3. Присоединиться к комнате
//   socket.join('room-1');

//   // 4. Покинуть комнату
//   socket.leave('room-1');

//   // 5. Отправить сообщение всем, КРОМЕ этого клиента
//   socket.broadcast.emit('user-joined', { id: socket.id });

//   // 6. Получить комнаты, в которых состоит клиент
//   const rooms = socket.rooms;

//   // 7. Отправить сообщение в комнату (от этого клиента)
//   socket.to('room-1').emit('message', 'Hello room from socket!');
// });

// const handleMessages = (io: Server) => {
//   io.emit(ev);
// };

// io.on('connection', (socket) => {
//   console.log('a user connected');
//   socket.on('sendMessage', (data) => {
//     console.log('Получено сообщение:', data);
//   });
// });

// io.on('disconnect', (socket) => {
//   console.log('user disconnected');
// });
