import { useState, useEffect, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

// import '../../scss/common-classes.scss';
import '../../scss/messages.scss';
import { socket } from './socket';
import type { ActiveView } from './types';
import { Ban, CircleUserRound, CircleX, UserRoundPen } from 'lucide-react';

export interface ChatRoomHeader {
  pseudo: string;
  onSetActiveView: (view: ActiveView) => void;
}

function ChatRoomHeader({ pseudo, onSetActiveView }: ChatRoomHeader) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <>
      <div className="chat-header fs-1 d-flex align-items-center justify-content-between px-3">
        <button
          className="btn btn-link text-secondary fs-6 text-decoration-none p-0"
          title={t('message.back')}
          onClick={() => {
            onSetActiveView('chats');
          }}
        >
          <CircleX size={32} />
        </button>
        <div>{pseudo}</div>

        <div className="d-flex gap-2">
          <button
            className="btn btn-link text-secondary fs-6 text-decoration-none p-0"
            title={t('message.block')}
            onClick={() => {
              navigate(`/profile/${pseudo}`);
            }}
          >
            <Ban size={32} />
          </button>

          <button
            className="btn btn-link text-secondary fs-6 text-decoration-none p-0"
            title={t('message.go-to-profile')}
            onClick={() => {
              navigate(`/profile/${pseudo}`);
            }}
          >
            <CircleUserRound size={32} />
          </button>
        </div>
      </div>
    </>
  );
}

export default ChatRoomHeader;
