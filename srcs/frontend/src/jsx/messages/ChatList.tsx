import { useTranslation } from 'react-i18next';
import { useState, useEffect, useCallback } from 'react';

import '../../scss/common-classes.scss';
import '../../scss/messages.scss';
// import defaultAvatar from '../../../public/default-avatar.png';
import { ChatItem } from './ChatItem';
import { ChatListProps, IChatPreview, IMessage, User } from './types';
import { fetchUsers } from './utils/api.js';

function ChatList(props: ChatListProps) {
  const { t } = useTranslation();
  // const [unread, setUnread] = useState<[{ chatId: string; count: string }]>();

  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const users = await fetchUsers();
        setAllUsers(users);
      } catch (error) {
        console.error('Error download users:', error);
      }
    };
    loadUsers();
    console.log('USERS');
    console.log(allUsers);
  }, []);

  // Фильтрация при изменении поискового запроса
  useEffect(() => {
    if (!searchTerm.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);

    // Фильтруем пользователей по псевдониму (регистронезависимо)
    const filtered = allUsers.filter((user) =>
      user.pseudo.toLowerCase().includes(searchTerm.toLowerCase().trim())
    );

    setSearchResults(filtered);
    setIsSearching(false);
  }, [searchTerm, allUsers]);

  const handleSelectUser = (user: User) => {
    // Обработка выбора пользователя
    console.log('Выбран пользователь:', user);
    setSearchTerm('');
    setSearchResults([]);
    // ... ваша логика открытия чата
  };

  return (
    <>
      <div
        className={
          props.align === 'center'
            ? 'chat-list mx-auto my-2'
            : 'chat-list chat-list-side my-2 d-none d-md-block'
        }
      >
        {/*<form className="form-new-chat" onSubmit={handleSubmit}>*/}
        <form>
          <div className="search-container d-flex justify-content-center position-relativ w-100">
            <input
              type="search"
              name="search-recipient"
              id="search-recipient"
              className="search-input"
              placeholder={t('common.search-user')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Escape') {
                  setSearchTerm('');
                  setSearchResults([]);
                }
              }}
            />

            {searchTerm.trim() && (isSearching || searchResults.length > 0) && (
              <div className="search-results position-absolute w-100 mt-2 bg-white shadow-lg">
                {isSearching ? (
                  <div className="search-loading">Search...</div>
                ) : (
                  searchResults.map((user) => (
                    <button
                      key={user.id}
                      type="button"
                      className="search-result-item"
                      onClick={() => handleSelectUser(user)}
                    >
                      <span className="user-name">{user.pseudo}</span>
                    </button>
                  ))
                )}
              </div>
            )}

            {/* ✅ Показываем сообщение "не найдено" только если поиск закончен и результатов нет */}
            {searchTerm.trim() && !isSearching && searchResults.length === 0 && (
              <div className="search-empty">Пользователи не найдены</div>
            )}
          </div>
        </form>

        {/*end search block*/}

        <div className="list-header pt-4">
          <h1>{t('message.my-messages')}</h1>
        </div>
        {props.error ? (
          <div className="list-header pt-4">{'Failed to load chats'}</div>
        ) : props.loading ? (
          <div className="list-header pt-4">{'Loading...'}</div>
        ) : (
          <ul>
            {props.chatList.map((chat) => (
              <ChatItem
                key={chat.chatId}
                chat={chat}
                setActiveView={props.setActiveView}
                setActiveChat={props.setActiveChat}
              />
            ))}
          </ul>
        )}
      </div>
    </>
  );
}

export default ChatList;
