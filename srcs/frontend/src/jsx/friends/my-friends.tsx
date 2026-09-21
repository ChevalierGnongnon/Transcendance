import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';

import defaultAvatar from '../../../public/default-avatar.png';
import '../../scss/friends.scss';
import AddFriend from './add-friend';
import { FriendCard } from './FriendCard';
import { useAuth } from '../auth/auth-context';
import { apiFetch } from './apiFetch';

interface Friendship {
  id: string;
  status: string;
  createdAt: string;
  acceptedAt: string | null;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    pseudo: string;
    profilePhotoId: string;
  };
  friend: {
    id: string;
    firstName: string;
    lastName: string;
    pseudo: string;
    profilePhotoId: string;
  };
}

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  pseudo: string;
  profilePhoto: {
    id: string;
    name: string;
  };
}

function MyFriends() {
  const { t } = useTranslation();
  const [friendships, setFriendships] = useState<Friendship[]>([]);
  const { logout } = useAuth();
  const [me, setMe] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch('/api/my-profile', {}, logout)
      .then((data) => {
        setMe(data);
      })
      .catch((err) => {
        console.error('my-profile error:', err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    apiFetch('/api/friendships', {}, logout)
      .then((data) => {
        setFriendships(data);
      })
      .catch((err) => {
        console.error('friendships error:', err);
      });
  }, []);

  const sendFriendRequest = async (userId: string) => {
    try {
      const data = await apiFetch(
        '/api/friendships',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ friendId: userId }),
        },
        logout
      );

      const newFriendship = data.friendship;
      setFriendships((prev) => [newFriendship, ...prev]);
    } catch (err) {
      console.error('Error sendFriendRequest:', err);
    }
  };

  const blockUser = async (userId: string) => {
    fetch(`api/friendships/${userId}`, {
      credentials: 'include',
      method: 'POST',
    })
      .then((res) => {
        if (res.status === 401) {
          logout();
          throw new Error('Unauthorized');
        }
        if (!res.ok) {
          throw new Error(`HTTP error: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        console.log(data);
      })
      .catch((err) => {
        console.error('Error updateFriendship:', err);
      });
  };

  const deleteFriendship = async (id: string) => {
    fetch(`api/friendships/${id}`, {
      credentials: 'include',
      method: 'DELETE',
    })
      .then((res) => {
        if (res.status === 401) {
          logout();
          throw new Error('Unauthorized');
        }
        if (!res.ok) {
          throw new Error(`HTTP error: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        if (data.success) {
          {
            const targetId = data.deleted.id;
            if (targetId) setFriendships((prev) => prev.filter((f) => f.id !== targetId));
          }
        }
      })
      .catch((err) => {
        console.error('Error updateFriendship:', err);
      });
  };

  const updateFriendship = async (
    id: string,
    status: 'accepted' | 'refused' | 'cancelled' | 'blocked'
  ) => {
    try {
      const updated = await apiFetch(
        `/api/friendships/${id}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ status }),
        },
        logout
      );

      setFriendships((prev) => {
        switch (updated.status) {
          case 'refused':
          case 'cancelled':
            return prev.filter((f) => f.id !== id);

          case 'accepted':
          case 'blocked':
            return prev.map((f) =>
              f.id === id ? { ...f, status: updated.status, updatedAt: updated.updatedAt } : f
            );

          default:
            return prev;
        }
      });
    } catch (err) {
      console.error('Error updateFriendship:', err);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!me) {
    return null;
  }

  return (
    <div className="friends-page m-2 p-2">
      <AddFriend send={sendFriendRequest} block={blockUser} />
      {friendships.length === 0 ? (
        <div>
          <p>{t('friends.no-friends')}</p>
          <p>{t('friends.no-friends-hint')}</p>
        </div>
      ) : (
        <div>
          <h1>{t('friends.my-friends')}</h1>{' '}
          <div className="row g-4 justify-content-center shortcut-grid">
            {friendships.map((item) => {
              const isSender = item.user.id === me.id;
              const friend = isSender ? item.friend : item.user;
              if (item.status === 'accepted') {
                return (
                  <FriendCard
                    isFriend={true}
                    userId ={friend.id}
                    key={item.id}
                    name={`${friend.firstName} ${friend.lastName}`}
                    profilePhotoId={friend.profilePhotoId}
                    buttonValue={t('friends.delete-friend')}
                    buttonClassName="delete-button px-2"
                    onButtonClick={() => {
                      deleteFriendship(item.id);
                    }}
                  />
                );
              }
              return null;
            })}
          </div>
          {/*########################---Pending---###########################*/}
          {friendships.some((f) => f.status === 'pending' && f.friend.id === me.id) && (
            <div className="orange-border p-2">
              <h1>{t('friends.pending-requests')}</h1>
              <div className="row g-4 justify-content-center shortcut-grid"></div>
              {friendships.map((item) => {
                const isReceiver = item.friend.id === me.id;
                const friend = isReceiver ? item.user : item.friend;

                if (isReceiver && item.status === 'pending') {
                  return (
                    <FriendCard
                      isFriend={false}
                      userId ={friend.id}
                      key={item.id}
                      name={`${friend.firstName} ${friend.lastName}`}
                      profilePhotoId={friend.profilePhotoId}
                      buttonValue={t('friends.accept')}
                      buttonClassName={'accept-button px-2'}
                      onButtonClick={() => {
                        updateFriendship(item.id, 'accepted');
                      }}
                      secondButtonValue={t('friends.refuse')}
                      secondButtonClassName={'delete-button'}
                      onSecondButtonClick={() => {
                        updateFriendship(item.id, 'refused');
                      }}
                    />
                  );
                }
                return null;
              })}
            </div>
          )}
          {/*#########################My requests to add######################*/}
          {friendships.some((f) => f.status === 'pending' && f.user.id === me.id) && (
            <div className="green-border p-2">
              <h1>{t('friends.your-requests')}</h1>
              <div className="row g-4 justify-content-center shortcut-grid">
                {friendships.map((item) => {
                  const isSender = item.user.id === me.id;
                  const friend = isSender ? item.friend : item.user;

                  if (isSender && item.status === 'pending') {
                    return (
                      <FriendCard
                        isFriend={false}
                        userId ={friend.id}
                        key={item.id}
                        name={`${friend.firstName} ${friend.lastName}`}
                        profilePhotoId={friend.profilePhotoId}
                        buttonValue={t('friends.cancel')}
                        buttonClassName={'delete-button px-2'}
                        onButtonClick={() => {
                          updateFriendship(item.id, 'cancelled');
                        }}
                      />
                    );
                  }
                  return null;
                })}
              </div>
            </div>
          )}
          {/*############################Block part##########################*/}
          {friendships.some((f) => f.status === 'blocked') && (
            <div className="red-border p-2">
              <div className="form-new-chat p-3 my-2 gap-3 d-flex flex-column justify-content-center align-items-center">
                <h1>{t('friends.delete-confirm-title', { name: 'user' })}</h1>
                <h1>{'Bocked'}</h1>
                <div className="col-12 col-md-6 col-xl-4">
                  {friendships.map((item) => {
                    const isSender = item.user.id === me.id;
                    const friend = isSender ? item.friend : item.user;

                    if (item.status === 'blocked') {
                      return (
                        <FriendCard
                          isFriend={false}
                          userId ={friend.id}
                          key={item.id}
                          name={`${friend.firstName} ${friend.lastName}`}
                          profilePhotoId={friend.profilePhotoId}
                          buttonValue={t('friends.cancel')}
                          buttonClassName={'delete-button px-2'}
                          onButtonClick={() => {
                            blockUser(item.id);
                          }}
                        />
                      );
                    }
                    return null;
                  })}
                </div>
              </div>
            </div>
          )}
          {/*###################################################*/}
        </div>
      )}
    </div>
  );
}

export default MyFriends;
