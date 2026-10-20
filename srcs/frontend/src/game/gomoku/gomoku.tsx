import './scss/gomoku.scss';

import React, { useEffect, useState } from 'react';
import useGomoku from './useGomoku';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { socket } from '../../jsx/messages/socket';

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

type RematchInvitation = {
  invitationId: string;
  chatId: string;
  boardSize: number;
  fromUserId: string;
  toUserId: string;
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
    chatId,
    opponentLeft,
    isClosed: gameIsClosed,
    winningLine,
    handleClick,
    reset,
  } = useGomoku(playersData, boardSize, mode, gameId, myUserId, isConnected);

  const [isLeaving, setIsLeaving] = useState(false);
  const [rematchInvitation, setRematchInvitation] = useState<RematchInvitation | null>(null);
  const [isRematchSending, setIsRematchSending] = useState(false);
  const [rematchError, setRematchError] = useState('');
  const currentPlayer = players[currentPlayerIndex];
  const isFinished = Boolean(winner || isDraw || gameIsClosed);

  useEffect(() => {
    if (mode !== 'online' || !gameId) return;

    const handleClosed = ({ gameId: closedGameId }: { gameId?: string }) => {
      if (closedGameId === gameId) setIsLeaving(true);
    };

    const handleRematchInvitation = (invitation: RematchInvitation) => {
      if (invitation.toUserId !== myUserId || invitation.fromUserId !== players[1]?.id) return;
      setRematchError('');
      setRematchInvitation(invitation);
    };

    const handleRematchAccepted = (invitation: RematchInvitation & { gameId: string }) => {
      if (invitation.invitationId !== rematchInvitation?.invitationId) return;
      const opponentId =
        invitation.fromUserId === myUserId ? invitation.toUserId : invitation.fromUserId;
      if (opponentId !== players[1]?.id) return;
      navigate(
        `/game?gameId=${invitation.gameId}&opponentId=${opponentId}&boardSize=${invitation.boardSize}`,
        {
          replace: true,
        }
      );
      setRematchInvitation(null);
    };

    const handleRematchDeclined = ({ invitationId }: { invitationId: string }) => {
      if (invitationId !== rematchInvitation?.invitationId) return;
      setRematchInvitation(null);
      setIsRematchSending(false);
      setRematchError(`${players[1]?.username ?? t('game.opponent')} ${t('game.rematch_decline')}`);
    };

    const handleRematchCancelled = ({ invitationId }: { invitationId: string }) => {
      if (invitationId !== rematchInvitation?.invitationId) return;
      setRematchInvitation(null);
      setIsRematchSending(false);
      setRematchError(t('game.rematch_invite_cancel'));
    };

    socket.on('game:closed', handleClosed);
    socket.on('game:rematch-invitation', handleRematchInvitation);
    socket.on('game:accepted', handleRematchAccepted);
    socket.on('game:declined', handleRematchDeclined);
    socket.on('game:cancelled', handleRematchCancelled);
    return () => {
      socket.off('game:closed', handleClosed);
      socket.off('game:rematch-invitation', handleRematchInvitation);
      socket.off('game:accepted', handleRematchAccepted);
      socket.off('game:declined', handleRematchDeclined);
      socket.off('game:cancelled', handleRematchCancelled);
    };
  }, [gameId, mode, myUserId, navigate, players, rematchInvitation, t]);

  const handleCloseGame = () => {
    if (mode === 'online' && gameId) {
      socket.emit('game:leave', { gameId });
      setIsLeaving(true);
    }
    navigate('/game/gomoku');
  };

  const handleNewGame = () => {
    if (!gameId || !isConnected || !isFinished || rematchInvitation || isRematchSending) return;
    setRematchError('');
    setIsRematchSending(true);
    socket.emit(
      'game:request-rematch',
      { gameId },
      (response: { ok: boolean; data?: RematchInvitation; error?: { message?: string } }) => {
        setIsRematchSending(false);
        if (!response.ok || !response.data) {
          setRematchError(response.error?.message ?? t('game.rematch_invite_error'));
          return;
        }
        setRematchInvitation(response.data);
      }
    );
  };

  const respondToRematch = (accept: boolean) => {
    if (!rematchInvitation) return;
    socket.emit(
      accept ? 'game:accept' : 'game:decline',
      rematchInvitation,
      (response: { ok: boolean; error?: { message?: string } }) => {
        if (!response.ok) {
          setRematchError(response.error?.message ?? t('game.rematch_invite_expired'));
          return;
        }
        if (!accept) setRematchInvitation(null);
      }
    );
  };

  const cancelRematch = () => {
    if (!rematchInvitation || rematchInvitation.fromUserId !== myUserId) return;
    socket.emit(
      'game:cancel-invitation',
      { invitationId: rematchInvitation.invitationId },
      (response: { ok: boolean; error?: { message?: string } }) => {
        if (!response.ok) {
          setRematchError(response.error?.message ?? t('game.rematch_cancel_error'));
          return;
        }
        setRematchInvitation(null);
      }
    );
  };

  return (
    <div className="container-fluid d-flex justify-content-center py-3 px-2">
      <div className="gomoku-card p-2 p-md-3 mw-100">
        <h2 className="text-center mb-3 gomoku-title">Gomoku</h2>

        <div className="gomoku-info-bar d-flex flex-column flex-sm-row justify-content-between align-items-center gap-2 mb-3">
          <div
            className={`player-box ${currentPlayer?.id === players[0]?.id ? 'active-turn' : ''}`}
          >
            <img
              src={
                players[0]?.profilePhoto
                  ? `/uploads/${players[0].profilePhoto}`
                  : '/default-avatar.png'
              }
              alt="me avatar"
              className="player-avatar"
            />
            <span className="player-name">{players[0]?.username}</span>
          </div>

          <div className="turn-info">
            {winner ? (
              <>
                {t('game.winner')}:<br />
                {winner.username}
              </>
            ) : isDraw ? (
              t('game.draw')
            ) : opponentLeft ? (
              t('game.opponent_left')
            ) : gameIsClosed ? (
              t('game.game_finished')
            ) : currentPlayer?.id === myUserId ? (
              t('game.your_turn')
            ) : (
              <>
                {t('game.waiting')}
                <br />
                {t('game.opponent')}
              </>
            )}
          </div>

          <div
            className={`player-box ${currentPlayer?.id === players[1]?.id ? 'active-turn' : ''}`}
          >
            <img
              src={
                players[1]?.profilePhoto
                  ? `/uploads/${players[1].profilePhoto}`
                  : '/default-avatar.png'
              }
              alt="opponent avatar"
              className="player-avatar"
            />
            <span className="player-name">{players[1]?.username}</span>
          </div>
        </div>

        <div className="text-center mb-3">
          <button
            className="btn btn-primary gomoku-reset-btn"
            onClick={mode === 'online' ? handleNewGame : reset}
            disabled={
              mode === 'online' &&
              (!isConnected || !isFinished || isRematchSending || Boolean(rematchInvitation))
            }
          >
            {t('game.new_game')}
          </button>
          <button
            className="btn btn-primary gomoku-reset-btn ms-3"
            onClick={handleCloseGame}
            disabled={isLeaving}
          >
            {t('game.finish')}
          </button>
        </div>

        {rematchInvitation ? (
          <div className="game-invite-box card p-3 m-2">
            <span className="text-message">
              {rematchInvitation.fromUserId === myUserId
                ? t('game.rematch_pending_response')
                : `${players[1]?.username ?? t('game.opponent')} ${t('game.rematch_new_invite')}`}
            </span>
            {rematchInvitation.toUserId === myUserId && (
              <div className="invite-actions mt-2">
                <button className="btn btn-success me-2" onClick={() => respondToRematch(true)}>
                  {t('game.accept')}
                </button>

                <button className="btn btn-danger" onClick={() => respondToRematch(false)}>
                  {t('game.decline')}
                </button>
              </div>
            )}
            {rematchInvitation.fromUserId === myUserId && (
              <button className="btn btn-danger mt-2" onClick={cancelRematch}>
                {t('game.invite_cancel')}
              </button>
            )}
          </div>
        ) : null}
        {isFinished && !rematchInvitation && (
          <div className="game-invite-box card p-3 m-2 text-center">
            {rematchError || (winner ? `${winner.username} ${t('game.won')}` : t('game.draw'))}
          </div>
        )}
        <div
          className="gomoku-grid"
          style={
            {
              '--cols': board.length,
              gridTemplateColumns: `repeat(${board.length}, var(--cell-size))`,
            } as React.CSSProperties
          }
        >
          {board.map((row, rIdx) =>
            row.map((cell, cIdx) => {
              const isWinningCell = winningLine.some(([wr, wc]) => wr === rIdx && wc === cIdx);
              return (
                <button
                  key={`${rIdx}-${cIdx}`}
                  className={`gomoku-cell btn ${isWinningCell ? 'win-cell' : ''}`}
                  onClick={() => handleClick(rIdx, cIdx)}
                  disabled={
                    !!winner ||
                    isDraw ||
                    gameIsClosed ||
                    opponentLeft ||
                    (mode === 'online' &&
                      (!isConnected || currentPlayer?.id !== myUserId || cell !== null))
                  }
                >
                  {cell}
                </button>
              );
            })
          )}
        </div>
        {rematchError && (
          <p role="alert" className="text-danger">
            {rematchError}
          </p>
        )}
      </div>
    </div>
  );
}

export default Gomoku;
