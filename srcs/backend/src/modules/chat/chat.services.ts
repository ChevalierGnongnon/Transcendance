import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import { prisma } from '../../lib/prisma.js';
import { NotFoundError } from '../../common/errors.js';

class chatService {
  async getChatsByUser(currentUserId: string) {
    const myChats = await prisma.chatMember.findMany({
      where: { userId: currentUserId },
      select: {
        chatId: true,
      },
    });

    if (!myChats) throw new NotFoundError('Do not found chats');

    const chatIds = myChats.map((chat) => chat.chatId);

    const others = await prisma.chatMember.findMany({
      where: {
        chatId: {
          in: chatIds,
        },
        userId: {
          not: currentUserId,
        },
      },
      select: {
        chatId: true,
        user: {
          select: {
            id: true,
            pseudo: true,
            profilePhoto: {
              select: {
                name: true,
              },
            },
          },
        },
        message: {
          select: {
            createdAt: true,
          },
        },
      },
    });

    if (!others) throw new NotFoundError('Do not found conversations in chats');

    const result = await Promise.all(
      others.map(async (member) => {
        const unreadCount = await prisma.message.count({
          where: {
            chatId: member.chatId,
            senderId: member.user.id,
            createdAt: {
              gt: member.message?.createdAt || new Date(0),
            },
          },
        });
        return {
          chatId: member.chatId,
          pseudo: member.user.pseudo,
          profilePhoto: member.user.profilePhoto?.name,
          unreadCount: unreadCount,
        };
      })
    );

    console.log(result);
    const chats = others.map((other) => ({
      chatId: other.chatId,
      pseudo: other.user.pseudo,
      profilePhoto: other.user.profilePhoto?.name,
    }));

    return result;
  }

  //  {
  //   chatId: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  //   senderId: '11111111-1111-1111-1111-111111111111',
  //   profilePhoto: 'virtue.png',
  //   content: 'sfdasdfasf'
  // }

  async getMessagesByChatId(chatId: string) {
    const messages = await prisma.message.findMany({
      where: { chatId },
      orderBy: {
        createdAt: 'asc',
      },
      select: {
        chatId: true,
        sender: {
          select: {
            id: true,
            profilePhoto: {
              select: {
                name: true,
              },
            },
          },
        },
        content: true,
        createdAt: true,
      },
    });

    if (!messages) {
      throw new NotFoundError('Dont have messages in this chat');
    }
    return messages;
  }
}

export default new chatService();
