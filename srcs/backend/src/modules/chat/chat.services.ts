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
                        id:true,
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

    console.log(ret[0]);

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
