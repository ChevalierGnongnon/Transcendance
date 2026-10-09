import '../../scss/common-classes.scss';
import '../../scss/messages.scss';

import { useState, useEffect, useCallback, useMemo } from 'react';

import { socket } from './socket.js';
import ChatRoom from './ChatRoom';
import NavBar from './navbar';
import NewChat from './new-chat';
import Block from './block';
import ChatList from './ChatList';
import { useUser } from './hooks/useUser';
import { ActiveView, IChatPreview, IMessage, MessageStatus } from './types';
import { fetchChats, fetchMessages } from './utils/api';
import { useSocketConnection } from './hooks/useSocketConnection';

function Messages() {
  const me = useUser();
  const isConnected = useSocketConnection();
  const [activeView, setActiveView] = useState<ActiveView>('chats');

  const [loadingMessages, setLoadingMessages] = useState(false);

  const [activeChat, setActiveChat] = useState<IChatPreview | null>(null);
  const [allMessages, setAllMessages] = useState<Map<string, IMessage[]>>(new Map());
  const [loadingChats, setLoadingChats] = useState(false);
  const [chatList, setChatList] = useState<IChatPreview[]>([]);
  const [error, setError] = useState<Error | null>(null);
  // const lastReadMessageTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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

      if (!chat.mylastReadMessagesId) {
        return { ...chat, unreadCount: messages.length };
      }

      const idx = messages.findIndex((m) => m.id === chat.mylastReadMessagesId);
      return {
        ...chat,
        unreadCount: idx === -1 ? messages.length : messages.length - idx - 1,
      };
    });
  }, [chatList, allMessages, activeChat, me?.id]);

  useEffect(() => {
    const handleNewMessage = async (newMessage: IMessage) => {
      // const chatId = newMessage.chatId;
      // const messageId = newMessage.id;
      const { chatId, id: messageId, sender } = newMessage;
      console.log(JSON.stringify(newMessage));
      console.log(chatId);
      console.log(sender);
      // console.log('Received new message:', newMessage);
      // console.log('ActiveChatId:', activeChat?.chatId);

      try {
        if (!chatId || !messageId) throw new Error('Bad message');

        // const newChat = {
        //   chatId: chatId,
        //   user: newMessage.sender,
        //   mylastReadMessagesId: null,
        //   unreadCount: 0,
        // };
        setChatList((prev) => {
          const exist = prev.some((m) => m.chatId === chatId);
          if (exist) return prev;
          return [
            {
              chatId: chatId,
              user: sender,
              pseudo: sender.pseudo ?? 'Unknown',
              mylastReadMessagesId: null,
              unreadCount: 0,
            },
            ...prev,
          ];
        });

        addMessage(newMessage);

        // if (activeChat && chatId === activeChat.chatId) {
        //   updateLastReadMessageId(chatId, messageId);
        // }
      } catch (error) {
        console.error('Failed to handle new messages', error);
      }
    };

    socket.on('new-chat-message', handleNewMessage);

    return () => {
      socket.off('new-chat-message', handleNewMessage);
    };
  }, []);

  useEffect(() => {
    if (activeChat) {
      const messages = allMessages.get(activeChat.chatId) ?? [];
      if (messages.length > 0) {
        const lastMessageId = messages[messages.length - 1].id;
        if (lastMessageId) {
          updateLastReadMessageId(activeChat.chatId, lastMessageId);
        }
      }
    }
  }, [activeChat, allMessages]);

  const addMessage = useCallback((newMessage: IMessage) => {
    setAllMessages((prev) => {
      const next = new Map(prev);

      const currentMessages = next.get(newMessage.chatId) ?? [];
      next.set(newMessage.chatId, [...currentMessages, newMessage]);

      return next;
    });
  }, []);

  const updateMessage = useCallback((message: IMessage, status: MessageStatus) => {
    console.log('Call updateMessage with status: ', status);
    setAllMessages((prev) => {
      const next = new Map(prev);
      const messages = next.get(message.chatId) ?? [];

      const index = messages.findIndex((m) => m.id === message.id);
      if (index === -1) return prev;

      const updated = [...messages];
      updated[index] = { ...updated[index], status: status };
      next.set(message.chatId, updated);

      return next;
    });
  }, []);

  const updateLastReadMessageId = (chatId: string, messageId: string | null) => {
    setChatList((prev) =>
      prev.map((chat) =>
        chat.chatId === chatId
          ? {
              ...chat,
              mylastReadMessagesId: messageId,
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
            setActiveView={setActiveView}
            messages={allMessages.get(activeChat.chatId) ?? []}
            onAddMessage={addMessage}
            onUpdateMessage={updateMessage}
            updateLastReadMessageId={updateLastReadMessageId}
            otherLastReadMessagesId={activeChat.otherlastReadMessagesId}
          />
        )}
        {activeView === 'new message' && (
          <NewChat
            setActiveChat={setActiveChat}
            setActiveView={setActiveView}
            setChatList={setChatList}
          />
        )}
        {/*{activeView === 'block' && <Block />}*/}
        {activeView === 'imaginaryfriend'}
      </div>
    </>
  );
}

export default Messages;
