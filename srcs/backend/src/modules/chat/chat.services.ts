import { prisma } from '../../lib/prisma.js';

import { NotFoundError } from '../../common/errors.js';

class chatService {
  async getChatsByUser(currentUserId: string) {
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
                        id: true,
                      },
                    },
                  },
                },
                lastReadMessagesId: true,
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
      mylastReadMessagesId: chat.lastReadMessagesId,
      otherlastReadMessagesId: chat.chat.members[0]?.lastReadMessagesId,
    }));

    return ret;
  }

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
                id: true,
              },
            },
          },
        },
        content: true,
        type: true,
        createdAt: true,
      },
    });

    if (!messages) {
      throw new NotFoundError('Dont have messages in this chat');
    }

    const result = messages.map((m) => ({ ...m, status: 'sent' }));
    return result;
  }

  async getChatByUserId(currentUserId: string, otherUserId: string) {
    const chat = await prisma.chat.findFirst({
      where: {
        members: {
          every: { userId: { in: [currentUserId, otherUserId] } },
        },
        AND: [
          { members: { some: { userId: currentUserId } } },
          { members: { some: { userId: otherUserId } } },
        ],
      },
    });

    if (!chat) throw new NotFoundError('Chat with this user not found');

    return chat;
  }
}

export default new chatService();