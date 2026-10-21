import type { Server, Socket } from 'socket.io';
import { randomUUID } from 'node:crypto';
import { emitAnalyticsUpdated } from '../socket-events.ts';

import { prisma } from '@/lib/prisma.js';
import type {
  gameAcceptInput,
  gameCloseInput,
  gameDeclineInput,
  gameCancelInvitationInput,
  gamePendingInvitationInput,
  gameRequestRematchInput,
  gameInvitationStatusInput,
  gameMoveInput,
  gameStateInput,
} from '../schemas.js';

type Board = (string | null)[][];
const GAME_INVITATION_TTL_MS = 24 * 60 * 60 * 1000;

async function expireInvitationIfNeeded(invitationId: string, createdAt: Date): Promise<boolean> {
  if (Date.now() - createdAt.getTime() < GAME_INVITATION_TTL_MS) return false;
  await prisma.$executeRaw`
		UPDATE game_invitations
		SET status = 'expired', resolved_at = NOW(3)
		WHERE invitation_id = ${invitationId} AND status = 'pending'
	`;
  return true;
}

async function getInvitationDetails(invitationId: string) {
  const statuses = await prisma.$queryRaw<
    {
      status: string;
      created_at: Date;
      sender_id: string | null;
      recipient_id: string | null;
      chat_id: string | null;
      board_size: number | null;
    }[]
  >`
		SELECT status, created_at, sender_id, recipient_id, chat_id, board_size
		FROM game_invitations WHERE invitation_id = ${invitationId}
	`;
  const status = statuses[0];
  if (!status) return null;

  if (status.sender_id && status.recipient_id && status.chat_id && status.board_size !== null) {
    const chat = await prisma.chat.findUnique({
      where: { id: status.chat_id },
      select: { members: { select: { userId: true } } },
    });
    return {
      status: status.status,
      createdAt: status.created_at,
      chatId: status.chat_id,
      fromUserId: status.sender_id,
      toUserId: status.recipient_id,
      boardSize: status.board_size,
      participants: chat?.members.map((member) => member.userId) ?? [],
    };
  }

  const message = await prisma.message.findUnique({
    where: { id: invitationId },
    select: {
      chatId: true,
      senderId: true,
      content: true,
      type: true,
      chat: { select: { members: { select: { userId: true } } } },
    },
  });
  if (!message || message.type !== 'invitation') return null;
  const participants = message.chat.members.map((member) => member.userId);
  const toUserId = participants.find((participantId) => participantId !== message.senderId);
  const boardSize = Number(message.content);
  if (!toUserId || !Number.isInteger(boardSize)) return null;
  return {
    status: status.status,
    createdAt: status.created_at,
    chatId: message.chatId,
    fromUserId: message.senderId,
    toUserId,
    boardSize,
    participants,
  };
}

function getWinningLine(board: Board, row: number, col: number, symbol: string) {
  const directions = [
    [1, 0],
    [0, 1],
    [1, 1],
    [1, -1],
  ];

  for (const [rowStep, colStep] of directions) {
    const line: [number, number][] = [[row, col]];
    for (const direction of [-1, 1]) {
      let currentRow = row + rowStep * direction;
      let currentCol = col + colStep * direction;
      while (
        currentRow >= 0 &&
        currentRow < board.length &&
        currentCol >= 0 &&
        currentCol < board.length &&
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
  closedAt: Date | null;
  playerXLeftAt: Date | null;
  playerOLeftAt: Date | null;
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
    isClosed: Boolean(game.closedAt),
    leftUserIds: [
      ...(game.playerXLeftAt ? [game.playerXId] : []),
      ...(game.playerOLeftAt ? [game.playerOId] : []),
    ],
  };
}

async function getAuthorizedGame(gameId: string, userId: string | undefined) {
  if (!userId) throw new Error('Authentication required');
  const game = await prisma.game.findUnique({ where: { id: gameId } });
  if (!game || (game.playerXId !== userId && game.playerOId !== userId)) {
    throw new Error('Game not found or access denied');
  }
  if (game.closedAt) throw new Error('Game is closed');
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

  const existingGame = await prisma.game.findUnique({ where: { invitationId } });
  if (existingGame) {
    throw new Error('This invitation has already been accepted');
  }

  const invitation = await getInvitationDetails(invitationId);
  if (
    !invitation ||
    invitation.status !== 'pending' ||
    invitation.chatId !== chatId ||
    invitation.fromUserId !== fromUserId ||
    invitation.toUserId !== toUserId ||
    invitation.boardSize !== boardSize ||
    invitation.participants.length !== 2 ||
    !invitation.participants.includes(fromUserId) ||
    !invitation.participants.includes(toUserId)
  ) {
    throw new Error('Game invitation is invalid or no longer available');
  }
  if (await expireInvitationIfNeeded(invitationId, invitation.createdAt)) {
    throw new Error('Game invitation has expired');
  }

  const emptyBoard = Array.from({ length: boardSize }, () =>
    Array.from({ length: boardSize }, () => null)
  );
  const game = await prisma.$transaction(async (tx) => {
    const updatedInvitation = await tx.$executeRaw`
			UPDATE game_invitations
			SET status = 'accepted', resolved_at = NOW(3)
			WHERE invitation_id = ${invitationId}
				AND status = 'pending'
				AND created_at >= ${new Date(Date.now() - GAME_INVITATION_TTL_MS)}
		`;
    if (updatedInvitation !== 1) {
      throw new Error('Game invitation is expired or already resolved');
    }

    return tx.game.create({
      data: {
        invitationId,
        boardSize,
        playerXId: fromUserId,
        playerOId: toUserId,
        currentTurnUserId: fromUserId,
        board: emptyBoard,
        isDraw: false,
        winningLine: [],
      },
    });
  });

  const acceptedPayload = {
    ...gameSnapshot(game),
    invitationId,
    chatId,
    fromUserId,
    toUserId,
  };

  io.to(`user-${fromUserId}`).emit('game:accepted', acceptedPayload);
  io.to(`user-${toUserId}`).emit('game:accepted', acceptedPayload);
}

export async function handleGameDecline(
  io: Server,
  socket: Socket,
  payload: gameDeclineInput
): Promise<void> {
  const { invitationId, chatId, fromUserId, toUserId, boardSize } = payload;

  if (!socket.userId || socket.userId !== toUserId || fromUserId === toUserId) {
    throw new Error('Not authorized to decline this game invitation');
  }

  const existingGame = await prisma.game.findUnique({ where: { invitationId } });
  if (existingGame) {
    throw new Error('This invitation has already been resolved');
  }

  const invitation = await getInvitationDetails(invitationId);
  if (
    !invitation ||
    invitation.status !== 'pending' ||
    invitation.chatId !== chatId ||
    invitation.fromUserId !== fromUserId ||
    invitation.toUserId !== toUserId ||
    invitation.boardSize !== boardSize ||
    invitation.participants.length !== 2 ||
    !invitation.participants.includes(fromUserId) ||
    !invitation.participants.includes(toUserId)
  ) {
    throw new Error('Game invitation is invalid or no longer available');
  }
  if (await expireInvitationIfNeeded(invitationId, invitation.createdAt)) {
    throw new Error('Game invitation has expired');
  }
  const updatedInvitation = await prisma.$executeRaw`
		UPDATE game_invitations
		SET status = 'declined', resolved_at = NOW(3)
		WHERE invitation_id = ${invitationId}
			AND status = 'pending'
			AND created_at >= ${new Date(Date.now() - GAME_INVITATION_TTL_MS)}
	`;
  if (updatedInvitation !== 1) {
    throw new Error('Game invitation is expired or already resolved');
  }

  const declinePayload = {
    invitationId,
    chatId,
    fromUserId,
    toUserId,
    boardSize,
  };

  io.to(`user-${fromUserId}`).emit('game:declined', declinePayload);
  io.to(`user-${toUserId}`).emit('game:declined', declinePayload);
}

export async function handleGameGetInvitationStatus(
  socket: Socket,
  payload: gameInvitationStatusInput
): Promise<{ status: string }> {
  if (!socket.userId) throw new Error('Authentication required');
  const invitation = await getInvitationDetails(payload.invitationId);
  if (!invitation || !invitation.participants.includes(socket.userId)) {
    throw new Error('Game invitation not found or access denied');
  }
  if (!invitation) return { status: 'expired' };
  if (
    invitation.status === 'pending' &&
    (await expireInvitationIfNeeded(payload.invitationId, invitation.createdAt))
  ) {
    return { status: 'expired' };
  }
  return { status: invitation.status };
}

export async function handleGameGetPendingInvitation(
  socket: Socket,
  payload: gamePendingInvitationInput
): Promise<{ invitationId: string; chatId: string; boardSize: number } | null> {
  if (!socket.userId) throw new Error('Authentication required');
  if (socket.userId === payload.opponentId) throw new Error('Cannot invite yourself');

  const cutoff = new Date(Date.now() - GAME_INVITATION_TTL_MS);
  await prisma.$executeRaw`
		UPDATE game_invitations AS gi
		INNER JOIN messages AS m ON m.id = gi.invitation_id
		SET gi.status = 'expired', gi.resolved_at = NOW(3)
		WHERE m.sender_id = ${socket.userId}
			AND m.type = 'invitation'
			AND m.created_at < ${cutoff}
			AND gi.status = 'pending'
	`;

  const invitations = await prisma.$queryRaw<
    {
      invitationId: string;
      chatId: string;
      boardSize: number;
    }[]
  >`
		SELECT m.id AS invitationId, m.chat_id AS chatId, CAST(m.content AS UNSIGNED) AS boardSize
		FROM messages AS m
		INNER JOIN game_invitations AS gi ON gi.invitation_id = m.id
		INNER JOIN chat_members AS recipient ON recipient.chat_id = m.chat_id
		WHERE m.sender_id = ${socket.userId}
			AND m.type = 'invitation'
			AND gi.status = 'pending'
			AND m.created_at >= ${cutoff}
			AND recipient.user_id = ${payload.opponentId}
		ORDER BY m.created_at DESC
		LIMIT 1
	`;
  return invitations[0] ?? null;
}

export async function handleGameCancelInvitation(
  io: Server,
  socket: Socket,
  payload: gameCancelInvitationInput
): Promise<void> {
  if (!socket.userId) throw new Error('Authentication required');
  const invitation = await getInvitationDetails(payload.invitationId);
  if (!invitation || invitation.fromUserId !== socket.userId) {
    throw new Error('Only the sender can cancel this invitation');
  }
  if (await expireInvitationIfNeeded(payload.invitationId, invitation.createdAt)) {
    throw new Error('Game invitation has expired');
  }
  const recipientId = invitation.toUserId;
  if (!recipientId || invitation.participants.length !== 2) {
    throw new Error('Game invitation participants are invalid');
  }
  const cancelled = await prisma.$executeRaw`
		UPDATE game_invitations
		SET status = 'cancelled', resolved_at = NOW(3)
		WHERE invitation_id = ${payload.invitationId}
			AND status = 'pending'
			AND created_at >= ${new Date(Date.now() - GAME_INVITATION_TTL_MS)}
	`;
  if (cancelled !== 1) throw new Error('Game invitation is already resolved');

  const cancellation = {
    invitationId: payload.invitationId,
    chatId: invitation.chatId,
    fromUserId: socket.userId,
    toUserId: recipientId,
  };
  io.to(`user-${socket.userId}`).emit('game:cancelled', cancellation);
  io.to(`user-${recipientId}`).emit('game:cancelled', cancellation);
}

const GAME_LEAVE_DELAY_MS = 4000;
const pendingLeaves = new Map<string, NodeJS.Timeout>();

function cancelPendingLeave(gameId: string, userId: string) {
  const key = `${gameId}:${userId}`;
  const timer = pendingLeaves.get(key);
  if (!timer) return;
  clearTimeout(timer);
  pendingLeaves.delete(key);
}

export async function handleGameClose(
  io: Server,
  socket: Socket,
  payload: gameCloseInput
): Promise<void> {
  if (!socket.userId) throw new Error('Authentication required');
  const userId = socket.userId;
  const game = await prisma.game.findUnique({ where: { id: payload.gameId } });
  if (!game || (game.playerXId !== userId && game.playerOId !== userId)) {
    throw new Error('Game not found or access denied');
  }

  const opponentLeftAt = game.playerXId === userId ? game.playerOLeftAt : game.playerXLeftAt;
  if (!opponentLeftAt) return performGameClose(io, userId, payload);

  // Second leaver is delayed so a page refresh does not end the game for good
  const key = `${payload.gameId}:${userId}`;
  if (pendingLeaves.has(key)) return;
  pendingLeaves.set(
    key,
    setTimeout(() => {
      pendingLeaves.delete(key);
      performGameClose(io, userId, payload).catch((error) => {
        console.error('Failed to persist game departure:', error);
      });
    }, GAME_LEAVE_DELAY_MS)
  );
}

async function performGameClose(
  io: Server,
  userId: string,
  payload: gameCloseInput
): Promise<void> {
  const result = await prisma.$transaction(async (tx) => {
    await tx.$queryRaw`SELECT id FROM games WHERE id = ${payload.gameId} FOR UPDATE`;
    const game = await tx.game.findUnique({ where: { id: payload.gameId } });
    if (!game || (game.playerXId !== userId && game.playerOId !== userId)) {
      throw new Error('Game not found or access denied');
    }
    if (game.closedAt) return { game, alreadyLeft: true, closed: true };
    const ownLeftAt = game.playerXId === userId ? game.playerXLeftAt : game.playerOLeftAt;
    if (ownLeftAt) return { game, alreadyLeft: true, closed: false };

    const opponentLeftAt = game.playerXId === userId ? game.playerOLeftAt : game.playerXLeftAt;
    const updatedGame = await tx.game.update({
      where: { id: game.id },
      data: {
        ...(game.playerXId === userId
          ? { playerXLeftAt: new Date() }
          : { playerOLeftAt: new Date() }),
        ...(opponentLeftAt ? { closedAt: new Date() } : {}),
      },
    });
    return {
      game: updatedGame,
      alreadyLeft: false,
      closed: Boolean(opponentLeftAt),
      opponentId: game.playerXId === userId ? game.playerOId : game.playerXId,
    };
  });
  if (result.alreadyLeft) return;
  if (!result.closed) {
    io.to(`user-${result.opponentId}`).emit('game:opponent-left', {
      gameId: result.game.id,
      userId,
    });
    return;
  }
  const closePayload = { gameId: result.game.id, closedByUserId: userId };

  io.to(`user-${result.game.playerXId}`).emit('game:closed', closePayload);
  io.to(`user-${result.game.playerOId}`).emit('game:closed', closePayload);
}

export async function handleGameGetState(
  io: Server,
  socket: Socket,
  payload: gameStateInput
): Promise<void> {
  if (!socket.userId) throw new Error('Authentication required');
  const game = await prisma.game.findUnique({ where: { id: payload.gameId } });
  if (!game || (game.playerXId !== socket.userId && game.playerOId !== socket.userId)) {
    throw new Error('Game not found or access denied');
  }
  socket.data.activeGameId = game.id;
  cancelPendingLeave(game.id, socket.userId);
  const leftAt = game.playerXId === socket.userId ? game.playerXLeftAt : game.playerOLeftAt;
  if (leftAt) {
    await prisma.game.update({
      where: { id: game.id },
      data: game.playerXId === socket.userId ? { playerXLeftAt: null } : { playerOLeftAt: null },
    });
    const opponentId = game.playerXId === socket.userId ? game.playerOId : game.playerXId;
    io.to(`user-${opponentId}`).emit('game:opponent-returned', {
      gameId: game.id,
      userId: socket.userId,
    });
  }
  const currentGame = leftAt
    ? await prisma.game.findUniqueOrThrow({ where: { id: game.id } })
    : game;
  const invitation = await getInvitationDetails(game.invitationId);
  socket.emit('game:state', { ...gameSnapshot(currentGame), chatId: invitation?.chatId ?? null });
}

export async function handleGameRequestRematch(
  io: Server,
  socket: Socket,
  payload: gameStateInput
): Promise<{
  invitationId: string;
  chatId: string;
  boardSize: number;
  fromUserId: string;
  toUserId: string;
}> {
  if (!socket.userId) throw new Error('Authentication required');
  const userId = socket.userId;
  const game = await prisma.game.findUnique({ where: { id: payload.gameId } });
  if (!game || (game.playerXId !== userId && game.playerOId !== userId)) {
    throw new Error('Game not found or access denied');
  }
  if ((!game.winnerId && !game.isDraw) || !game.closedAt) {
    throw new Error('A new game can only be invited after this game has ended');
  }

  const originalInvitation = await getInvitationDetails(game.invitationId);
  if (!originalInvitation) throw new Error('Original game chat not found');
  const chatId = originalInvitation.chatId;
  const opponentId = game.playerXId === userId ? game.playerOId : game.playerXId;
  const invitation = await prisma.$transaction(async (tx) => {
    await tx.$queryRaw`SELECT id FROM chats WHERE id = ${chatId} FOR UPDATE`;
    await tx.$executeRaw`
			UPDATE game_invitations
			SET status = 'expired', resolved_at = NOW(3)
			WHERE chat_id = ${chatId} AND status = 'pending'
				AND sender_id IS NOT NULL
				AND created_at < ${new Date(Date.now() - GAME_INVITATION_TTL_MS)}
		`;
    const pending = await tx.$queryRaw<
      {
        invitationId: string;
        fromUserId: string;
        toUserId: string;
        boardSize: number;
      }[]
    >`
			SELECT invitation_id AS invitationId, sender_id AS fromUserId,
				recipient_id AS toUserId, board_size AS boardSize
			FROM game_invitations
			WHERE chat_id = ${chatId} AND status = 'pending' AND sender_id IS NOT NULL
			LIMIT 1
		`;
    if (pending.length) return pending[0];

    const invitationId = randomUUID();
    await tx.$executeRaw`
			INSERT INTO game_invitations
				(invitation_id, status, sender_id, recipient_id, chat_id, board_size)
			VALUES
				(${invitationId}, 'pending', ${userId}, ${opponentId}, ${chatId}, ${game.boardSize})
		`;
    return { invitationId, fromUserId: userId, toUserId: opponentId, boardSize: game.boardSize };
  });

  const response = { ...invitation, chatId };
  if (invitation.fromUserId === userId) {
    io.to(`user-${opponentId}`).emit('game:rematch-invitation', response);
  }
  return response;
}

export async function handleGameRestart(): Promise<void> {
  throw new Error('Online games must be restarted through a new invitation');
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
  const invitationDetails = winnerId ? await getInvitationDetails(game.invitationId) : null;
  if (winnerId && !invitationDetails) throw new Error('Game invitation not found');

  const winMessages = [
    'Haha, I won!',
    'Victory is mine!',
    'Looks like I won! 😎',
    'And that’s a win for me!',
    'Game over, I won!',
    'Better luck next time!',
    'Winner winner, that’s me!',
    'I came, I played, I won!',
    'Another victory! 🎉',
    'Yes! I won this one! 🏆',
  ];

  const result = await prisma.$transaction(async (tx) => {
    const update = await tx.game.updateMany({
      where: {
        id: game.id,
        currentTurnUserId: userId,
        winnerId: null,
        isDraw: false,
        closedAt: null,
      },
      data: {
        board: nextBoard,
        currentTurnUserId: winnerId || isDraw ? userId : nextTurnUserId,
        winnerId,
        isDraw,
        winningLine: winningLine ?? [],
        ...(winnerId || isDraw ? { closedAt: new Date() } : {}),
      },
    });
    if (update.count !== 1) throw new Error('Game state changed; reload the board');

    const updatedGame = await tx.game.findUniqueOrThrow({ where: { id: game.id } });
    if (!winnerId || !invitationDetails) return { updatedGame, winnerMessage: null };

    const winnerMessage = await tx.message.create({
      data: {
        chatId: invitationDetails.chatId,
        senderId: winnerId,
        content: winMessages[Math.floor(Math.random() * winMessages.length)],
        type: 'text',
      },
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
            profilePhoto: { select: { id: true, name: true } },
          },
        },
      },
    });
    return { updatedGame, winnerMessage };
  });
  emitAnalyticsUpdated(userId);
  const snapshot = gameSnapshot(result.updatedGame);
  io.to(`user-${game.playerXId}`).emit('game:state', snapshot);
  io.to(`user-${game.playerOId}`).emit('game:state', snapshot);
  if (result.winnerMessage) {
    const opponentId = winnerId === game.playerXId ? game.playerOId : game.playerXId;
    io.to(`user-${opponentId}`).emit('new-chat-message', result.winnerMessage);
  }
}
