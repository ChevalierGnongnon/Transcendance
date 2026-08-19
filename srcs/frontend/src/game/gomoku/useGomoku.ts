import { useState } from 'react';

type Player = 'X' | 'O' | null;
type Board = Player[][];

const BOARD_SIZE = 10;
const WIN_LENGTH = 5;

function createEmptyBoard(): Board {
  return Array.from({ length: BOARD_SIZE }, () =>
    Array.from({ length: BOARD_SIZE }, () => null)
  );
}

function useGomoku() {
  const [board, setBoard] = useState<Board>(createEmptyBoard());
  const [currentPlayer, setCurrentPlayer] = useState<Player>('X');
  const [winner, setWinner] = useState<Player>(null);

  const checkDirection = (
    board: Board,
    row: number,
    col: number,
    dRow: number,
    dCol: number,
    player: Player
  ): boolean => {
    for (let i = 0; i < WIN_LENGTH; i++) {
      const r = row + i * dRow;
      const c = col + i * dCol;

      if (
        r < 0 ||
        r >= BOARD_SIZE ||
        c < 0 ||
        c >= BOARD_SIZE ||
        board[r][c] !== player
      ) {
        return false;
      }
    }
    return true;
  };

  const checkWin = (board: Board, row: number, col: number, player: Player) => {
    const directions = [
      [1, 0],   // вниз
      [0, 1],   // вправо
      [1, 1],   // діагональ вниз-право
      [1, -1],  // діагональ вниз-ліво
    ];

    return directions.some(([dRow, dCol]) =>
      checkDirection(board, row, col, dRow, dCol, player)
    );
  };

  const handleClick = (row: number, col: number) => {
    if (winner || board[row][col] !== null) return;

    const newBoard = board.map((r) => [...r]);
    newBoard[row][col] = currentPlayer;

    if (checkWin(newBoard, row, col, currentPlayer)) {
      setBoard(newBoard);
      setWinner(currentPlayer);
      return;
    }

    setBoard(newBoard);
    setCurrentPlayer(currentPlayer === 'X' ? 'O' : 'X');
  };

  const reset = () => {
    setBoard(createEmptyBoard());
    setCurrentPlayer('X');
    setWinner(null);
  };

  return { board, currentPlayer, winner, handleClick, reset };
}

export default useGomoku;
