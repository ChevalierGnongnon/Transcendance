import { useState, useEffect, useCallback } from 'react';

import '../../scss/common-classes.scss';
import '../../scss/messages.scss';
import { useAuth } from '../auth/auth-context';
import { useNavigate } from 'react-router-dom';
import { socket } from './socket';
import MessagesList from './MessagesList';
import ChatRoomHeader from './ChatRoomHeader';
import ChatRoomFooter from './ChatRoomFooter';
import type {
  User,
  ActiveView,
  IChatPreview,
  IMessage,
  MessageStatus,
  Relationship,
} from './types.js';

export interface ChatRoomProps {
  me: User;
  chat: IChatPreview;
  setActiveView: (view: ActiveView) => void;
  messages: IMessage[];
  onAddMessage: (message: IMessage) => void;
  onUpdateMessage: (message: IMessage, status: MessageStatus) => void;
  otherLastReadMessagesId: string | null;
}

function ChatRoom(roomProps: ChatRoomProps) {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [relationship, setRelationship] = useState<Relationship>({
    isFriend: false,
    requestSent: false,
    requestReceived: false,
    blockedByMe: false,
    blockedMe: false,
  });
  const { me, chat, messages, onAddMessage, onUpdateMessage, otherLastReadMessagesId } = roomProps;
  const userId = chat.user.id;

  const loadRelationship = useCallback(async () => {
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
  }, [userId, logout]);

  useEffect(() => {
    loadRelationship();
  }, [loadRelationship]);

  useEffect(() => {
    const updateRelationship = async (data: { userId: string }) => {
      if (data?.userId === me?.id) {
        loadRelationship();
      }
    };

    socket.on('relationship:update', updateRelationship);

    return () => {
      socket.off('relationship:update', updateRelationship);
    };
  }, []);

  const blockUser = async () => {
    try {
      const res = await fetch(`/api/social/blocks/${userId}`, {
        method: 'POST',
        credentials: 'include',
      });

      if (res.status === 401) {
        logout();
        throw new Error('Unauthorized, logging out...');
      }
      if (!res.ok) throw new Error(`HTTP error: ${res.status}`);

      loadRelationship();

      socket.emit('relationship:update', { fromId: me.id, toId: chat.user.id });
    } catch (e) {
      console.error('Error unBlockUser', e);
    }
  };

  /**
   * Unblocks a user by their ID and reloads the relationship data.
   */
  const unBlockUser = async () => {
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

      loadRelationship();

      socket.emit('relationship:update', { fromId: me.id, toId: chat.user.id });
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
          chatId={chat.chatId}
          userId={chat.user.id}
          pseudo={chat.user.pseudo}
          onSetActiveView={roomProps.setActiveView}
          onBlock={blockUser}
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
          relationship={relationship}
          onAddMessage={onAddMessage}
          onUpdateMessage={onUpdateMessage}
          onUnBlock={unBlockUser}
        />
      </div>
    </>
  );
}

export default ChatRoom;
