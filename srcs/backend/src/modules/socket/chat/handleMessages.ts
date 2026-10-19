import { Server, Socket } from 'socket.io';
import { prisma } from '@/lib/prisma.js';
import { Prisma } from '@/generated/prisma/client.js';

import type { newMessageInput } from '../schemas.js';
import type { MessageType } from '@/generated/prisma/enums.js';

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

    if (!chat) throw new Error('Chat not found or access denied');

    // let savedMessage = null;
    // if (chat) {
    //   if (chat.id !== chatId)
    //     throw new Error(
    //       'Chat conflict: existing chatId for these users does not match the provided chatId'
    //     );
    //   savedMessage = await creatNewMessage(id, chat.id, sender.id, content, type);
    // } else {
    //   const newChat = await creatNewChat(chatId, sender.id, recipientId);

    let existingInvitationId: string | null = null;
    const savedMessage = await prisma.$transaction(async (tx) => {
      if (type === 'invitation') {
        await tx.$queryRaw`SELECT id FROM chats WHERE id = ${chatId} FOR UPDATE`;
        await tx.$executeRaw`
          UPDATE game_invitations AS gi
          INNER JOIN messages AS m ON m.id = gi.invitation_id
          SET gi.status = 'expired', gi.resolved_at = NOW(3)
          WHERE m.chat_id = ${chatId}
            AND gi.status = 'pending'
            AND m.created_at < ${new Date(Date.now() - 24 * 60 * 60 * 1000)}
        `;
        const pendingInvitations = await tx.$queryRaw<{ invitation_id: string }[]>`
          SELECT gi.invitation_id
          FROM game_invitations AS gi
          INNER JOIN messages AS m ON m.id = gi.invitation_id
          WHERE m.chat_id = ${chatId} AND gi.status = 'pending'
          LIMIT 1
        `;
        if (pendingInvitations.length > 0) {
          existingInvitationId = pendingInvitations[0].invitation_id;
          return null;
        }
      }

      const message = await tx.message.create({
        data: { chatId, senderId: sender.id, content, type },
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

      if (type === 'invitation') {
        await tx.$executeRaw`
          INSERT INTO game_invitations (invitation_id, status)
          VALUES (${message.id}, 'pending')
        `;
      }

      return message;
    });

    if (existingInvitationId) {
      socket.emit('game:invitation-created', { invitationId: existingInvitationId, chatId });
      return 'Message saved and send to recipient';
    }

    if (!savedMessage) throw new Error('Can not save message');

    if (type === 'invitation') {
      socket.emit('game:invitation-created', { invitationId: savedMessage.id, chatId });
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
