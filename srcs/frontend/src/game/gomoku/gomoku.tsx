import './scss/gomoku.scss';

import React from 'react';
import useGomoku from './useGomoku';
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

type GomokuPlayer = {
  id: string;
  username: string;
  profilePhoto?: string;
  symbol: string;
};

type GomokuProps = {
  playersData: GomokuPlayer[];
  boardSize: number;
  mode: string;
  gameId?: string;
  myUserId?: string;
  isConnected?: boolean;
};

function Gomoku({
  playersData,
  boardSize,
  mode,
  gameId,
  myUserId = playersData[0]?.id ?? '',
  isConnected = true,
}: GomokuProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const {
    board,
    players,
    currentPlayerIndex,
    winner,
    isDraw,
    winningLine,
    handleClick,
    reset
  } = useGomoku(playersData, boardSize, mode, gameId, myUserId, isConnected);

  const currentPlayer = players[currentPlayerIndex];

  return (
    <div className="d-flex justify-content-center py-3">
      
      <div className="gomoku-card">

        <h2 className="text-center mb-3 gomoku-title">Gomoku</h2>

        
        <div className="gomoku-info-bar d-flex justify-content-between align-items-center mb-3">

          
          <div className={`player-box ${currentPlayer.id === players[0].id ? "active-turn" : ""}`}>
            <img
              src={players[0].profilePhoto ? `/uploads/${players[0].profilePhoto}` : "/default-avatar.png"}
              alt="me avatar"
              className="player-avatar"
            />
            <span className="player-name">{players[0].username}</span>
          </div>

          <div className="turn-info">
            {winner ? (
              <>
                {t("game.winner")}:<br />{winner.username}
              </>
            ) : isDraw ? (
              t("game.draw", "Draw")
            ) : currentPlayer.id === myUserId ? (
              t("game.your_turn")
            ) : (
              <>
                {t('game.waiting')}<br />{t('game.opponent')}
              </>
            )}
          </div>

          <div className={`player-box ${currentPlayer.id === players[1].id ? "active-turn" : ""}`}>
            <img
              src={players[1].profilePhoto ? `/uploads/${players[1].profilePhoto}` : "/default-avatar.png"}
              alt="opponent avatar"
              className="player-avatar"
            />
            <span className="player-name">{players[1].username}</span>
          </div>
        </div>

        <div className="text-center mb-3">
          <button
            className="btn btn-primary gomoku-reset-btn"
            onClick={reset}
            disabled={mode === 'online' && (!isConnected || (!winner && !isDraw))}
          >
            {t('game.new_game')}
          </button>
          <button className="btn btn-primary gomoku-reset-btn ms-3" onClick={() => navigate('/game/gomoku')}>
            {t('game.finish')}
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
                  disabled={!!winner || isDraw || (mode === 'online' && (!isConnected || currentPlayer.id !== myUserId || cell !== null))}
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
