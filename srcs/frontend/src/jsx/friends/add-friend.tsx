import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import SearchBar from '../others/search-bar';
import { useAuth } from '../auth/auth-context';
import { use } from 'i18next';
import { apiFetch } from './apiFetch';
import { Relationship } from './types';

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
  accept: (userId: string) => void;
  decline: (userId: string) => void;
  block: (userId: string) => void;
  unblock: (userId: string) => void;
}

function AddFriend(props: AddFriendProps) {
  const { t } = useTranslation();
  const [user, setUser] = useState<SearchResult | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [relationship, setRelationship] = useState<Relationship>(null);
  const { logout } = useAuth();

  const sendRequest = props.send;
  const acceptRequest = props.send;
  const declineRequest = props.decline;
  const blockUser = props.block;
  const unblockUser = props.unblock;

  useEffect(() => {
    if (!user) return;

    apiFetch(`/api/social/relationship/${user.id}`, {}, logout)
      .then((data) => {
        setRelationship(data);
      })
      .catch((err) => {
        console.error('relationship error:', err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [user]);

  const hasRelationship = () => {
    return (
      relationship.isFriend ||
      relationship.requestSent ||
      relationship.requestReceived ||
      relationship.blockedByMe
    );
  };

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
      {user && (
        <div className="row g-4 justify-content-center shortcut-grid">
          <div className="col-12 col-md-6 col-xl-4">
            <figure className="friend-card py-2 px-1 justify-content-center">
              <img src={`api/${user?.profilePhoto.id}/download`} alt={t('friends.avatar-alt')} />
              <span>
                {user?.firstName} {user?.lastName}
              </span>
              {!loading && !hasRelationship() && (
                <input
                  type="button"
                  value={t('friends.add-friend')}
                  className="accept-button"
                  onClick={() => {
                    sendRequest(user.id);
                    setUser(null);
                  }}
                />
              )}

              {!loading && relationship.requestReceived && (
                <input
                  type="button"
                  value={t('friends.accept')}
                  className="accept-button"
                  onClick={() => {
                    acceptRequest(user.id);
                    setUser(null);
                  }}
                />
              )}

              {!loading && relationship.requestReceived && (
                <input
                  type="button"
                  value={t('friends.refuse')}
                  className="delete-button"
                  onClick={() => {
                    declineRequest(user.id);
                    setUser(null);
                  }}
                />
              )}
              {!loading && !relationship.blockedByMe && (
                <input
                  type="button"
                  value={t('friends.block')}
                  className="delete-button"
                  onClick={() => {
                    blockUser(user.id);
                    setUser(null);
                  }}
                />
              )}
              {!loading && relationship.blockedByMe && (
                <input
                  type="button"
                  value={t('friends.unblock')}
                  className="accept-button"
                  onClick={() => {
                    unblockUser(user.id);
                    setUser(null);
                  }}
                />
              )}
            </figure>
          </div>
        </div>
      )}
    </form>
  );
}
export default AddFriend;
