import { useState, useEffect } from 'react';

import type { IChatPreview } from '../types';
import { fetchChats } from '../utils/api';

export const useChatList = () => {
  const [loadingChats, setLoading] = useState(false);
  const [chatList, setChatList] = useState<IChatPreview[]>([]);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadChats = async () => {
      try {
        setLoading(true);
        setError(null);

        const chats = await fetchChats();
        setChatList(chats);
      } catch (error) {
        setError(error instanceof Error ? error : new Error('Unknown error'));
      } finally {
        setLoading(false);
      }
    };

    loadChats();
  }, []);

  return {
    chatList,
    setChatList,
    loadingChats,
    error,
  };
};
