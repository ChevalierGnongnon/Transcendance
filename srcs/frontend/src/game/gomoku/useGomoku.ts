import { useEffect, useRef, useState } from 'react';
import { socket } from '../../jsx/messages/socket';

type Player = {
  id: string;
  username: string;
  symbol: string;
  profilePhoto?: string;
};

type Cell = string | null;
type Board = Cell[][];

const WIN_LENGTH = 5;

function createEmptyBoard(boardSize: number): Board {
  return Array.from({ length: boardSize }, () =>
    Array.from({ length: boardSize }, () => null)
  );
}

type GameSnapshot = {
  gameId: string;
  chatId: string | null;
  board: Board;
  currentTurnUserId: string;
  players: { userId: string; symbol: string }[];
  winnerId: string | null;
  isDraw: boolean;
  winningLine: number[][];
  leftUserIds: string[];
  isClosed: boolean;
};

function useGomoku(
  playersFromSystem: Player[],
  boardSize: number,
  mode: string,
  gameId: string | undefined,
  myUserId: string,
  isConnected: boolean
) {
  const [players, setPlayers] = useState<Player[]>(playersFromSystem);
  const [board, setBoard] = useState<Board>(createEmptyBoard(boardSize));
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [winner, setWinner] = useState<Player | null>(null);
  const [winningLine, setWinningLine] = useState<number[][]>([]);
  const [isDraw, setIsDraw] = useState(false);
  const [chatId, setChatId] = useState<string | null>(null);
  const [opponentLeft, setOpponentLeft] = useState(false);
  const [isClosed, setIsClosed] = useState(false);
  const leaveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (mode !== 'online' || !gameId) return;

    const handleGameState = (snapshot: GameSnapshot) => {
      if (snapshot.gameId !== gameId) return;

      setBoard(snapshot.board);
      setPlayers((currentPlayers) => {
        let changed = false;
        const updatedPlayers = currentPlayers.map((player) => {
          const symbol = snapshot.players.find((entry) => entry.userId === player.id)?.symbol ?? player.symbol;
          if (symbol !== player.symbol) changed = true;
          return symbol === player.symbol ? player : { ...player, symbol };
        });
        return changed ? updatedPlayers : currentPlayers;
      });
      setCurrentPlayerIndex(snapshot.currentTurnUserId === myUserId ? 0 : 1);
      setWinner(snapshot.winnerId ? players.find((player) => player.id === snapshot.winnerId) ?? null : null);
      setIsDraw(snapshot.isDraw);
      setWinningLine(snapshot.winningLine);
      setChatId(snapshot.chatId);
      setOpponentLeft(snapshot.leftUserIds.some((leftUserId) => leftUserId !== myUserId));
      setIsClosed(snapshot.isClosed);
    };

    const handleOpponentLeft = ({ gameId: changedGameId }: { gameId: string }) => {
      if (changedGameId === gameId) setOpponentLeft(true);
    };

    const handleOpponentReturned = ({ gameId: changedGameId }: { gameId: string }) => {
      if (changedGameId === gameId) setOpponentLeft(false);
    };

    socket.on('game:state', handleGameState);
    socket.on('game:opponent-left', handleOpponentLeft);
    socket.on('game:opponent-returned', handleOpponentReturned);
    if (isConnected) socket.emit('game:get-state', { gameId });

    return () => {
      socket.off('game:state', handleGameState);
      socket.off('game:opponent-left', handleOpponentLeft);
      socket.off('game:opponent-returned', handleOpponentReturned);
    };
  }, [gameId, isConnected, mode, myUserId, players]);

  useEffect(() => {
    if (mode !== 'online' || !gameId) return;
    if (leaveTimerRef.current !== null) {
      clearTimeout(leaveTimerRef.current);
      leaveTimerRef.current = null;
    }
    return () => {
      leaveTimerRef.current = setTimeout(() => {
        socket.emit('game:leave', { gameId });
        leaveTimerRef.current = null;
      }, 0);
    };
  }, [gameId, mode]);

  const checkWin = (board: Board, row: number, col: number, symbol: string) => {
    const directions = [
      [1, 0],
      [0, 1],
      [1, 1],
      [1, -1],
    ];

    for (const [dRow, dCol] of directions) {
      let line: number[][] = [[row, col]];

      // назад
      let r = row - dRow;
      let c = col - dCol;
      while (
        r >= 0 &&
        r < boardSize &&
        c >= 0 &&
        c < boardSize &&
        board[r][c] === symbol
      ) {
        line.unshift([r, c]);
        r -= dRow;
        c -= dCol;
      }

      r = row + dRow;
      c = col + dCol;
      while (
        r >= 0 &&
        r < boardSize &&
        c >= 0 &&
        c < boardSize &&
        board[r][c] === symbol
      ) {
        line.push([r, c]);
        r += dRow;
        c += dCol;
      }

      if (line.length >= WIN_LENGTH) {
        return line;
      }
    }

    return null;
  };

  const handleClick = (row: number, col: number) => {
  if (winner || board[row][col] !== null) return;

  if (mode === "online") {
    if (players[currentPlayerIndex]?.id !== myUserId || !gameId || !isConnected) return;
    socket.emit('game:move', { gameId, row, col });
    return;
  }

    const player = players[currentPlayerIndex];
    const symbol = player.symbol;

    const newBoard = board.map(r => [...r]);
    newBoard[row][col] = symbol;

    const line = checkWin(newBoard, row, col, symbol);

    if (line) {
      setBoard(newBoard);
      setWinner(player);
      setWinningLine(line);
      return;
    }

    setBoard(newBoard);
    setCurrentPlayerIndex((currentPlayerIndex + 1) % players.length);
  };

  const reset = () => {
    if (mode === 'online') {
      if (gameId && isConnected && (winner || isDraw)) {
        socket.emit('game:new-round', { gameId });
      }
      return;
    }
    setBoard(createEmptyBoard(boardSize));
    setCurrentPlayerIndex(0);
    setWinner(null);
    setWinningLine([]);
    setIsDraw(false);
  };

  return {
    board,
    players,
    currentPlayerIndex,
    winner,
    isDraw,
    chatId,
    opponentLeft,
    isClosed,
    winningLine,
    handleClick,
    reset
  };
}

export default useGomoku;
