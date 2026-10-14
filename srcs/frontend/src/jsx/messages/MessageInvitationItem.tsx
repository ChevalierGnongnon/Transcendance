import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { MessageProps } from './types.js';
import { socket } from './socket.js';
import { useNavigate } from "react-router-dom";


function MessageInvitationItem( props: MessageProps ) {
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
            <div className="game-invite-box card p-2 m-2">
              <span className="text-message">
                {resolvedState === 'accepted'
                  ? 'Invitation accepted'
                  : resolvedState === 'declined'
                    ? 'Invitation declined'
                    : resolvedState === 'expired'
                      ? 'Invitation expired'
                    : t('game.invite_message')}
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
                  {t('game.accept')}
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
                  {t('game.decline')}
                </button>
              </div>
            </div>
          </>
  );
}

export default MessageInvitationItem;