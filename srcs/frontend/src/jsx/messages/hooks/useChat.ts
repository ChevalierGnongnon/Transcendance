import { useCallback, useEffect, useState } from 'react';

import { socket } from '../socket.js';
import { fetchChats, fetchMessages } from '../utils/api';
import { useUser } from './useUser';
import type { ActiveView, IChatPreview, IMessage, User, MessageStatus } from '../types';

export default function useChat() {
  const me = useUser();
  const [activeView, setActiveView] = useState<ActiveView>('chats');
  const [activeChat, setActiveChat] = useState<IChatPreview | null>(null);
  const [allMessages, setAllMessages] = useState<Map<string, IMessage[]>>(new Map());
  const [loadingChats, setLoadingChats] = useState(false);
  const [chatList, setChatList] = useState<IChatPreview[]>([]);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (activeChat && activeView === 'chats') {
      setActiveChat(null);
    }
  }, [activeView]);

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
      // setAllMessages(new Map());
      setChatList([]);
      setActiveChat(null);
      setActiveView('chats');
      // setAutoStartChat(false);
      // console.log('Leave Messages');
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

  useEffect(() => {
    setChatList((prev) =>
      prev.map((chat) => {
        const messages = allMessages.get(chat.chatId) ?? [];
        const last = messages[messages.length - 1];

        let unreadCount = 0;
        if (
          messages.length > 0 &&
          last?.sender.id !== me?.id &&
          activeChat?.chatId !== chat.chatId
        ) {
          if (!chat.mylastReadMessagesId) {
            unreadCount = messages.length;
          } else {
            const idx = messages.findIndex((m) => m.id === chat.mylastReadMessagesId);
            unreadCount = idx === -1 ? messages.length : messages.length - idx - 1;
          }
        }

        return unreadCount === chat.unreadCount ? chat : { ...chat, unreadCount };
      })
    );
  }, [allMessages, activeChat, me?.id]);

  useEffect(() => {
    const handleNewMessage = async (newMessage: IMessage) => {
      const { chatId, id: messageId, sender } = newMessage;

      try {
        if (!chatId || !messageId) throw new Error('Bad message');

        setChatList((prev) => {
          const exist = prev.some((m) => m.chatId === chatId);
          if (exist) return prev;
          const emptyIdx = prev.findIndex((c) => c.user.id === sender.id);
          if (emptyIdx !== -1) {
            const empty = prev[emptyIdx];
            const replaced: IChatPreview = {
              ...empty,
              chatId,
              user: sender,
              pseudo: sender.pseudo ?? 'Unknown',
            };
            const rest = prev.filter((_, i) => i !== emptyIdx);
            if (activeView === 'conversation' && activeChat?.user.id === replaced.user.id)
              setActiveChat(replaced);
            return [replaced, ...rest];
          }
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
        const lastMessage = messages[messages.length - 1];
        if (lastMessage.sender.id === me?.id) return;
        const lastMessageId = lastMessage?.id;
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

    socket.emit('last-read-message', { chatId, userId: me?.id, messageId });
  };

  useEffect(() => {
    const handleUserReadMessages = (data: { chatId: string; messageId: string | null }) => {
      if (!data.chatId || !data.messageId) return;

      setChatList((prev) =>
        prev.map((chat) =>
          chat.chatId === data.chatId
            ? {
                ...chat,
                otherlastReadMessagesId: data.messageId,
              }
            : chat
        )
      );
    };

    socket.on('chat:last-read-message', handleUserReadMessages);
    return () => {
      socket.off('chat:last-read-message', handleUserReadMessages);
    };
  }, []);

  const startChat = useCallback(
    (user: SearchResult) => {
      const existingChat = chatList.find((c) => c.user.id === user.id);

      if (existingChat) {
        console.log(existingChat);
        setActiveChat(existingChat);
        setActiveView('conversation');
        return;
      }

      const newChat: IChatPreview = {
        chatId: crypto.randomUUID(),
        user,
        mylastReadMessagesId: null,
        otherlastReadMessagesId: null,
        unreadCount: 0,
      };

      setChatList((prev) => [newChat, ...prev]);
      setActiveChat(newChat);
      setActiveView('conversation');
    },
    [chatList, setChatList, setActiveChat, setActiveView]
  );

  return {
    me,
    activeView,
    activeChat,
    chatList,

    setActiveView,
    setActiveChat,
    setChatList,
    loadingChats, //
    error, //

    messages: activeChat ? (allMessages.get(activeChat.chatId) ?? []) : [],
    addMessage,
    updateMessage,
    startChat,
  };
}
