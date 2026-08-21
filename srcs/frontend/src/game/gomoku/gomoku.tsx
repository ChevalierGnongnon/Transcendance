import './scss/gomoku.scss'

import React from 'react';
import useGomoku from './useGomoku';
import GamePage from './GamePage';
import GameStart from './GameStart';

function Gomoku({ playersData, boardSize }) {
  const {
    board,
    players,
    currentPlayerIndex,
    winner,
    winningLine,
    handleClick,
    reset
  } = useGomoku(playersData, boardSize);


  const currentPlayer = players[currentPlayerIndex];

  return (
    <div className="gomoku-wrapper">
      <div className="gomoku-title">Gomoku</div>

      <div className="gomoku-info">
        {winner
          ? `Winner: ${winner.username}`
          : `Turn: ${currentPlayer.username}`}
      </div>

      <button className="gomoku-reset-btn" onClick={reset}>
        new game
      </button>

      <div
        className="gomoku-grid"
        style={{ gridTemplateColumns: `repeat(${board.length}, 40px)` }}
      >
        {board.map((row, rIdx) =>
          row.map((cell, cIdx) => {
            const isWinningCell = winningLine.some(
              ([wr, wc]) => wr === rIdx && wc === cIdx
            );

            return (
              <button
                key={`${rIdx}-${cIdx}`}
                className={`gomoku-cell ${isWinningCell ? 'win-cell' : ''}`}
                onClick={() => handleClick(rIdx, cIdx)}
                disabled={!!winner}
              >
                {cell}
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}

export default Gomoku;
