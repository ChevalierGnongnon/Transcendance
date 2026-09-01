import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';

import '../../scss/common-classes.scss';
import '../../scss/messages.scss';
// import defaultAvatar from '../../../public/default-avatar.png';
import { ChatItem } from './ChatItem';
import { ChatListProps, IChatPreview } from './types';
import { getChats } from './utils/api.js';

function ChatList({ align, setActiveView, setActiveChatId }: ChatListProps) {
  const { t } = useTranslation();
  const [chatList, setChatList] = useState<IChatPreview[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadChats = async () => {
      try {
        setLoading(true);
        setError(null);

        const chats = await getChats();

        setChatList(chats);
      } catch (error) {
        setError(error instanceof Error ? error : new Error('Unknown error'));
      } finally {
        setLoading(false);
      }
    };

    loadChats();
  }, []);

  return (
    <>
      <div
        className={
          align === 'center'
            ? 'chat-list mx-auto my-2'
            : 'chat-list chat-list-side my-2 d-none d-md-block'
        }
      >
        <div className="list-header pt-4">
          <h1>{t('message.my-messages')}</h1>
        </div>
        {error ? (
          <div className="list-header pt-4">{'Failed to load chats'}</div>
        ) : loading ? (
          <div className="list-header pt-4">{'Loading...'}</div>
        ) : (
          <ul>
            {chatList.map((chat) => (
              <ChatItem
                key={chat.chatId}
                chatId={chat.chatId}
                pseudo={chat.pseudo}
                profilePhoto={chat.profilePhoto}
                setActiveView={setActiveView}
                setActiveChatId={setActiveChatId}
              />
            ))}
          </ul>
        )}
      </div>
    </>
  );
}

export default ChatList;
