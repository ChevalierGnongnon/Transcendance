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
    const userId = chat?.user?.id;
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
