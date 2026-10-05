import { randomUUID } from 'node:crypto';
import type { Server, Socket } from 'socket.io';

import { prisma } from '@/lib/prisma.js';
import type { gameAcceptInput } from '../schemas.js';

type Game = {
	gameId: string;
	boardSize: number;
	players: [string, string];
	board: unknown[];
};

const gamesByInvitation = new Map<string, Game>();

export async function handleGameAccept(
	io: Server,
	socket: Socket,
	payload: gameAcceptInput
): Promise<void> {
	const { invitationId, chatId, fromUserId, toUserId, boardSize } = payload;

	if (!socket.userId || socket.userId !== toUserId || fromUserId === toUserId) {
		throw new Error('Not authorized to accept this game invitation');
	}

	const invitation = await prisma.message.findUnique({
		where: { id: invitationId },
		select: {
			chatId: true,
			senderId: true,
			content: true,
			type: true,
			chat: {
				select: {
					members: { select: { userId: true } },
				},
			},
		},
	});

	const participants = invitation?.chat.members.map((member) => member.userId) ?? [];
	if (
		!invitation ||
		invitation.chatId !== chatId ||
		invitation.senderId !== fromUserId ||
		invitation.type !== 'invitation' ||
		invitation.content !== String(boardSize) ||
		participants.length !== 2 ||
		!participants.includes(fromUserId) ||
		!participants.includes(toUserId)
	) {
		throw new Error('Game invitation is invalid or no longer available');
	}

	let game = gamesByInvitation.get(invitationId);
	if (!game) {
		game = {
			gameId: randomUUID(),
			boardSize,
			players: [fromUserId, toUserId],
			board: [],
		};
		gamesByInvitation.set(invitationId, game);
	}

	const acceptedPayload = {
		gameId: game.gameId,
		boardSize: game.boardSize,
		fromUserId,
		toUserId,
	};

	io.to(`user-${fromUserId}`).emit('game:accepted', acceptedPayload);
	io.to(`user-${toUserId}`).emit('game:accepted', acceptedPayload);
}
