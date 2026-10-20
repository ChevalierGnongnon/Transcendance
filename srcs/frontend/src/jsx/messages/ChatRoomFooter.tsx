import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import '../../scss/common-classes.scss';
import { socket } from './socket';
import { useAuth } from '../auth/auth-context';
import MessageInput from './MessageInput';
import type { IMessage, MessageStatus, User, Relationship } from './types';

interface ChatRoomFooterProps {
  chatId: string;
  userId: string;
  sender: User;
  relationship: Relationship;
  onAddMessage: (message: IMessage) => void;
  onUpdateMessage: (message: IMessage, status: MessageStatus) => void;
  onUnBlock: () => Promise<void>;
}

function ChatRoomFooter({
  chatId,
  userId,
  sender,
  relationship,
  onAddMessage,
  onUpdateMessage,
  onUnBlock,
}: ChatRoomFooterProps) {
  const { t } = useTranslation();

  const { logout } = useAuth();
  const [messageText, setMessageText] = useState<string>('');

  const deleteFile = async (fileId: string) => {
    try {
      const res = await fetch(`/api/${fileId}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (res.status === 401) {
        logout();
        throw new Error('Unauthorized, logging out...');
      }
      if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
    } catch (e) {
      console.error('Error delete file', e);
    }
  };

  /**
   * Sends a text message or a file via web socket.
   *
   * @param fileId - Optional identifier of the file to be sent.
   * If provided, the message is treated as a file; otherwise, the text from the input field is sent.
   */
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
        if (messageToSend.type === 'file') {
          deleteFile(messageToSend.content);
        }
      }
    });

    setMessageText('');
  };

  if (relationship.blockedByMe || relationship.blockedMe) {
    return (
      <>
        {relationship.blockedByMe && (
          <div className="input-group group-new-message my-3 mt-auto">
            <input
              type="button"
              value={t('friends.unblock')}
              className="accept-button px-2"
              onClick={() => {
                // unBlockUser(userId);
                onUnBlock();
              }}
            />
          </div>
        )}

        {relationship.blockedMe && (
          <div className="alert alert-danger message-blocked">{t('message.you-are-blocked')}</div>
        )}
      </>
    );
  }

  return (
    <MessageInput
      chatId={chatId}
      userId={userId}
      opponentId={userId}
      sender={sender}
      value={messageText}
      onChange={setMessageText}
      onSend={handleSendMessage}
    />
  );
}

export default ChatRoomFooter;
