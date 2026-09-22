import { useState } from 'react';

type Player = {
  id: string;
  username: string;
  symbol: string;
};

type Cell = string | null;
type Board = Cell[][];

const WIN_LENGTH = 5;

function createEmptyBoard(boardSize: number): Board {
  return Array.from({ length: boardSize }, () =>
    Array.from({ length: boardSize }, () => null)
  );
}

function useGomoku(playersFromSystem: Player[], boardSize: number) {
  const [players] = useState<Player[]>(playersFromSystem);
  const [board, setBoard] = useState<Board>(createEmptyBoard(boardSize));
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [winner, setWinner] = useState<Player | null>(null);
  const [winningLine, setWinningLine] = useState<number[][]>([]);

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
    setBoard(createEmptyBoard(boardSize));
    setCurrentPlayerIndex(0);
    setWinner(null);
    setWinningLine([]);
  };

  return {
    board,
    players,
    currentPlayerIndex,
    winner,
    winningLine,
    handleClick,
    reset
  };
}

export default useGomoku;
