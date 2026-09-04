import '../../scss/common-classes.scss';
import '../../scss/messages.scss';

import { useState, useEffect, useCallback } from 'react';

import ChatRoom from './ChatRoom';
import NavBar from './navbar';
import NewChat from './new-chat';
import MoreOptions from './options';
import Block from './block';
import ChatList from './ChatList';
import { socket } from './socket.js';
import { useUser } from './hooks/useUser';
import { IChatPreview, IMessage } from './types';
import { fetchMessages, getChats as fetchChats } from './utils/api';

// import { io } from "socket.io-client";

function Messages() {
  const [activeView, setActiveView] = useState<
    'my messages' | 'new message' | 'block' | 'imaginaryfriend' | 'conversation'
  >('my messages');

  const [activeChat, setActiveChat] = useState<IChatPreview | null>(null);

  const [isConnected, setIsConnected] = useState<boolean>(socket.connected);
  const [fooEvents, setFooEvents] = useState<any[]>([]);
  const [allMessages, setAllMessages] = useState<Map<string, IMessage[]>>(new Map());
  // const [messages, setMessages] = useState<IMessage[]>([]);
  // const messages = activeChat ? (allMessages.get(activeChat.chatId) ?? []) : [];
  const [loadingChats, setLoadingChats] = useState(false);
  const [chatList, setChatList] = useState<IChatPreview[]>([]);
  const [error, setError] = useState<Error | null>(null);
  const me = useUser();

  useEffect(() => {
    if (!socket.connected) {
      socket.connect();
      console.log('🔄 Attempting to connect...');
    }
    function onConnect() {
      setIsConnected(true);
      console.log('✅ Socket is connected');
    }

    function onDisconnect() {
      setIsConnected(false);
      console.log('❌ Socket disconnected');
    }

    function onFooEvent(value: any) {
      setFooEvents((previous) => [...previous, value]);
    }

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('foo', onFooEvent);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('foo', onFooEvent);
    };
  }, []);

  useEffect(() => {
    const loadChats = async () => {
      try {
        setLoadingChats(true);
        setError(null);

        if (chatList.length === 0) {
          const chats = await fetchChats();
          console.log(chats);
          setChatList(chats);
        }
      } catch (error) {
        setError(error instanceof Error ? error : new Error('Unknown error'));
      } finally {
        setLoadingChats(false);
      }
    };

    loadChats();
  }, []);

  useEffect(() => {
    const handleNewMessage = async (newMessage: IMessage) => {
      const chatId = newMessage.chatId;

      console.log(`recive: ${newMessage}`);
      console.log(`chatId: ${chatId}`);

      try {
        let existingMessages = allMessages.get(chatId);

        if (!existingMessages) {
          existingMessages = await getMessages(chatId);
        }

        setAllMessages((prev) => {
          const newMap = new Map(prev);
          const currentMessages = newMap.get(chatId) ?? existingMessages ?? [];

          newMap.set(chatId, [...currentMessages, newMessage]);
          return newMap;
        });

        if (activeChat && chatId !== activeChat.chatId) {
          setChatList((prev) =>
            prev.map((chat) =>
              chat.chatId === chatId
                ? {
                    ...chat,
                    unreadCount: String((parseInt(chat.unreadCount) || 0) + 1),
                  }
                : chat
            )
          );
        }
      } catch (error) {
        console.error('Failed to handle new messages', error);
      }
    };

    socket.on('new-chat-message', handleNewMessage);

    return () => {
      socket.off('new-chat-message', handleNewMessage);
    };
  }, [chatList, allMessages, activeChat]);

  const updateMessages = async (newMessage: IMessage) => {
    setAllMessages((prev) => {
      const next = new Map(prev);

      const currentMessages = next.get(newMessage.chatId) ?? [];
      console.log(currentMessages);

      next.set(newMessage.chatId, [...currentMessages, newMessage]);

      console.log(next.get(newMessage.chatId));
      return next;
    });
  };

  const getMessages = useCallback(
    async (chatId: string) => {
      if (allMessages.has(chatId)) {
        return allMessages.get(chatId);
      }

      try {
        const messages = await fetchMessages(chatId);
        setAllMessages((prev) => {
          const next = new Map(prev);
          next.set(chatId, messages);
          return next;
        });

        return messages;
      } catch (error) {
        console.error('Failed to fetch messages:', error);
        return [];
      }
    },
    [allMessages]
  );

  const addMessage = useCallback((newMessage: IMessage) => {
    console.log(newMessage.chatId);
    console.log(allMessages);
    console.log(allMessages.get(newMessage.chatId));
    setAllMessages((prev) => {
      const next = new Map(prev);

      const currentMessages = next.get(newMessage.chatId) ?? [];
      console.log(currentMessages);

      next.set(newMessage.chatId, [...currentMessages, newMessage]);

      console.log(next.get(newMessage.chatId));
      return next;
    });
  }, []);

  // const loadMessages = (chatId: string) => {
  //   try {
  //     // const loadedMessages = await getMessages(chatId);
  //     // setMessages(loadedMessages);

  //     const messages = activeChat ? (allMessages.get(activeChat.chatId) ?? []) : [];
  //     console.log(messages);
  //     return messages;
  //   } catch (error) {
  //     console.error('Error loadMessages:', error);
  //   }
  // };

  if (!me) {
    return <div>Something went wrong. Please try again later.</div>;
  }

  return (
    <>
      <NavBar activeView={activeView} setActiveView={setActiveView}></NavBar>
      {/*<div className="socket-status justify-content-center">
        {`Status: ${isConnected ? '🟢 Connected' : '🔴 Disconnect'}`}
      </div>*/}
      <div className={activeView !== 'my messages' ? 'd-flex' : ''}>
        <ChatList
          align={activeView === 'my messages' ? 'center' : 'left'}
          setActiveView={setActiveView}
          setActiveChat={setActiveChat}
          chatList={chatList}
          loading={loadingChats}
          error={error}
        />
        {activeView === 'conversation' && activeChat && (
          <ChatRoom
            me={me}
            chat={activeChat}
            setActiveChat={setActiveChat}
            messages={allMessages}
            // setMessages={setMessages}
            onAddMessage={addMessage}
            onGetMessages={getMessages}
            // onLoadMessages={loadMessages}
          />
        )}
        {activeView === 'new message' && <NewChat />}
        {activeView === 'block' && <Block />}
        {activeView === 'imaginaryfriend' && <MoreOptions />}
      </div>
    </>
  );
}

export default Messages;
