import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import '../../scss/common-classes.scss';
import '../../scss/messages.scss';
import defaultAvatar from '../../../public/default-avatar.png';
import MoreOptions from './options';
import { Message } from './Message';
import { socket } from './socket';
import type { User, IMessage, ChatRoomProps } from './types.js';
import { getMessages } from './utils/api.js';

function ChatRoom(roomProps: ChatRoomProps) {
  const { t } = useTranslation();
  const [showMoreOptions, setShowMoreOptions] = useState(false);

  const [messageText, setMessageText] = useState<string>('');
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [loading, setLoading] = useState(false);
  // const [error, setError] = useState<Error | null>(null);
  const me = roomProps.me;

  useEffect(() => {
    async function loadMessages() {
      try {
        setLoading(true);
        const messages = await getMessages(roomProps.chat.chatId);

        setMessages(messages);
      } catch (error) {
        console.log('Error loading messages:', error);
        // setError(error instanceof Error ? error : new Error('Unknown error'));
        // await logout();
      } finally {
        setLoading(false);
      }
    }

    let b = false;
    const handleChatJoined = (answer: { chatId: string; userId: string }) => {
      // if (b) console.log(`on: ${answer}`);
      // else console.log(`off: ${answer}`);

      b = !b;
    };

    // send request to join chat
    socket.emit('join-chat-request', { chatId: roomProps.chat.chatId, userId: me.id });
    // socket.on('chat-room-joined', handleChatJoined);

    loadMessages();

    // if dont have errors
    roomProps.chat.unreadCount = '0';
    for (const msg of messages) {
      console.log(msg);
    }
    if (messages.length !== 0) {
      const lastReadMessage = messages.reduce((latest, current) => {
        const currentDate = new Date(current.createdAt || 0);
        const latestDate = new Date(latest.createdAt || 0);
        return currentDate > latestDate ? current : latest;
      });
      console.log(lastReadMessage);
    }

    roomProps.setActiveChat({ ...roomProps.chat });
    // const lastReadChatId =
    // send put to update last_read_chats_id
    return () => {
      console.log('Cleanup: removing handler for chatId', roomProps.chat.chatId);
      socket.off('chat-room-joined', handleChatJoined); // ←  Remove joind ...
      // socket.emit('leave-chat-request', { chatId: roomProps.chatId });
    };
  }, [roomProps.chat.chatId]);

  const handleSendMessage = () => {
    if (messageText.trim() && socket?.connected) {
      const messageToSend: IMessage = {
        chatId: roomProps.chat.chatId,
        sender: { id: me.id, profilePhoto: { name: me.profilePhoto.name } },
        content: messageText,
      };
      socket.emit('new-chat-message', messageToSend);

      setMessages((prev) => [...prev, messageToSend]);

      setMessageText('');
    }
  };

  useEffect(() => {
    const handleNewMessage = (message: IMessage) => {
      setMessages((prev) => [...prev, message]);
    };

    socket.on('new-chat-message', handleNewMessage);

    return () => {
      socket.off('new-chat-message', handleNewMessage);
    };
  }, []);

  return (
    <>
      <div className="chat-list chat-list-right my-2">
        <div className="chat-header">
          {t('common.chatting-with')} {`chatId: ${roomProps.chat.chatId}`}
        </div>
        (
        <ul className="px-3">
          {messages.map((msg, index) => (
            <Message
              key={index}
              userId={me.id}
              profilePhoto={msg.sender.profilePhoto.name}
              senderId={msg.sender.id}
              content={msg.content}
            />
          ))}
        </ul>
        )
        <div className="input-group group-new-message my-3">
          <div className="position-relative">
            <button
              className="btn fs-2 send-message d-flex align-items-center justify-content-center"
              onClick={() => setShowMoreOptions((prev) => !prev)}
            >
              +
            </button>
            {showMoreOptions && <MoreOptions></MoreOptions>}
          </div>

          <textarea
            className="form-control message-area"
            name="new-message"
            placeholder="Type your message here"
            value={messageText}

            onChange={(e) => setMessageText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
          ></textarea>
          <button className="btn send-message" onClick={handleSendMessage}>
            {t('common.send')}
          </button>
        </div>
      </div>
    </>
  );
}

export default ChatRoom;
