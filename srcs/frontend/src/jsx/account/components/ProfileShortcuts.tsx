import { useTranslation } from 'react-i18next';

import messageIcon from '../../../assets/icons/icon-messages.png';
import playShortcut from '../../../assets/icons/play-shortcut.png';
import addFriendsIcon from '../../../assets/icons/icon-add-friends.png';
import '../../../scss/common-classes.scss';
import '../../../scss/profile-page.scss';
import ShortcutCard from './ShortcutCard';
import { useNavigate } from 'react-router-dom';
import { useCallback, useEffect, useState } from 'react';
import { apiFetch, apiFetchVoid } from '../../friends/apiFetch';
import type { Relationship, OutgoingRequest, Friend, BlockedUsers } from '../../friends/types';
import { useAuth } from '../../auth/auth-context';

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

interface ProfileShortcutsProps {
  user: User;
}

export default function ProfileShortcuts({ user }: ProfileShortcutsProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [relationship, setRelationship] = useState<Relationship>({
    isFriend: false,
    requestSent: false,
    requestReceived: false,
    blockedByMe: false,
    blockedMe: false,
  });

  const loadRelationship = useCallback(async () => {
    const userId = user?.id;
    if (!userId) return;
    setLoading(true);

    try {
      const res = await fetch(`/api/social/relationship/${userId}`, {
        credentials: 'include',
      });

      if (res.status === 401) {
        logout();
        throw new Error('Unauthorized');
      }
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const data = await res.json();
      setRelationship(data);
      setLoading(false);
    } catch (e) {
      console.error('Error get relationship', e);
    }
  }, [user?.id, logout]);

  useEffect(() => {
    loadRelationship();
  }, [loadRelationship]);

  const sendFriendRequest = async (userId: string) => {
    try {
      const data = await apiFetch<OutgoingRequest>(
        `/api/social/friend-requests/${userId}`,
        { method: 'POST' },
        logout
      );

      const newOutgoingRequest: OutgoingRequest = data;
      loadRelationship();
    } catch (err) {
      console.error('Error sendFriendRequest:', err);
    }
  };

  const acceptFriendRequest = async (requestId: string) => {
    try {
      const data = await apiFetch<Friend>(
        `/api/social/friend-requests/${requestId}/accept`,
        { method: 'POST' },
        logout
      );
      const newFriend: Friend = data;
      loadRelationship();
    } catch (err) {
      console.error('Error cancelFriendRequest:', err);
    }
  };

  const cancelFriendRequest = async (requestId: string) => {
    try {
      await apiFetchVoid(`/api/social/friend-requests/${requestId}`, { method: 'DELETE' }, logout);
      loadRelationship();
    } catch (err) {
      console.error('Error cancelFriendRequest:', err);
    }
  };

  const declineFriendRequest = async (requestId: string) => {
    try {
      await apiFetchVoid(`/api/social/friend-requests/${requestId}`, { method: 'DELETE' }, logout);
      loadRelationship();
    } catch (err) {
      console.error('Error declineFriendRequest:', err);
    }
  };

  const deleteFriendship = async (friendshipsId: string) => {
    try {
      await apiFetchVoid(`/api/social/friendships/${friendshipsId}`, { method: 'DELETE' }, logout);
      loadRelationship();
    } catch (err) {
      console.error('Error declineFriendRequest:', err);
    }
  };

  const blockUser = async (userId: string) => {
    try {
      const blocked = await apiFetch<BlockedUsers>(
        `/api/social/blocks/${userId}`,
        { method: 'POST' },
        logout
      );

      const newBlockedUser: BlockedUsers = blocked;
      loadRelationship();
    } catch (err) {
      console.error('Error blockUser:', err);
    }
  };

  const unBlockUser = async (userId: string) => {
    try {
      await apiFetchVoid(`/api/social/blocks/${userId}`, { method: 'DELETE' }, logout);
      loadRelationship();
    } catch (err) {
      console.error('Error unblock user:', err);
    }
  };

  if (error) {
    return <div>{t('common.something-went-wrong')}</div>;
  }

  if (loading) {
    return <div>{t('common.loading')}</div>;
  }

  return (
    <>
      <div className="row g-4 justify-content-center shortcut-grid">
        {/*<div className="col-12 col-md-6 col-xl-6">
          <figure
            className="shortcut-icon justify-content-center"
            // onClick={() => navigate('/addfriend')}
          >
            <img src={addFriendsIcon} alt="message-shortcut" />
            <span>{t('profile-page.send-friendship-invitation')}</span>
          </figure>
        </div>*/}
        {!relationship.blockedByMe &&
          !relationship.blockedMe &&
          !relationship.isFriend &&
          !relationship.requestReceived &&
          !relationship.requestSent && (
            <ShortcutCard
              icon={addFriendsIcon}
              label={t('profile-page.send-friendship-invitation')}
              onClick={() => {
                sendFriendRequest(user.id);
              }}
              alt="addfriend-shortcut"
            />
          )}
        {!relationship.blockedByMe && !relationship.blockedMe && relationship.isFriend && (
          <ShortcutCard
            icon={addFriendsIcon}
            label={t('profile-page.delete-friend')}
            onClick={() => {
              deleteFriendship(user.id);
            }}
            alt="delete-friend-shortcut"
          />
        )}

        {!relationship.blockedByMe && !relationship.blockedMe && (
          <ShortcutCard
            icon={playShortcut}
            label={t('common.send-game-invitation')}
            onClick={() => {
              navigate('/game/gomoku');
            }}
            alt="play-shortcut"
          />
        )}

        {!relationship.blockedByMe && !relationship.blockedMe && (
          <ShortcutCard
            icon={messageIcon}
            label={t('common.send-message')}
            onClick={() => {
              navigate('/messages', {
                state: {
                  user,
                  autoStart: true,
                },
              });
            }}
            alt="message-shortcut"
          />
        )}

        {!relationship.blockedByMe && (
          <ShortcutCard
            icon={addFriendsIcon}
            label={t('friends.block')}
            onClick={() => {
              blockUser(user.id);
            }}
            alt="block-shortcut"
          />
        )}

        {relationship.blockedByMe && (
          <ShortcutCard
            icon={addFriendsIcon}
            label={t('friends.unblock')}
            onClick={() => {
              unBlockUser(user.id);
            }}
            alt="unblock-shortcut"
          />
        )}
      </div>
    </>
  );
}
