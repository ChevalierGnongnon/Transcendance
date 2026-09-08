import { useTranslation } from 'react-i18next';

import '../../scss/messages.scss';
import { useEffect, useState } from 'react';

function NewChat() {
  const { t } = useTranslation();
  // const [searchTerm, setSearchTerm] = useState('');
  // const [searchResults, setSearchResults] = useState('');
  // const [user, setUser] = useState('');
  // const [users, setUsers] = useState([]);

  // useEffect(() => {
  //   fetch('/api/users', { credentials: 'include' })
  //     .then((res) => res.json())
  //     .then((data) => setUsers(data))
  //     .catch((err) => console.error('users error:', err));
  // }, []);

  // const filteredUsers = useMemo(() => {
  //   if (!searchTerm.trim()) return users;

  //   const term = searchTerm.toLowerCase().trim();
  //   return users.filter(
  //     (user) => user.name.toLowerCase().includes(term) || user.email.toLowerCase().includes(term)
  //   );
  // }, [searchTerm]);

  // <div className="search-container">
  //   <div className="search-wrapper">
  //     <Search className="search-icon" size={20} />

  //     <input
  //       type="text"
  //       className="search-input"
  //       placeholder="Поиск пользователей..."
  //       value={searchTerm}
  //       onChange={(e) => setSearchTerm(e.target.value)}
  //     />

  //     {searchTerm && (
  //       <button
  //         className="clear-button"
  //         onClick={() => setSearchTerm('')}
  //       >
  //         <X size={20} />
  //       </button>
  //     )}
  //   </div>
  //   const filteredItems = useMemo(() => {
  //   if (!searchTerm.trim()) return items;

  //   const lowerSearch = searchTerm.toLowerCase();

  //   return items.filter(item =>
  //     searchFields.some(field => {
  //       const value = item[field];
  //       if (typeof value === 'string') {
  //         return value.toLowerCase().includes(lowerSearch);
  //       }
  //       if (typeof value === 'number') {
  //         return value.toString().includes(lowerSearch);
  //       }
  //       return false;
  //     })
  //   );
  // }, [items, searchTerm, searchFields]);

  // const clearSearch = useCallback(() => {
  //   setSearchTerm('');
  // }, []);

  return (
    <form className="form-new-chat p-3 my-2 gap-3 d-flex flex-column justify-content-center align-items-center">
      <h1>{t('message.new-message')}</h1>
      <h3>{t('message.search-user')} : </h3>
      <input
        type="search"
        name="search-recipient"
        id="search-recipient"
        className="search-input"
        placeholder={t('common.search-user')}
        // value={searchTerm}
        // onChange={(e) => setSearchTerm(e.target.value)}
        // onKeyDown={(e) => {
        //   if (e.key === 'Escape') {
        //     setSearchTerm('');
        //     setSearchResults([]);
        //   }
        // }}
      />
      <input type="button" value={t('common.search')} className="new-msg-button btn btn-primary" />
      <h3>{t('message.type-your-message')} :</h3>
      <textarea name="message" id="message" className="new-message"></textarea>
      <input type="button" value={t('common.send')} className="new-msg-button btn btn-primary" />
    </form>
  );
}

export default NewChat;
