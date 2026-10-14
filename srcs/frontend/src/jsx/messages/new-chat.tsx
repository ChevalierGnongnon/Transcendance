import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import '../../scss/messages.scss';
import SearchBar from '../others/search-bar';
import { SearchResult, newChatProps } from './types';

function NewChat({
  autoStartUser = null,
  autoStart = false,
  setAutoStart,
  chatList,
  setChatList,
  setActiveView,
  setActiveChat,
}: newChatProps) {
  const { t } = useTranslation();
  const startedRef = useRef(false);
  const [user, setUser] = useState<SearchResult | null>(autoStart ? autoStartUser : null);
  console.log('Call new Chat');
  console.log(`chatLIstSize: ${chatList.length}`);

  const startChat = () => {
    const userId = user?.id;
    if (!userId) {
      console.error('userId not defined, when try to start message');
      return;
    }
    const chat = chatList.find((c) => c.user.id === user?.id);
    if (chat) {
      setActiveChat(chat);
      setActiveView('conversation');
      return;
    }

    const chatId = chat?.chatId ?? crypto.randomUUID();

    const newChat = {
      chatId,
      user,
      mylastReadMessagesId: null,
      otherlastReadMessagesId: null,
      unreadCount: 0,
    };

    setChatList((prev) => {
      const exists = prev.some((chat) => chat.chatId === newChat.chatId);
      return exists ? prev : [newChat, ...prev];
    });
    setActiveChat(newChat);
    setActiveView('conversation');
  };

  useEffect(() => {
    if (autoStart && autoStartUser && !startedRef.current) {
      startedRef.current = true;
      startChat();
    }
    return () => {
      setAutoStart(false);
      setUser(null);
    };
  }, []);

  if (autoStart && autoStartUser) return null;

  return (
    <form className="form-new-chat p-3 my-2 gap-3 d-flex flex-column justify-content-center align-items-center">
      <h1>{t('message.start-new-chat')}</h1>
      <h3>{t('message.search-user')} : </h3>
      <SearchBar
        ClassName="search-bar"
        PlaceHolder={t('common.find-user')}
        ListClassName="header-search-results"
        BreakPoint={768}
        onSelectUser={(user) => {
          setUser(user);
        }}
      />
      {user && (
        <div className="row g-4 justify-content-center shortcut-grid">
          <div className="col-12 col-md-6 col-xl-4">
            <figure className="friend-card py-2 px-1 justify-content-center text-break">
              <img src={`api/${user?.profilePhoto.id}/download`} alt={t('friends.avatar-alt')} />
              <span>
                {user?.firstName} {user?.lastName}
              </span>
              <input
                type="button"
                value={t('message.start-chat')}
                className="accept-button text-break"
                onClick={startChat}
              />
            </figure>
          </div>
        </div>
      )}
    </form>
  );
}

export default NewChat;
