import { useState, useEffect, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import '../../scss/messages.scss';
import { socket } from './socket';
import type { ActiveView } from './types';
import { Ban, CircleUserRound, CircleX, UserRoundPen } from 'lucide-react';
import { useAuth } from '../auth/auth-context';

export interface ChatRoomHeader {
  chatId: string;
  userId: string;
  pseudo: string;
  onSetActiveView: (view: ActiveView) => void;
  onLoadRelationship: () => Promise<void>;
}

function ChatRoomHeader({
  chatId,
  userId,
  pseudo,
  onSetActiveView,
  onLoadRelationship,
}: ChatRoomHeader) {
  const { t } = useTranslation();
  const { logout } = useAuth();
  const navigate = useNavigate();

  const blockUser = async (userId: string) => {
    try {
      const res = await fetch(`/api/social/blocks/${userId}`, {
        method: 'POST',
        credentials: 'include',
      });

      if (res.status === 401) {
        logout();
        throw new Error('Unauthorized, logging out...');
      }
      console.log(res);
      if (!res.ok) throw new Error(`HTTP error: ${res.status}`);

      await onLoadRelationship();
    } catch (e) {
      console.error('Error unBlockUser', e);
    }
  };

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
              blockUser(userId);
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
