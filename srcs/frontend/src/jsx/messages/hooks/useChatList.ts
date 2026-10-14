import { useState, useEffect } from 'react';

import type { IChatPreview } from '../types';
import { useUser } from './useUser';

export const useChatList = () => {
  const [ChatList, setChatList] = useState<IChatPreview[]>([]);

  useEffect(() => {
    async function loadChats() {
      try {
      } catch (error) {
        console.log('Error loading chats:', error);
        // await logout();
      }
    }

    loadChats();
  }, []);

  return {
    ChatList,
  };
};
