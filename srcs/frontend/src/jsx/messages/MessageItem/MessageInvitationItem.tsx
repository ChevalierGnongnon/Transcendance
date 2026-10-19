import { useTranslation } from 'react-i18next';

import type { MessageProps } from '../types.js';
import { socket } from '../socket.js';
import { useEffect, useState } from 'react';

function MessageInvitationItem({ content }: { content: string }) {
  const { t } = useTranslation();

  return (
    <>
      <div className="game-invite-box card p-2 m-2">
        <span className="text-message">{t('message.game-invite')}</span>
        <p>{t('message.board-size', { size: content })}</p>
        <div className="invite-actions">
          <button
            className="btn btn-success"
            onClick={() => {
              socket.emit('game:invite:answer', 'accept');
              // 'naviagete to game page'
            }}
          >
            {t('message.accept')}
          </button>

          <button
            className="btn btn-danger"
            onClick={() => {
              socket.emit('game:invite:answer', 'decline');
            }}
          >
            {t('message.decline')}
          </button>
        </div>
      </div>
    </>
  );
}

export default MessageInvitationItem;
