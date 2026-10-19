import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { socket } from './socket';
import { useAuth } from '../auth/auth-context';
import type { IMessage, MessageStatus, User } from './types';
import MessageInput from './MessageInput';

interface ChatRoomFooterProps {
  chatId: string;
  userId: string;
  sender: User;
  isBlocked: boolean;
  onAddMessage: (message: IMessage) => void;
  onUpdateMessage: (message: IMessage, status: MessageStatus) => void;
  onLoadRelationship: () => Promise<void>;
}

function ChatRoomFooter({
  chatId,
  userId,
  sender,
  isBlocked,
  onAddMessage,
  onUpdateMessage,
  onLoadRelationship,
}: ChatRoomFooterProps) {
  const { t } = useTranslation();

  const { logout } = useAuth();
  const [messageText, setMessageText] = useState<string>('');

  const handleSendMessage = (fileId?: string) => {
    if (!socket?.connected) return;
    if (!fileId && !messageText.trim()) return;

    const content = fileId ?? messageText.trim();
    const messageType = fileId ? 'file' : 'text';
    const messageToSend: IMessage = {
      id: crypto.randomUUID(),
      chatId: chatId,
      recipientId: userId,
      sender: { id: sender.id, profilePhoto: sender.profilePhoto },
      content: content,
      type: messageType,
      status: 'sending',
    };

    onAddMessage(messageToSend);

    socket.emit('new-chat-message', messageToSend, (res: any) => {
      if (res.ok) {
        onUpdateMessage(res.data, 'sent');
      } else {
        onUpdateMessage(messageToSend, 'error');
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

      await onLoadRelationship();
    } catch (e) {
      console.error('Error unBlockUser', e);
    }
  };

  if (isBlocked) {
    return (
      <div className="input-group group-new-message my-3 mt-auto">
        <input
          type="button"
          value={t('friends.unblock')}
          className="accept-button px-2"
          onClick={() => {
            unBlockUser(userId);
          }}
        />
      </div>
    );
  }

  return (
    <MessageInput
      chatId={chatId}
      value={messageText}
      onChange={setMessageText}
      onSend={handleSendMessage}
    />
  );
}

export default ChatRoomFooter;
