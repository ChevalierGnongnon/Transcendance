import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { MessageProps } from '../types.js';
import { socket } from '../socket.js';

type InviteState = 'loading' | 'pending' | 'accepted' | 'declined' | 'expired' | 'error';

function MessageInvitationItem(props: MessageProps) {
  const { t } = useTranslation();
  const [state, setState] = useState<InviteState>('loading');
  const [isResponding, setIsResponding] = useState(false);

  useEffect(() => {
    if (props.type !== 'invitation' || !props.messageId) return;
    let cancelled = false;
    setState('loading');
    setIsResponding(false);

    const fetchStatus = () => {
      socket.emit(
        'game:get-invitation-status',
        { invitationId: props.messageId },
        (res: { ok: boolean; data?: { status: string } }) => {
          if (cancelled) return;
          if (!res.ok) return setState('error');
          const s = res.data?.status;
          setState(s === 'pending' || s === 'accepted' || s === 'declined' ? s : 'expired');
        }
      );
    };

    const onEvent = (next: InviteState) => (p: { invitationId?: string }) => {
      if (p.invitationId !== props.messageId) return;
      setState(next);
      setIsResponding(false);
    };
    const onAccepted = onEvent('accepted');
    const onDeclined = onEvent('declined');
    const onCancelled = onEvent('expired');

    fetchStatus();
    socket.on('connect', fetchStatus);
    socket.on('game:accepted', onAccepted);
    socket.on('game:declined', onDeclined);
    socket.on('game:cancelled', onCancelled);

    return () => {
      cancelled = true;
      socket.off('connect', fetchStatus);
      socket.off('game:accepted', onAccepted);
      socket.off('game:declined', onDeclined);
      socket.off('game:cancelled', onCancelled);
    };
  }, [props.messageId, props.type]);

  const respond = (event: 'game:accept' | 'game:decline') => {
    if (state !== 'pending' || isResponding) return;
    setIsResponding(true);
    socket.emit(
      event,
      {
        invitationId: props.messageId,
        chatId: props.chatId,
        fromUserId: props.senderId,
        toUserId: props.userId,
        boardSize: Number(props.content),
      },
      (response: { ok: boolean }) => {
        if (!response.ok) {
          setIsResponding(false);
          setState('error');
        }
      }
    );
  };

  const disabled = state !== 'pending' || isResponding || props.senderId === props.userId;

  return (
    <div className="game-invite-box card p-2 m-2">
      <span className="text-message">
        {state === 'accepted'
          ? 'Invitation accepted'
          : state === 'declined'
            ? 'Invitation declined'
            : state === 'expired'
              ? 'Invitation expired'
              : state === 'error'
                ? 'Invitation status unavailable'
                : t('game.invite_message')}
      </span>
      <div className="invite-actions">
        <button
          className="btn btn-success"
          disabled={disabled}
          onClick={() => respond('game:accept')}
        >
          {t('game.accept')}
        </button>
        <button
          className="btn btn-danger"
          disabled={disabled}
          onClick={() => respond('game:decline')}
        >
          {t('game.decline')}
        </button>
      </div>
    </div>
  );
}

export default MessageInvitationItem;
