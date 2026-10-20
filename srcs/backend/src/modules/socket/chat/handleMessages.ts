import { Server, Socket } from 'socket.io';
import { prisma } from '@/lib/prisma.js';
import { Prisma } from '@/generated/prisma/client.js';

import type { newMessageInput } from '../schemas.js';
import type { MessageType } from '@/generated/prisma/enums.js';
import { handleGameMessages } from './handleGameMessages.ts';

const creatNewChat = async (chatId: string, currUserId: string, recipientId: string) => {
  const newChat = await prisma.chat.create({
    data: {
      id: chatId,
      members: {
        create: [{ userId: currUserId }, { userId: recipientId }],
      },
    },
  });

  return newChat;
};

const creatNewMessage = async (
  id: string,
  chatId: string,
  senderId: string,
  content: string,
  type: MessageType
) => {
  return await prisma.message.create({
    data: { id, chatId, senderId, content, type },
    select: {
      id: true,
      chatId: true,
      content: true,
      createdAt: true,
      type: true,
      sender: {
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
  });
};

export async function handleMessages(socket: Socket, payload: newMessageInput) {
  const { id, chatId, recipientId, sender, content, type } = payload;

  try {
    if (!socket.userId || socket.userId !== sender.id) {
      throw new Error('Not authorized to send this message');
    }

    const isblocked = await prisma.block.findFirst({
      where: {
        OR: [
          { blockerId: sender.id, blockedId: payload.recipientId },
          { blockerId: payload.recipientId, blockedId: sender.id },
        ],
      },
    });

    if (isblocked) throw new Error('You are blocked');

    if (type === 'invitation') {
      return await handleGameMessages(socket, payload);
    }
    if (type === 'file'){
      const res = await prisma.file.findFirst({
        where:{
          id: content, 
          userId: sender.id,
          chatId: null,
          type: 'message'
        }
      });
      if (!res)
          throw new Error('Not authorized to send this message')
    }

    const chat = await prisma.chat.findFirst({
      where: {
        members: { every: { userId: { in: [sender.id, recipientId] } } },
        AND: [
          { members: { some: { userId: sender.id } } },
          { members: { some: { userId: recipientId } } },
        ],
      },
      include: {
        members: {
          select: { userId: true },
        },
      },
    });

    let savedMessage = null;
    if (chat) {
      if (chat.id !== chatId)
        throw new Error(
          'Chat conflict: existing chatId for these users does not match the provided chatId'
        );
      savedMessage = await creatNewMessage(id, chat.id, sender.id, content, type);
    } else {
      const newChat = await creatNewChat(chatId, sender.id, recipientId);

      if (!newChat) throw new Error('Chat not creat new chat');

      savedMessage = await creatNewMessage(id, newChat.id, sender.id, content, type);
    }

    if (!savedMessage) throw new Error('Can not save message');

    if (type === 'file') {
      const updated = await prisma.file.update({
        where: {
          id: savedMessage.content,
        },
        data: {
          chatId: savedMessage.chatId,
        },
      });
      if (!updated) throw new Error('Can not update chatId of file');
    }

    socket.to(`user-${recipientId}`).emit('new-chat-message', savedMessage);

    return savedMessage;
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        throw new Error('Chat already exists');
      }
    }

    throw error;
  }
}
