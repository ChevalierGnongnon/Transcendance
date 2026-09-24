import '../../scss/common-classes.scss';
import '../../scss/messages.scss';

import { useState, useEffect, useCallback, useMemo } from 'react';

import ChatRoom from './ChatRoom';
import NavBar from './navbar';
import NewChat from './new-chat';
import MoreOptions from './options';
import Block from './block';
import ChatList from './ChatList';
import { socket } from './socket.js';
import { useUser } from './hooks/useUser';
import { ActiveView, IChatPreview, IMessage } from './types';
import { fetchChats, fetchMessages } from './utils/api';


function Messages() {
  const me = useUser();

  // const isConnected = useSocketConnection();
  const [activeView, setActiveView] = useState<ActiveView>('chats');

  const [loadingMessages, setLoadingMessages] = useState(false);

  const [activeChat, setActiveChat] = useState<IChatPreview | null>(null);
  const [allMessages, setAllMessages] = useState<Map<string, IMessage[]>>(new Map());
  const [loadingChats, setLoadingChats] = useState(false);
  const [chatList, setChatList] = useState<IChatPreview[]>([]);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoadingChats(true);
    fetchChats()
      .then((chats) => {
        if (!cancelled) setChatList(chats);
      })
      .catch((e) => {
        if (!cancelled) setError(e instanceof Error ? e : new Error('Unknown'));
      })
      .finally(() => {
        if (!cancelled) setLoadingChats(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const missing = chatList.filter((c) => !allMessages.has(c.chatId));
    if (missing.length === 0) return;

    let cancelled = false;

    Promise.all(
      missing.map((chat) =>
        fetchMessages(chat.chatId)
          .then((messages) => ({ chatId: chat.chatId, messages }))
          .catch(() => ({ chatId: chat.chatId, messages: [] as IMessage[] }))
      )
    ).then((results) => {
      if (cancelled) return;
      setAllMessages((prev) => {
        const next = new Map(prev);
        for (const { chatId, messages } of results) {
          if (!next.has(chatId)) next.set(chatId, messages);
        }
        return next;
      });
    });

    return () => {
      cancelled = true;
    };
  }, [chatList, allMessages]);

  const chatListWithUnread = useMemo(() => {
    return chatList.map((chat) => {
      const messages = allMessages.get(chat.chatId) ?? [];
      const last = messages[messages.length - 1];

      if (
        messages.length === 0 ||
        last?.sender.id === me?.id ||
        activeChat?.chatId === chat.chatId
      ) {
        return { ...chat, unreadCount: 0 };
      }

      if (!chat.lastReadMessagesId) {
        return { ...chat, unreadCount: messages.length };
      }

      const idx = messages.findIndex((m) => m.id === chat.lastReadMessagesId);
      return {
        ...chat,
        unreadCount: idx === -1 ? messages.length : messages.length - idx - 1,
      };
    });
  }, [chatList, allMessages, activeChat, me?.id]);

  useEffect(() => {
    const handleNewMessage = async (newMessage: IMessage) => {
      const chatId = newMessage.chatId;
      const messageId = newMessage.id;
      if (!chatId || !messageId) throw new Error('Bad message');

      try {
        const newChat = {
          chatId: chatId,
          user: newMessage.sender,
          lastReadMessagesId: null,
          unreadCount: 0,
        };
        setChatList((prev) => {
          const exist = prev.some((m) => m.chatId === chatId);
          return exist ? prev : [newChat, ...prev];
        });

        addMessage(newMessage);

        if (activeChat && chatId === activeChat.chatId) {
          updateLastReadMessageId(chatId, messageId);
        }
      } catch (error) {
        console.error('Failed to handle new messages', error);
      }
    };

    socket.on('new-chat-message', handleNewMessage);

    return () => {
      socket.off('new-chat-message', handleNewMessage);
    };
  }, [chatList, allMessages]);

  const addMessage = useCallback((newMessage: IMessage) => {
    setAllMessages((prev) => {
      const next = new Map(prev);

      const currentMessages = next.get(newMessage.chatId) ?? [];
      next.set(newMessage.chatId, [...currentMessages, newMessage]);

      return next;
    });
  }, []);

  const updateLastReadMessageId = (chatId: string, messageId: string | null) => {
    setChatList((prev) =>
      prev.map((chat) =>
        chat.chatId === chatId
          ? {
              ...chat,
              lastReadMessagesId: messageId,
            }
          : chat
      )
    );

    socket.emit('last-read-message', {
      chatId: chatId,
      userId: me?.id,
      messageId: messageId,
    });
  };

  if (!me) {
    return <div>Something went wrong. Please try again later.</div>;
  }

  return (
    <>
      <NavBar activeView={activeView} setActiveView={setActiveView}></NavBar>

      <div className={activeView !== 'chats' ? 'd-flex' : ''}>
        <ChatList
          align={activeView === 'chats' ? 'center' : 'left'}
          setActiveView={setActiveView}
          setActiveChat={setActiveChat}
          chatList={chatListWithUnread}
          loading={loadingChats}
          error={error}
        />
        {activeView === 'conversation' && activeChat && (
          <ChatRoom
            me={me}
            chat={activeChat}
            setActiveChat={setActiveChat}
            setActiveView={setActiveView}
            messages={allMessages}
            onAddMessage={addMessage}
            updateLastReadMessageId={updateLastReadMessageId}
          />
        )}
        {activeView === 'new message' && (
          <NewChat
            setActiveChat={setActiveChat}
            setActiveView={setActiveView}
            setChatList={setChatList}
          />
        )}
        {activeView === 'block' && <Block />}
        {activeView === 'imaginaryfriend' && <MoreOptions />}
      </div>
    </>
  );
}

export default Messages;
