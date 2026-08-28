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

    <div className="gomoku-info-bar">

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
        ) : currentPlayer.id === players[0].id
            ? "Your turn"
            : (<>
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
