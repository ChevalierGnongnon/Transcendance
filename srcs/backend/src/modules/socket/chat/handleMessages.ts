import { Server, Socket } from 'socket.io';
import { prisma } from '@/lib/prisma.js';

import type { newMessageInput } from '../schemas.js';

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
        id: chatId,
        members: { every: { userId: { in: [sender.id, recipientId] } } },
      },
      include: {
        members: {
          select: { userId: true },
        },
      },
    });

    if (!chat) throw new Error('Chat not found or access denied');

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

<<<<<<< HEAD
    if (type === 'invitation') {
      socket.emit('game:invitation-created', { invitationId: savedMessage.id, chatId });
    }

=======
>>>>>>> 14a03e1 (feat(chat): implement block functionality in header, disable input for blocked)
    socket.to(`user-${recipientId}`).emit('new-chat-message', savedMessage);

    return savedMessage;
  } catch (error) {
    console.error('Error save message', error);

    throw new Error('Error sending message, save in DB');
  }
}
