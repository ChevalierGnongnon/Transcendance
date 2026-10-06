import type { Server, Socket } from 'socket.io';

import { prisma } from '@/lib/prisma.js';
import type { gameAcceptInput, gameMoveInput, gameStateInput } from '../schemas.js';

type Board = (string | null)[][];

function getWinningLine(board: Board, row: number, col: number, symbol: string) {
	const directions = [[1, 0], [0, 1], [1, 1], [1, -1]];

	for (const [rowStep, colStep] of directions) {
		const line: [number, number][] = [[row, col]];
		for (const direction of [-1, 1]) {
			let currentRow = row + rowStep * direction;
			let currentCol = col + colStep * direction;
			while (
				currentRow >= 0 && currentRow < board.length &&
				currentCol >= 0 && currentCol < board.length &&
				board[currentRow][currentCol] === symbol
			) {
				if (direction < 0) line.unshift([currentRow, currentCol]);
				else line.push([currentRow, currentCol]);
				currentRow += rowStep * direction;
				currentCol += colStep * direction;
			}
		}
		if (line.length >= 5) return line;
	}
	return null;
}

function gameSnapshot(game: {
	id: string;
	boardSize: number;
	playerXId: string;
	playerOId: string;
	currentTurnUserId: string;
	board: unknown;
	winnerId: string | null;
	isDraw: boolean;
	winningLine: unknown;
}) {
	return {
		gameId: game.id,
		boardSize: game.boardSize,
		players: [
			{ userId: game.playerXId, symbol: 'X' },
			{ userId: game.playerOId, symbol: 'O' },
		],
		currentTurnUserId: game.currentTurnUserId,
		board: game.board,
		winnerId: game.winnerId,
		isDraw: game.isDraw,
		winningLine: game.winningLine,
	};
}

async function getAuthorizedGame(gameId: string, userId: string | undefined) {
	if (!userId) throw new Error('Authentication required');
	const game = await prisma.game.findUnique({ where: { id: gameId } });
	if (!game || (game.playerXId !== userId && game.playerOId !== userId)) {
		throw new Error('Game not found or access denied');
	}
	return game;
}

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

	const emptyBoard = Array.from({ length: boardSize }, () =>
		Array.from({ length: boardSize }, () => null)
	);
	const game = await prisma.game.upsert({
		where: { invitationId },
		create: {
			invitationId,
			boardSize,
			playerXId: fromUserId,
			playerOId: toUserId,
			currentTurnUserId: fromUserId,
			board: emptyBoard,
			isDraw: false,
			winningLine: [],
		},
		update: {},
	});

	const acceptedPayload = {
		...gameSnapshot(game),
		fromUserId,
		toUserId,
	};

	io.to(`user-${fromUserId}`).emit('game:accepted', acceptedPayload);
	io.to(`user-${toUserId}`).emit('game:accepted', acceptedPayload);
}

export async function handleGameGetState(
	socket: Socket,
	payload: gameStateInput
): Promise<void> {
	const game = await getAuthorizedGame(payload.gameId, socket.userId);
	socket.emit('game:state', gameSnapshot(game));
}

export async function handleGameRestart(
	io: Server,
	socket: Socket,
	payload: gameStateInput
): Promise<void> {
	const game = await getAuthorizedGame(payload.gameId, socket.userId);
	if (!game.winnerId && !game.isDraw) {
		throw new Error('The game can only be restarted after it has finished');
	}

	const nextStarterId = game.currentTurnUserId === game.playerXId
		? game.playerOId
		: game.playerXId;
	const update = await prisma.game.updateMany({
		where: {
			id: game.id,
			currentTurnUserId: game.currentTurnUserId,
			winnerId: game.winnerId,
			isDraw: game.isDraw,
		},
		data: {
			board: Array.from({ length: game.boardSize }, () =>
				Array.from({ length: game.boardSize }, () => null)
			),
			currentTurnUserId: nextStarterId,
			winnerId: null,
			isDraw: false,
			winningLine: [],
		},
	});
	if (update.count !== 1) throw new Error('The game has already been restarted');

	const restartedGame = await prisma.game.findUniqueOrThrow({ where: { id: game.id } });
	const snapshot = gameSnapshot(restartedGame);
	io.to(`user-${game.playerXId}`).emit('game:state', snapshot);
	io.to(`user-${game.playerOId}`).emit('game:state', snapshot);
}

export async function handleGameMove(
	io: Server,
	socket: Socket,
	payload: gameMoveInput
): Promise<void> {
	const userId = socket.userId;
	const game = await getAuthorizedGame(payload.gameId, userId);
	if (game.winnerId || game.isDraw) throw new Error('Game is already finished');
	if (game.currentTurnUserId !== userId) throw new Error('It is not your turn');
	if (payload.row >= game.boardSize || payload.col >= game.boardSize) {
		throw new Error('Move is outside the board');
	}

	const board = game.board as Board;
	if (
		!Array.isArray(board) ||
		board.length !== game.boardSize ||
		!Array.isArray(board[payload.row]) ||
		board[payload.row][payload.col] !== null
	) {
		throw new Error('Cell is already occupied or game state is invalid');
	}

	const symbol = game.playerXId === userId ? 'X' : 'O';
	const nextBoard = board.map((line) => [...line]);
	nextBoard[payload.row][payload.col] = symbol;
	const winningLine = getWinningLine(nextBoard, payload.row, payload.col, symbol);
	const winnerId = winningLine ? userId : null;
	const isDraw = !winningLine && nextBoard.every((line) => line.every((cell) => cell !== null));
	const nextTurnUserId = userId === game.playerXId ? game.playerOId : game.playerXId;

	const update = await prisma.game.updateMany({
		where: { id: game.id, currentTurnUserId: userId, winnerId: null, isDraw: false },
		data: {
			board: nextBoard,
			currentTurnUserId: winnerId || isDraw ? userId : nextTurnUserId,
			winnerId,
			isDraw,
			winningLine: winningLine ?? [],
		},
	});
	if (update.count !== 1) throw new Error('Game state changed; reload the board');

	const updatedGame = await prisma.game.findUniqueOrThrow({ where: { id: game.id } });
	const snapshot = gameSnapshot(updatedGame);
	io.to(`user-${game.playerXId}`).emit('game:state', snapshot);
	io.to(`user-${game.playerOId}`).emit('game:state', snapshot);
}
