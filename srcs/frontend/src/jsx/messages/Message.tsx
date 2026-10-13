import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { MessageProps } from './types.js';
import { socket } from './socket.js';
import { useNavigate } from "react-router-dom";

const previewable = ['image/png', 'image/webp', 'image/jpeg', 'image/gif', 'application/pdf'];

export const Message = (props: MessageProps) => {
  const navigate = useNavigate();

  const { t } = useTranslation();
  const [resolvedState, setResolvedState] = useState<'accepted' | 'declined' | 'expired' | null>(null);
  const [isResponding, setIsResponding] = useState(false);

  useEffect(() => {
    if (props.type !== 'invitation' || !props.messageId) return;

    socket.emit(
      'game:get-invitation-status',
      { invitationId: props.messageId },
      (response: { ok: boolean; data?: { status: string } }) => {
        if (!response.ok) return;
        if (response.data?.status === 'accepted' || response.data?.status === 'declined') {
          setResolvedState(response.data.status);
        } else if (response.data?.status !== 'pending') {
          setResolvedState('expired');
        }
      }
    );

    const handleAccepted = ({ invitationId }: { invitationId?: string }) => {
      if (invitationId === props.messageId) {
        setResolvedState('accepted');
        setIsResponding(false);
      }
    };

    const handleDeclined = ({ invitationId }: { invitationId?: string }) => {
      if (invitationId === props.messageId) {
        setResolvedState('declined');
        setIsResponding(false);
      }
    };

    const handleCancelled = ({ invitationId }: { invitationId?: string }) => {
      if (invitationId === props.messageId) {
        setResolvedState('expired');
        setIsResponding(false);
      }
    };

    socket.on('game:accepted', handleAccepted);
    socket.on('game:declined', handleDeclined);
    socket.on('game:cancelled', handleCancelled);

    return () => {
      socket.off('game:accepted', handleAccepted);
      socket.off('game:declined', handleDeclined);
      socket.off('game:cancelled', handleCancelled);
    };
  }, [props.messageId, props.type]);

  return (
    <>

      <li
        className={`d-flex align-items-start ${props.senderId === props.userId ? 'flex-row-reverse justify-content-start' : 'justify-content-start'}`}
      >
        <figure className="avatar-msg">
          <img
            src={
              props.profilePhoto.id
                ? `/api/${props.profilePhoto.id}/download`
                : '/default-avatar.png'
            }
            alt="avatar"
          />
        </figure>
        {props.type === 'text' && (
          <>
            <div
              className={`${props.senderId === props.userId ? 'message-right' : 'message-left'} card p-3 m-2 text-break`}
            >
              {props.content}
            </div>
          </>
        )}
        {props.type === 'invitation' && (
          <>
            <div className="game-invite-box card p-2 m-2">
              <span className="text-message">
                {resolvedState === 'accepted'
                  ? 'Invitation accepted'
                  : resolvedState === 'declined'
                    ? 'Invitation declined'
                    : resolvedState === 'expired'
                      ? 'Invitation expired'
                    : 'You invited to play Gomoku'}
              </span>
              <div className="invite-actions">
                <button
                  className="btn btn-success"
                  disabled={Boolean(resolvedState) || isResponding || props.senderId === props.userId || !props.messageId}
                  onClick={() => {
                    if (resolvedState || isResponding) return;
                    setIsResponding(true);
                    socket.emit("game:accept", {
                      invitationId: props.messageId,
                      chatId: props.chatId,
                      fromUserId: props.senderId,
                      toUserId: props.userId,
                      boardSize: Number(props.content),
                    }, (response: { ok: boolean }) => {
                      if (!response.ok) setIsResponding(false);
                    });
                  }}
                >
                  t{'game.accept'};
                </button>

                <button
                  className="btn btn-danger"
                  disabled={Boolean(resolvedState) || isResponding || props.senderId === props.userId || !props.messageId}
                  onClick={() => {
                    if (resolvedState || isResponding) return;
                    setIsResponding(true);
                    socket.emit("game:decline", {
                      invitationId: props.messageId,
                      chatId: props.chatId,
                      fromUserId: props.senderId,
                      toUserId: props.userId,
                      boardSize: Number(props.content),
                    }, (response: { ok: boolean }) => {
                      if (!response.ok) setIsResponding(false);
                    });
                  }}
                >
                  t{'game.decline'};
                </button>
              </div>
            </div>
          </>
        )}


    {props.type === "file" &&
      <>
        <div
          className={`${props.senderId === props.userId ? 'message-right' : 'message-left'} card p-3 m-2 text-break`}
        >
          <span className="text-message">{t('message.file-received')}</span>
          { /* file preview here if not previewable just use file type icon */ }
          <embed src="" type="" />
          { /* download button */ }
          <input type="button" className="btn btn-primary" value={t('common.download-file')} />
        </div>
      </>
    }
    </li>




    </>
  );
};