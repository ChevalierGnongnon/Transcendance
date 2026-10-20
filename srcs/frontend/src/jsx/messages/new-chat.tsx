import { useState,  useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';

import '../../scss/messages.scss';
import SearchBar from '../others/search-bar';
import { SearchResult } from './types';
import UserCard from './UserCard';

export interface newChatProps {
  autoStartUser?: SearchResult | null;
  autoStart?: boolean;
  setAutoStart: (autostart: boolean) => void;
  onStartChat: (user: SearchResult) => void;
}

function NewChat({
  autoStartUser = null,
  autoStart = false,
  setAutoStart,
  onStartChat,
}: newChatProps) {
  const { t } = useTranslation();
  const startedRef = useRef(false);
  const [user, setUser] = useState<SearchResult | null>(autoStart ? autoStartUser : null);

  useEffect(() => {
    if (autoStart && autoStartUser && !startedRef.current) {
      startedRef.current = true;
      onStartChat(autoStartUser);
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
        onSelectUser={(user) => {
          setUser(user);
        }}
      />
      {user && (
        <div className="row g-4 justify-content-center shortcut-grid">
          <UserCard user={user} actionLabel={t('message.start-chat')} onAction={onStartChat} />
        </div>
      )}
    </form>
  );
}

export default NewChat;
