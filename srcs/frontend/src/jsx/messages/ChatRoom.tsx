import { useState, useEffect, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import '../../scss/common-classes.scss';
import '../../scss/messages.scss';
import { socket } from './socket';
import { useAuth } from '../auth/auth-context';
import MessageInput from './MessageInput';
import MessagesList from './MessagesList';
import ChatRoomHeader from './ChatRoomHeader';
import type { IMessage, ChatRoomProps, MessageType } from './types.js';
import ChatRoomFooter from './ChatRoomFooter';

function ChatRoom(roomProps: ChatRoomProps) {
  console.log('Render ChatRoom');
  console.log(roomProps.otherLastReadMessagesId);
  const { t } = useTranslation();
  // const navigate = useNavigate();
  const { logout } = useAuth();
  // const [messageText, setMessageText] = useState<string>('');
  const [relationship, setRelationship] = useState({
    isFriend: false,
    requestSent: false,
    requestReceived: false,
    blockedByMe: false,
    blockedMe: false,
  });
  const { me, chat, messages, onAddMessage, onUpdateMessage, otherLastReadMessagesId } = roomProps;

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
  }, [chat?.user?.id, logout]);

  useEffect(() => {
    loadRelationship();
  }, [loadRelationship]);

  // Check
  useEffect(() => {
    if (messages.length > 0) {
      const lastMessageId = messages[messages.length - 1].id ?? null;
      const lastMessageIdinChat = roomProps.chat.mylastReadMessagesId;
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
      id: crypto.randomUUID(),
      chatId: roomProps.chat.chatId,
      recipientId: roomProps.chat.user.id,
      sender: { id: me.id, profilePhoto: me.profilePhoto },
      content: content,
      type: messageType,
      status: 'sending',
    };

    roomProps.onAddMessage(messageToSend);

    socket.emit('new-chat-message', messageToSend, (res: any) => {
      if (res.ok) {
        roomProps.onUpdateMessage(res.data, 'sent');
      } else {
        roomProps.onUpdateMessage(messageToSend, 'error');
      }
    });

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

  useEffect(() => {
    const handleAccepted = ({
      gameId,
      boardSize,
      fromUserId,
      toUserId,
      chatId,
    }: {
      chatId?: string;
      gameId: string;
      boardSize: number;
      fromUserId: string;
      toUserId: string;
    }) => {
      if (chatId !== roomProps.chat.chatId) return;
      const opponentId = fromUserId === me.id ? toUserId : fromUserId;
      navigate(`/game?gameId=${gameId}&opponentId=${opponentId}&boardSize=${boardSize}`, {
        state: {
          gameId,
          boardSize,
          me,
          opponentId,
          mode: 'online',
        },
      });
    };

    socket.on('game:accepted', handleAccepted);

    return () => {
      socket.off('game:accepted', handleAccepted);
    };
  }, [navigate, me, roomProps.chat.chatId]);

  return (
    <>
      <div className="chat-list chat-list-right my-2">
        <ChatRoomHeader
          pseudo={roomProps.chat.user.pseudo}
          onSetActiveView={roomProps.setActiveView}
        />

        <MessagesList
          me={me}
          chatId={chat.chatId}
          messages={messages}
          otherLastReadMessagesId={otherLastReadMessagesId}
        />

        <ChatRoomFooter
          chatId={chat.chatId}
          userId={chat.user.id}
          sender={me}
          isBlocked={relationship.blockedByMe}
          onAddMessage={onAddMessage}
          onUpdateMessage={onUpdateMessage}
          onLoadRelationship={loadRelationship}
        />

        {/*{relationship.blockedByMe ? (
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
            opponentId={roomProps.chat.user.id}
            value={messageText}
            onChange={setMessageText}
            onSend={handleSendMessage}
            // onAddMessage
            // onUpdateMessage
          />
        )}*/}
      </div>
    </>
  );
}

export default ChatRoom;
