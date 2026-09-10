import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import { prisma } from '../../lib/prisma.js';
import { NotFoundError } from '../../common/errors.js';

class chatService {
  async getChatsByUser(currentUserId: string) {
    // TODO add try catch
    const myChats = await prisma.chatMember.findMany({
      where: { userId: currentUserId },
      select: {
        chatId: true,
        lastReadMessagesId: true,
        chat: {
          select: {
            members: {
              where: {
                userId: {
                  not: currentUserId,
                },
              },
              select: {
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
              },
            },
          },
        },
      },
    });

    if (!myChats) throw new NotFoundError('Do not found chats');

    const ret = myChats.map((chat) => ({
      chatId: chat.chatId,
      user: chat.chat.members[0]?.user,
      lastReadMessagesId: chat.lastReadMessagesId,
    }));

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
        lastReadMessagesId: true,
      },
    });

    if (!others) throw new NotFoundError('Do not found conversations in chats');
    console.log(ret[0])

    return ret;
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
        id: true,
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
