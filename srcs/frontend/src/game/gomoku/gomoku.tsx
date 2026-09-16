import './scss/gomoku.scss';

import React from 'react';
import useGomoku from './useGomoku';

function Gomoku({ playersData, boardSize, mode }) {
  const {
    board,
    players,
    currentPlayerIndex,
    winner,
    winningLine,
    handleClick,
    reset
  } = useGomoku(playersData, boardSize, mode);

  const currentPlayer = players[currentPlayerIndex];

  return (
    <div className="d-flex justify-content-center py-3">
      
      <div className="gomoku-card">

        <h2 className="text-center mb-3 gomoku-title">Gomoku</h2>

        
        <div className="gomoku-info-bar d-flex justify-content-between align-items-center mb-3">

          
          <div className={`player-box ${currentPlayer.id === players[0].id ? "active-turn" : ""}`}>
            <img
              src={players[0].avatar ? `/uploads/${players[0].avatar}` : "/default-avatar.png"}
              alt="me avatar"
              className="player-avatar"
            />
            <span className="player-name">{players[0].username}</span>
          </div>

          <div className="turn-info">
            {winner ? (
              <>
                Winner:<br />{winner.username}
              </>
            ) : currentPlayer.id === players[0].id ? (
              "Your turn"
            ) : (
              <>
                Waiting<br />opponent
              </>
            )}
          </div>

          <div className={`player-box ${currentPlayer.id === players[1].id ? "active-turn" : ""}`}>
            <img
              src={players[1].avatar ? `/uploads/${players[1].avatar}` : "/default-avatar.png"}
              alt="opponent avatar"
              className="player-avatar"
            />
            <span className="player-name">{players[1].username}</span>
          </div>
        </div>

        <div className="text-center mb-3">
          <button className="btn btn-primary gomoku-reset-btn" onClick={reset}>
            New Game
          </button>
        </div>

        <div
          className="gomoku-grid"
          style={{ gridTemplateColumns: `repeat(${board.length}, var(--cell-size))` }}
        >
          {board.map((row, rIdx) =>
            row.map((cell, cIdx) => {
              const isWinningCell = winningLine.some(
                ([wr, wc]) => wr === rIdx && wc === cIdx
              );

              return (
                <button
                  key={`${rIdx}-${cIdx}`}
                  className={`gomoku-cell btn ${isWinningCell ? 'win-cell' : ''}`}
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
    </div>
  );
}

export default Gomoku;
