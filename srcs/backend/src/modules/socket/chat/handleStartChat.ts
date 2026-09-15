import { Server, Socket } from 'socket.io';
import { prisma } from '@/lib/prisma.js';

import type { startNewChat } from '../schemas.js';

export async function handleStartChat(socket: Socket, payload: startNewChat) {
  try {
    const { recipientId } = payload;

    const currUserId = socket.userId;
    if (!currUserId) throw new Error('Internal server error');

    const user = await prisma.user.findUnique({
      where: {
        id: recipientId,
      },
    });
    if (!user) throw new Error('User with this id do not exist');

    const chat = await prisma.chat.findFirst({
      where: {
        members: { every: { userId: { in: [currUserId, recipientId] } } },
        AND: [
          { members: { some: { userId: currUserId } } },
          { members: { some: { userId: recipientId } } },
        ],
      },
      select: {
        id: true,
        members: {
          select: {
            userId: true,
            lastReadMessagesId: true,
            user: {
              select: {
                id: true,
                pseudo: true,
                profilePhoto: { select: { name: true, id: true } },
              },
            },
          },
        },
      },
    });

    if (chat && chat.members.length === 2) {
      const current = chat.members.find((m) => m.userId === currUserId);
      const other = chat.members.find((m) => m.userId === recipientId);

      return {
        chatId: chat.id,
        lastReadMessagesId: current?.lastReadMessagesId,
        user: other?.user,
      };
    }

    const newChat = await prisma.chat.create({
      data: {
        members: {
          create: [{ userId: currUserId }, { userId: recipientId }],
        },
      },
      select: {
        id: true,
        members: {
          where: {
            userId: recipientId,
          },
          select: {
            user: {
              select: {
                id: true,
                pseudo: true,
                profilePhoto: {
                  select: {
                    name: true,
                    id: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    const otherUser = newChat.members[0];

    return { chatId: newChat.id, user: otherUser.user };
  } catch (err) {
    console.error(`Error start new chat`, err);
    throw err;
  }
}

// const chatId = await prisma.chatMember.groupBy({
//   by: ['chatId'],
//   where: {
//     userId: { in: [currUserId, recipientId] },
//   },
//   having: {
//     userId: { _count: { equals: 2 } },
//   },
// });

// const chats = await prisma.chat.findMany({
//   where: {
//     members: {
//       every: {
//         userId: { in: [currUserId, recipientId] },
//       },
//     },
//     AND: [
//       { members: { some: { userId: currUserId } } },
//       { members: { some: { userId: recipientId } } },
//     ],
//   },
//   select: {
//     id: true,
//     members: {
//       select: {
//         userId: true,
//         lastReadMessagesId: true,
//         user: {
//           select: {
//             id: true,
//             pseudo: true,
//             profilePhoto: { select: { name: true } },
//           },
//         },
//       },
//     },
//   },
// });

// const result = chats
//   .filter(chat => chat.members.length === 2)
//   .map(chat => {
//     const current = chat.members.find(m => m.userId === currUserId);
//     const other = chat.members.find(m => m.userId === recipientId);

//     return {
//       chatId: chat.id,
//       lastReadMessagesId: current?.lastReadMessagesId ?? null,
//       otherUser: other?.user ?? null,
//     };
//   });
