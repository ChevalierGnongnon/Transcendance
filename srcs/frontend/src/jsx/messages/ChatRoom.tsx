import { useState, useEffect, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import '../../scss/common-classes.scss';
import '../../scss/messages.scss';
import MessageInput from './MessageInput';
import { socket } from './socket';
import type { IMessage, ChatRoomProps, MessageType } from './types.js';
import MessagesList from './MessagesList';
import { useAuth } from '../auth/auth-context';

function ChatRoom(roomProps: ChatRoomProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [messageText, setMessageText] = useState<string>('');
  const me = roomProps.me;
  const [relationship, setRelationship] = useState({
    isFriend: false,
    requestSent: false,
    requestReceived: false,
    blockedByMe: false,
    blockedMe: false,
  });
  const chatId = roomProps.chat.chatId;
  const messages = chatId ? (roomProps.messages.get(chatId) ?? []) : [];

  const loadRelationship = useCallback(async () => {
    const userId = roomProps.chat?.user?.id;
    if (!userId) return;

    try {
      const res = await fetch(`/api/social/relationship/${userId}`, {
        credentials: 'include',
      });

      if (res.status === 401) {
        logout();
        throw new Error('Unauthorized');
      }
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const data = await res.json();
      setRelationship(data);
    } catch (e) {
      console.error('Error get relationship', e);
    }
  }, [roomProps.chat?.user?.id, logout]);

  useEffect(() => {
    loadRelationship();
  }, [loadRelationship]);

  useEffect(() => {
    if (messages.length > 0) {
      const lastMessageId = messages[messages.length - 1].id ?? null;
      const lastMessageIdinChat = roomProps.chat.lastReadMessagesId;
      if (lastMessageId !== lastMessageIdinChat) {
        roomProps.updateLastReadMessageId(roomProps.chat.chatId, lastMessageId);
      }
    }
  }, [roomProps.chat?.chatId]);

  const handleSendMessage = (fileId?: string) => {
    if (!socket?.connected) return;
    if (!fileId && !messageText.trim()) return;

    const content = fileId ?? messageText.trim();
    const messageType = fileId ? 'file' : 'text';
    const messageToSend: IMessage = {
      chatId: roomProps.chat.chatId,
      recipientId: roomProps.chat.user.id,
      sender: { id: me.id, profilePhoto: me.profilePhoto },
      content: content,
      type: messageType,
    };

    socket.emit('new-chat-message', messageToSend);
    roomProps.onAddMessage(messageToSend);

    setMessageText('');
  };

  const unBlockUser = async (userId: string) => {
    try {
      const res = await fetch(`/api/social/blocks/${userId}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (res.status === 401) {
        logout();
        throw new Error('Unauthorized, logging out...');
      }
      if (!res.ok) throw new Error(`HTTP error: ${res.status}`);

      await loadRelationship();
    } catch (e) {
      console.error('Error unBlockUser', e);
    }
  };

  return (
    <>
      <div className="chat-list chat-list-right my-2">
        <div className="chat-header fs-1 d-flex align-items-center justify-content-between px-3">
          <button
            className="btn btn-link text-secondary fs-6 text-decoration-none p-0"
            onClick={() => {
              roomProps.setActiveView('chats');
            }}
          >
            {t('message.back')}
          </button>
          <div>{roomProps.chat.user.pseudo}</div>
          <button
            className="btn btn-link text-secondary fs-6 text-decoration-none p-0"
            onClick={() => {
              navigate(`/profile/${roomProps.chat.user.pseudo}`);
            }}
          >
            {t('message.go-to-profile')}
          </button>
        </div>
        <MessagesList me={me} chatId={roomProps.chat.chatId} messages={messages} />
        {relationship.blockedByMe ? (
          <div className="input-group group-new-message my-3 mt-auto">
            <input
              type="button"
              value={t('friends.unblock')}
              className="accept-button px-2"
              onClick={() => {
                unBlockUser(roomProps.chat.user.id);
              }}
            />
          </div>
        ) : (
          <MessageInput
            chatId={roomProps.chat.chatId}
            value={messageText}
            onChange={setMessageText}
            onSend={handleSendMessage}
          />
        )}
      </div>
    </>
  );
}

export default ChatRoom;
