import { useState, useEffect, useRef, useCallback, useLayoutEffect } from 'react';

import '../../scss/common-classes.scss';
import '../../scss/messages.scss';
import { Message } from './Message';
import { IMessage, User } from './types';

interface MessagesListProps {
  me: User;
  chatId: string;
  messages: IMessage[];
}

function MessagesList({ me, chatId, messages }: MessagesListProps) {
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

  //
  //   useLayoutEffect(() => {
  //     const el = containerRef.current;
  //     if (!el) return;
  //
  //     el.scrollTop = el.scrollHeight;
  //     setIsAtBottom(true);
  //   }, [chatId]);

  const handleScroll = useCallback(() => {
    checkIfAtBottom();
  }, [checkIfAtBottom]);

  // scroll if changed chat
  useEffect(() => {
    if (chatId) {
      setTimeout(() => {
        scrollToBottom('auto');
      }, 100);
    }
  }, [chatId, scrollToBottom]);

  // scroll if new message
  useEffect(() => {
    if (isAtBottom) {
      scrollToBottom('smooth');
    }
  }, [messages, isAtBottom, scrollToBottom]);

  return (
    <>
      {/*<div className="chat-list chat-list-right my-2">*/}
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
        <div ref={messagesEndRef} style={{ height: '2px' }} />
      </div>
      {/*</div>*/}
    </>
  );
}

export default MessagesList;
