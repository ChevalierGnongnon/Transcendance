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
import { fetchMessages } from './utils/api';
import { useSocketConnection } from './hooks/useSocketConnection';
import { useChatList } from './hooks/useChatList';

// import { io } from "socket.io-client";

function Messages() {
  const [activeView, setActiveView] = useState<
    'my messages' | 'new message' | 'block' | 'imaginaryfriend' | 'conversation'
  >('my messages');

  const [activeChat, setActiveChat] = useState<IChatPreview | null>(null);

  const [allMessages, setAllMessages] = useState<Map<string, IMessage[]>>(new Map());
  const [loadingMessages, setLoadingMessages] = useState(false);
  const me = useUser();
  const isConnected = useSocketConnection();
  const { chatList, setChatList, loadingChats, error } = useChatList();

  useEffect(() => {
    const loadMessagesForAllChats = async () => {
      if (chatList.length === 0) {
        return;
      }

      const chatsWithoutMessages = chatList.filter((chat) => !allMessages.has(chat.chatId));
      if (chatsWithoutMessages.length === 0) {
        return;
      }
      setLoadingMessages(true);

      const promises = chatsWithoutMessages.map(async (chat) => {
        try {
          const messages = await getMessages(chat.chatId);
          console.log(`loading messages for chat: ${chat.chatId}`);
          return { chatId: chat.chatId, messages };
        } catch (error) {
          console.error(`Error loading messages for chat: ${chat.chatId}`, error);
          return { chat: chat.chatId, messages: [] };
        }
      });

      const result = await Promise.all(promises);

      setAllMessages((prev) => {
        const newMap = new Map(prev);
        result.forEach(({ chatId, messages }) => {
          newMap.set(chatId, messages);
        });
        return newMap;
      });

      setLoadingMessages(false);
    };
    loadMessagesForAllChats();
  }, [chatList]);

  useEffect(() => {
    const handleNewMessage = async (message) => {
      const chatId = message.chatId;

      const newMessage: IMessage = {
        id: message.id,
        chatId: message.chatId,
        sender: message.sender,
        content: message.content,
      };

      try {
        let existingMessages = allMessages.get(chatId);

        // if (!existingMessages) {
        //   existingMessages = await getMessages(chatId);
        // }

        setAllMessages((prev) => {
          const newMap = new Map(prev);
          const currentMessages = newMap.get(chatId) ?? existingMessages ?? [];

          newMap.set(chatId, [...currentMessages, newMessage]);
          return newMap;
        });

        if (activeChat && chatId === activeChat.chatId) {
          updateLastReadMessageId(chatId, newMessage.id);
          socket.emit('last-read-message', {
            chatId: newMessage.chatId,
            userId: me?.id,
            messageId: newMessage.id,
          });
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

  const getMessages = useCallback(
    async (chatId: string) => {
      console.log('CALL getMessages');
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
    console.log('CALL addMessage');
    setAllMessages((prev) => {
      const next = new Map(prev);

      const currentMessages = next.get(newMessage.chatId) ?? [];
      next.set(newMessage.chatId, [...currentMessages, newMessage]);

      return next;
    });
  }, []);

  const calculateUnreadCount = (chatId: string): number => {
    console.log('CALL calculateUnreadCount');
    const messages = allMessages.get(chatId) || [];
    if (messages.length === 0) return 0;

    const lastMessage = messages[messages.length - 1];
    if (lastMessage.sender.id === me?.id) return 0;

    const chat = chatList.find((c) => c.chatId === chatId);
    if (!chat) return 0;

    if (activeChat && chatId === activeChat.chatId) return 0;

    const lastReadId = chat.lastReadMessagesId;
    console.log(`lastReadId: ${lastReadId}`);
    if (!lastReadId) {
      return messages.length;
    }

    const lastReadIndex = messages.findIndex((msg) => msg.id === lastReadId);
    console.log(`lastReadIndex: ${lastReadIndex}`);

    if (lastReadIndex === -1) {
      return messages.length;
    }
    return messages.length - lastReadIndex - 1;
  };

  const updateLastReadMessageId = (chatId: string, messageId: string | null) => {
    console.log(`CALL updateLastReadMessageId`);
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

  useEffect(() => {
    if (chatList.length === 0) return;
    console.log(`Chat Room changed`);
    // TODO
    // find actual chat, change lastReadId local if not changed, and send
    // server to update, set new chat in chatList
    //
    // socket.emit('last-read-message', {
    //   chatId: lastMessage.chatId,
    //   userId: me?.id,
    //   messageId: lastMessage.id,
    // });

    setChatList((prev) =>
      prev.map((chat) => ({
        ...chat,
        unreadCount: calculateUnreadCount(chat.chatId),
      }))
    );
  }, [allMessages, activeChat]);

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
            onAddMessage={addMessage}
            onGetMessages={getMessages}
            updateLastReadMessageId={updateLastReadMessageId}
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
