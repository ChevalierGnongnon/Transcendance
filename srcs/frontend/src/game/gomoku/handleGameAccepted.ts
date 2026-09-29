import { randomUUID } from "crypto";

const games = new Map();

export async function handleGameAccept(io, socket, payload) {
  const { fromUserId, toUserId, boardSize } = payload;

  const gameId = randomUUID();

  games.set(gameId, {
    gameId,
    boardSize,
    players: [fromUserId, toUserId],
    board: [],
  });

  io.to(`user-${fromUserId}`).emit("game:accepted", {
    gameId,
    boardSize,
  });

  io.to(`user-${toUserId}`).emit("game:accepted", {
    gameId,
    boardSize,
  });
}