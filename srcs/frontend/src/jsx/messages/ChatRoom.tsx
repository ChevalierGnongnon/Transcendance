import { useState, useEffect, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import '../../scss/common-classes.scss';
import '../../scss/messages.scss';
import MoreOptions from './options';
import { Message } from './Message';
import { socket } from './socket';
import type { IMessage, ChatRoomProps } from './types.js';

function ChatRoom(roomProps: ChatRoomProps) {
  const { t } = useTranslation();
  const [showMoreOptions, setShowMoreOptions] = useState(false);

  const [messageText, setMessageText] = useState<string>('');
  const [loading, setLoading] = useState(false);
  // const [error, setError] = useState<Error | null>(null);
  const me = roomProps.me;
  const chatId = roomProps.chat.chatId;
  const messages = chatId ? (roomProps.messages.get(chatId) ?? []) : [];

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isAtBottom, setIsAtBottom] = useState(true);

  const scrollToBottom = useCallback((behavior: ScrollBehavior = 'smooth') => {
    messagesEndRef.current?.scrollIntoView({
      behavior,
      block: 'end',
    });
  }, []);

  const checkIfAtBottom = useCallback(() => {
    if (!containerRef.current) return;

    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
    const atBottom = scrollHeight - scrollTop <= clientHeight + 10; // +10 для погрешности
    setIsAtBottom(atBottom);
  }, []);

  const handleScroll = useCallback(() => {
    checkIfAtBottom();
  }, [checkIfAtBottom]);

  // scroll if changed chat
  useEffect(() => {
    if (roomProps.chat?.chatId) {
      setTimeout(() => {
        scrollToBottom('auto');
      }, 100);
    }
  }, [roomProps.chat?.chatId, scrollToBottom]);

  // scroll if new message
  useEffect(() => {
    if (isAtBottom) {
      scrollToBottom('smooth');
    }
  }, [messages, isAtBottom, scrollToBottom]);

  useEffect(() => {
    if (messages.length > 0) {
      const lastMessageId = messages[messages.length - 1].id ?? null;
      const lastMessageIdinChat = roomProps.chat.lastReadMessagesId;
      if (lastMessageId !== lastMessageIdinChat) {
        roomProps.updateLastReadMessageId(roomProps.chat.chatId, lastMessageId);
      }
    }
  }, [roomProps.chat?.chatId]);

  const handleSendMessage = () => {
    if (messageText.trim() && socket?.connected) {
      const messageToSend: IMessage = {
        chatId: roomProps.chat.chatId,
        recipientId: roomProps.chat.user.id,
        sender: { id: me.id, profilePhoto: me.profilePhoto },
        content: messageText,
        type: 'text',
      };
      socket.emit('new-chat-message', messageToSend);

      roomProps.onAddMessage(messageToSend);
      setMessageText('');
    }
  };

  if (!messages) {
    return <div className="chat-placeholder">Open chat</div>;
  }

  return (
    <>
      <div className="chat-list chat-list-right my-2">
        <div className="chat-header fs-1">
          {/*{t('common.chatting-with')} {`${roomProps.chat.pseudo}`}*/}
          {roomProps.chat.user.pseudo}
        </div>
        <div
          ref={containerRef}
          onScroll={handleScroll}
          className="chat-messages-container"
          style={{
            maxHeight: '65vh',
            overflowY: 'auto',
            position: 'relative',
          }}
        >
          (
          <ul className="px-3">
            {messages.map((msg, index) => (
              <Message
                key={index}
                userId={me.id}
                profilePhoto={msg.sender.profilePhoto}
                senderId={msg.sender.id}
                content={msg.content}
                type={msg.type}
              />
            ))}
          </ul>
          )
          <div ref={messagesEndRef} style={{ height: '2px' }} />
        </div>
        <div className="input-group group-new-message my-3 mt-auto">
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
