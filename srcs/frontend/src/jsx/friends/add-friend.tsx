import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import SearchBar from '../others/search-bar';
import { useAuth } from '../auth/auth-context';
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

interface AddFriendProps {
  send: (userId: string) => void;
  block: (userId: string) => void;
}

function AddFriend(props: AddFriendProps) {
  const { t } = useTranslation();
  const [user, setUser] = useState<SearchResult | null>(null);

  const sendRequest = props.send;
  const blockUser = props.block;

  return (
    <form className="form-new-chat p-3 my-2 gap-3 d-flex flex-column justify-content-center align-items-center">
      <h1>{t('friends.send-friend-request')}</h1>
      <h3>{t('message.search-user')} : </h3>
      <SearchBar
        ClassName="search-bar"
        ListClassName="header-search-results"
        BreakPoint={768}
        onSelectUser={(user) => {
          setUser(user);
        }}
      />
      {user ? (
        <div className="row g-4 justify-content-center shortcut-grid">
          <div className="col-12 col-md-6 col-xl-4">
            <figure className="friend-card py-2 px-1 justify-content-center">
              <img src={`api/${user?.profilePhoto.id}/download`} alt={t('friends.avatar-alt')} />
              <span>
                {user?.firstName} {user?.lastName}
              </span>
              <input
                type="button"
                value={t('friends.add-friend')}
                className="accept-button"
                onClick={() => {
                  sendRequest(user.id);
                  setUser(null);
                }}
              />
              <input
                type="button"
                value={t('friends.block')}
                className="delete-button"
                onClick={() => {
                  blockUser(user.id);
                  setUser(null);
                }}
              />
            </figure>
          </div>
        </div>
      ) : (
        ''
      )}
    </form>
  );
}
export default AddFriend;
