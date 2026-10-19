import { useCallback, useEffect, useState } from 'react';

import { socket } from '../socket.js';
import { fetchChats, fetchMessages } from '../utils/api';
import { useUser } from './useUser';
import type {
  ActiveView,
  IChatPreview,
  IMessage,
  User,
  MessageStatus,
  SearchResult,
} from '../types';

export default function useChat() {
  const me = useUser();
  const [activeView, setActiveView] = useState<ActiveView>('chats');
  const [activeChat, setActiveChat] = useState<IChatPreview | null>(null);
  const [allMessages, setAllMessages] = useState<Map<string, IMessage[]>>(new Map());
  const [loadingChats, setLoadingChats] = useState(false);
  const [chatList, setChatList] = useState<IChatPreview[]>([]);
  const [error, setError] = useState<Error | null>(null);
  const [otherlastReadMessagesId, setOtherlastReadMessagesId] = useState<string | null>(null);

  /**
   * Loads the chat list on mount with cancellation safety.
   * On unmount: cancels pending updates and resets chat state to defaults.
   * Empty deps → runs once.
   */
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
      setChatList([]);
      setActiveChat(null);
      setActiveView('chats');
    };
  }, []);

  /**
   * Fetches and caches messages for chats not yet present in `allMessages`.
   * Runs whenever chatList or allMessages change; skips work if nothing is missing.
   * Failed fetches resolve to empty arrays. Cancellation-safe.
   */
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

  /**
   * Listens for 'chat:last-read-message' socket events and updates the
   * corresponding chat's `otherlastReadMessagesId`. Registers on mount,
   * cleans up on unmount. Empty deps = listener bound once.
   */
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

  /**
   * Appends a message to its chat's message list in the store.
   * Creates a new array/Map for immutable state update.
   * @param newMessage The message to add.
   */
  const addMessage = useCallback((newMessage: IMessage) => {
    setAllMessages((prev) => {
      const next = new Map(prev);

      const currentMessages = next.get(newMessage.chatId) ?? [];
      next.set(newMessage.chatId, [...currentMessages, newMessage]);

      return next;
    });
  }, []);

  /**
   * Updates the status of a message identified by `message.id` within its chat.
   * No-op if the message isn't found. Immutably replaces the Map.
   * @param message The message to update.
   * @param status The new message status.
   */
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

  /**
   * Opens an existing chat with the user, or creates and prepends a new one.
   * Sets it as the active chat and switches the view to 'conversation'.
   * @param user The user to start or resume a conversation with.
   */
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

  useEffect(() => {
    const chat = chatList.find((c) => c.chatId === activeChat?.chatId);
    const id = chat?.otherlastReadMessagesId ?? null;
    setOtherlastReadMessagesId(id);
  }, [chatList, activeChat]);

  useEffect(() => {
    if (activeChat && activeView === 'chats') {
      setActiveChat(null);
    }
  }, [activeView]);

  return {
    me,
    activeView,
    activeChat,
    chatList,
    otherlastReadMessagesId,

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
