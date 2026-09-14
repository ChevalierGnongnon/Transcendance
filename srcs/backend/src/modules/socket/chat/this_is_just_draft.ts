import { Server, Socket } from 'socket.io';
import { prisma } from '../../../lib/prisma.ts';
import chatServices from '../../chat/chat.services.ts';
import { NotFoundError } from '../../../common/errors.ts';
import { error } from 'console';
import { messages } from '../../chat/chat.controllers.ts';

// handleChatRoom(io, socket);

// Регистрируем все обработчики
// registerAuthHandlers(io, socket);
// registerChatHandlers(io, socket);
// registerNotificationHandlers(io, socket);
//
// DEBUG

export const handleMessageRead = (io: Server, socket: Socket) => {
  socket.on('last-read-message', async (data) => {
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
      // console.log(`last read message updated: ${data.messageId}`);
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

// io.on('connection', (socket) => {
//   onValidated(socket, 'sendMessage', sendMessageSchema, async (s, payload) => {
//     // payload уже валидирован и типизирован
//     await handleSendMessage(s, payload);
//   });

// // features/chat/services/message.service.ts
// import { prisma } from '@/shared/db/prisma';
// import type { SendMessageInput } from '../schemas/message.schema';

// export async function handleSendMessage(
//   socket: Socket,
//   payload: SendMessageInput,
// ) {
//   const { chatId, content, clientTempId } = payload;

//   // 1. Проверяем, что юзер вообще имеет доступ к чату
//   const chat = await prisma.chat.findFirst({
//     where: {
//       id: chatId,
//       participants: { some: { userId: socket.data.userId } },
//     },
//   });

//   if (!chat) {
//     socket.emit('app_error', {
//       event: 'sendMessage',
//       code: 'CHAT_NOT_FOUND',
//       message: 'Chat not found or access denied',
//     });
//     return;
//   }

//   // 2. Сохраняем в БД
//   const message = await prisma.message.create({
//     data: {
//       chatId,
//       senderId: socket.data.userId,
//       content,
//     },
//     include: {
//       sender: { select: { id: true, name: true, profilePhoto: true } },
//     },
//   });

//   // 3. Рассылаем всем участникам чата
//   const roomName = `chat:${chatId}`;
//   io.to(roomName).emit('new_message', {
//     message,
//     clientTempId, // чтобы отправитель мог подменить оптимистичное сообщение
//   });

//   // 4. Обновляем lastMessage в чате (для списка чатов)
//   await prisma.chat.update({
//     where: { id: chatId },
//     data: { lastMessageId: message.id, updatedAt: new Date() },
//   });

//   return message;
// }

// export function onValidated<T>(
//   socket: Socket,
//   event: string,
//   schema: z.ZodType<T>,
//   handler: Handler<T>,
// ) {
//   socket.on(event, async (raw: unknown, ack?: (response: unknown) => void) => {
//     const result = schema.safeParse(raw);

//     if (!result.success) {
//       ack?.({
//         ok: false,
//         error: {
//           event,
//           issues: result.error.issues.map((i) => ({
//             path: i.path.join('.'),
//             message: i.message,
//           })),
//         },
//       });
//       return;
//     }

//     try {
//       const data = await handler(socket, result.data);
//       ack?.({ ok: true, data });
//     } catch (err) {
//       ack?.({
//         ok: false,
//         error: { message: err instanceof Error ? err.message : 'Unknown error' },
//       });
//     }
//   });
// }

// const chatIds = myChats.map((chat) => chat.chatId);

//  const others = await prisma.chatMember.findMany({
//    where: {
//      chatId: {
//        in: chatIds,
//      },
//      userId: {
//        not: currentUserId,
//      },
//    },
//    select: {
//      chatId: true,
//      user: {
//        select: {
//          id: true,
//          pseudo: true,
//          profilePhoto: {
//            select: {
//              name: true,
//            },
//          },
//        },
//      },
//      lastReadMessagesId: true,
//    },
//  });

//  if (!others) throw new NotFoundError('Do not found conversations in chats');
