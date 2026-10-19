import { useState, useEffect, useCallback } from 'react';

import '../../scss/common-classes.scss';
import '../../scss/messages.scss';
import { useAuth } from '../auth/auth-context';
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
  const [relationship, setRelationship] = useState<Relationship>({
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
          chatId={chat.chatId}
          userId={chat.user.id}
          pseudo={chat.user.pseudo}
          onSetActiveView={roomProps.setActiveView}
          onLoadRelationship={loadRelationship}
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
          onLoadRelationship={loadRelationship}
        />
      </div>
    </>
  );
}

export default ChatRoom;
