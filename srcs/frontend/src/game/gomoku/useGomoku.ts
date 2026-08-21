import { useState } from 'react';

type Player = 'X' | 'O' | null;
type Board = Player[][];

const BOARD_SIZE = 10;
const WIN_LENGTH = 5;     ///////////////// change back to 5

function createEmptyBoard(): Board {
  return Array.from({ length: BOARD_SIZE }, () =>
    Array.from({ length: BOARD_SIZE }, () => null)
  );
}

function useGomoku() {
  const [board, setBoard] = useState<Board>(createEmptyBoard());
  const [currentPlayer, setCurrentPlayer] = useState<Player>('X');
  const [winner, setWinner] = useState<Player>(null);
  const [winningLine, setWinningLine] = useState<number[][]>([]);

  const getWinningLine = (
    board: Board,
    row: number,
    col: number,
    dRow: number,
    dCol: number,
    player: Player
  ): number[][] | null => {
    const line: number[][] = [];

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
        return null;
      }

      line.push([r, c]);
    }

    return line;
  };

const checkWin = (board: Board, row: number, col: number, player: Player) => {
  const directions = [
    [1, 0],   
    [0, 1],   
    [1, 1],
    [1, -1],
  ];

  for (const [dRow, dCol] of directions) {
    let line: number[][] = [[row, col]];

    let r = row - dRow;
    let c = col - dCol;
    while (
      r >= 0 &&
      r < BOARD_SIZE &&
      c >= 0 &&
      c < BOARD_SIZE &&
      board[r][c] === player
    ) {
      line.unshift([r, c]);
      r -= dRow;
      c -= dCol;
    }

    r = row + dRow;
    c = col + dCol;
    while (
      r >= 0 &&
      r < BOARD_SIZE &&
      c >= 0 &&
      c < BOARD_SIZE &&
      board[r][c] === player
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

    const newBoard = board.map((r) => [...r]);
    newBoard[row][col] = currentPlayer;

    const line = checkWin(newBoard, row, col, currentPlayer);

    if (line) {
      setBoard(newBoard);
      setWinner(currentPlayer);
      setWinningLine(line);
      return;
    }

    setBoard(newBoard);
    setCurrentPlayer(currentPlayer === 'X' ? 'O' : 'X');
  };

  const reset = () => {
    setBoard(createEmptyBoard());
    setCurrentPlayer('X');
    setWinner(null);
    setWinningLine([]);
  };

  return { board, currentPlayer, winner, winningLine, handleClick, reset };
}

export default useGomoku;


//replace X O to variables.arr[]