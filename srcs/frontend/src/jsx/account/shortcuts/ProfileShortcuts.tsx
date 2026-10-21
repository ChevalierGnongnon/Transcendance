import { useTranslation } from 'react-i18next';

import messageIcon from '../../../assets/icons/icon-messages.png';
import playShortcut from '../../../assets/icons/play-shortcut.png';
import addFriendsIcon from '../../../assets/icons/icon-add-friends.png';
import removeFriend from '../../../assets/icons/remove-friend.png';
import block from '../../../assets/icons/block.png';
import unBlock from '../../../assets/icons/unblock.png';
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

  const deleteFriend = async (userId: string) => {
    try {
      await apiFetchVoid(`/api/social/friends/${userId}`, { method: 'DELETE' }, logout);
      loadRelationship();
    } catch (err) {
      console.error('Error: Delete friend:', err);
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
              alt={t('alt.add-friend')}
            />
          )}
        {!relationship.blockedByMe && !relationship.blockedMe && relationship.isFriend && (
          <ShortcutCard
            icon={removeFriend}
            label={t('profile-page.remove-friend')}
            onClick={() => {
              deleteFriend(user.id);
            }}
            alt={t('alt.remove-friend')}
          />
        )}

        {!relationship.blockedByMe && !relationship.blockedMe && (
          <ShortcutCard
            icon={playShortcut}
            label={t('common.send-game-invitation')}
            onClick={() => {
              navigate('/game/gomoku', {
                state: { opponentId: user.id },
              });
            }}
            alt={t('alt.play')}
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
            alt={t('alt.messages')}
          />
        )}

        {!relationship.blockedByMe && (
          <ShortcutCard
            icon={block}
            label={t('profile-page.block-user')}
            onClick={() => {
              blockUser(user.id);
            }}
            alt={t('alt.block')}
          />
        )}

        {relationship.blockedByMe && (
          <ShortcutCard
            icon={unBlock}
            label={t('profile-page.unblock-user')}
            onClick={() => {
              unBlockUser(user.id);
            }}
            alt={t('alt.unblock')}
          />
        )}
      </div>
    </>
  );
}
