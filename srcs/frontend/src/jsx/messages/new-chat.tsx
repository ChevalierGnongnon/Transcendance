import { useTranslation } from 'react-i18next';
import { useState } from 'react';

import '../../scss/messages.scss';
import { socket } from './socket';
import { IChatPreview, ActiveView } from './types';
import SearchBar from '../others/search-bar';
import { use } from 'i18next';

interface SearchResult {
  id: string;
  firstName: string;
  lastName: string;
  pseudo: string;
  profilePhoto: {
    id: string;
    name: string;
  };
}

export interface nProps {
  setActiveView: (view: ActiveView) => void;
  setActiveChat: (chat: IChatPreview | null) => void;
  setChatList: (chatList: IChatPreview[]) => void;
}

function NewChat({ setActiveChat, setActiveView, setChatList }: nProps) {
  const { t } = useTranslation();

  const [user, setUser] = useState<SearchResult | null>(null);

  const startChat = () => {
    const userId = user?.id;
    if (!userId) {
      console.error('userId not defined, when try to start message');
      return;
    }
    socket.emit('start-new-chat', { recipientId: userId }, (res: any) => {
      if (res.ok) {
        const newChat = res.data;

        setChatList((prev) => {
          const exists = prev.some((chat) => chat.chatId === newChat.chatId);
          return exists ? prev : [newChat, ...prev];
        });
        setActiveChat(newChat);
        setActiveView('conversation');
      } else {
        console.error('Can not creat new chat:', res);
      }
    });
  };

  return (
    <form className="form-new-chat p-3 my-2 gap-3 d-flex flex-column justify-content-center align-items-center">
      <h1>{t('message.start-new-chat')}</h1>
      <h3>{t('message.search-user')} : </h3>
      <SearchBar
        ClassName="search-bar"
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
