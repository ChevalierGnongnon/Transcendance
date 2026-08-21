import './scss/gomoku.scss'

import React from 'react';
import useGomoku from './useGomoku';

function Gomoku() {
  const { board, currentPlayer, winner, winningLine, handleClick, reset } = useGomoku();

  return (
    <div className="gomoku-wrapper">
      <div className="gomoku-title">Гра: 5 в ряд</div>

      <div className="gomoku-info">
        {winner ? `Переможець: ${winner}` : `Хід гравця: ${currentPlayer}`}
      </div>

      <button className="gomoku-reset-btn" onClick={reset}>
        Нова гра
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
                disabled={!!winner} // блокуємо кліки після перемоги
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
