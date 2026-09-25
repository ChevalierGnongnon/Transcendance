import { useTranslation } from 'react-i18next';
import { useEffect, useState, useMemo } from 'react';

import '../../scss/friends.scss';
import AddFriend from './add-friend';
import FriendCard from './FriendCard';
import { useAuth } from '../auth/auth-context';
import { apiFetch, apiFetchVoid } from './apiFetch';
import OutgoingList from './OutgoingRequestsList';
import { Friend, OutgoingRequest, Relationships, BlockedUsers, IncomingRequests } from './types';
import OutgoingRequestsList from './OutgoingRequestsList';
import FriendsList from './FriendsList';
import IncomingRequestsList from './IncomingRequestsList';
import BlockList from './BlockList';

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
  const { logout } = useAuth();
  const [me, setMe] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [relationships, setRelationships] = useState<Relationships>({
    friends: [],
    incomingRequests: [],
    outgoingRequests: [],
    blockedUsers: [],
  });

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
    setLoading(true);
    setError(null);

    apiFetch<Relationships>('/api/social/state', {}, logout)
      .then((data) => {
        setRelationships(data);
      })
      .catch((err) => {
        console.error('Error gettting relationships :', err);
        setError('Can not download relationships');
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const sendFriendRequest = async (userId: string) => {
    try {
      const data = await apiFetch<OutgoingRequest>(
        `/api/social/friend-requests/${userId}`,
        { method: 'POST' },
        logout
      );

      const newOutgoingRequest: OutgoingRequest = data;
      setRelationships((prev) => ({
        ...prev,
        outgoingRequests: [...prev.outgoingRequests, newOutgoingRequest],
      }));
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
      setRelationships((prev) => ({
        ...prev,
        incomingRequests: prev.incomingRequests.filter((req) => req.id !== requestId),
        friends: [newFriend, ...prev.friends],
      }));
    } catch (err) {
      console.error('Error cancelFriendRequest:', err);
    }
  };

  const cancelFriendRequest = async (requestId: string) => {
    try {
      await apiFetchVoid(`/api/social/friend-requests/${requestId}`, { method: 'DELETE' }, logout);
      setRelationships((prev) => ({
        ...prev,
        outgoingRequests: prev.outgoingRequests.filter((req) => req.id !== requestId),
      }));
    } catch (err) {
      console.error('Error cancelFriendRequest:', err);
    }
  };

  const declineFriendRequest = async (requestId: string) => {
    try {
      await apiFetchVoid(`/api/social/friend-requests/${requestId}`, { method: 'DELETE' }, logout);
      setRelationships((prev) => ({
        ...prev,
        incomingRequests: prev.incomingRequests.filter((req) => req.id !== requestId),
      }));
    } catch (err) {
      console.error('Error declineFriendRequest:', err);
    }
  };

  const deleteFriendship = async (friendshipsId: string) => {
    try {
      await apiFetchVoid(`/api/social/friendshs/${friendshipsId}`, { method: 'DELETE' }, logout);
      setRelationships((prev) => ({
        ...prev,
        friends: prev.friends.filter((req) => req.id !== friendshipsId),
      }));
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
      setRelationships((prev) => ({
        ...prev,
        friends: prev.friends.filter((i) => i.friend.id !== userId),
        incomingRequests: prev.incomingRequests.filter((i) => i.sender.id !== userId),
        outgoingRequests: prev.outgoingRequests.filter((o) => o.receiver.id !== userId),
        blockedUsers: [newBlockedUser, ...prev.blockedUsers],
      }));
    } catch (err) {
      console.error('Error blockUser:', err);
    }
  };

  const unBlockUser = async (userId: string) => {
    try {
      await apiFetchVoid(`/api/social/blocks/${userId}`, { method: 'DELETE' }, logout);
      setRelationships((prev) => ({
        ...prev,
        blockedUsers: prev.blockedUsers.filter((req) => req.blocked.id !== userId),
      }));
    } catch (err) {
      console.error('Error unblock user:', err);
    }
  };

  const friends = useMemo(() => relationships.friends, [relationships.friends]);

  function isRelationshipEmpty(relationship: Relationships): boolean {
    return (
      relationship.friends.length === 0 &&
      relationship.outgoingRequests.length === 0 &&
      relationship.incomingRequests.length === 0 &&
      relationship.blockedUsers.length === 0
    );
  }

  if (loading) {
    return (
      <div className="friends-page m-2 p-2">
        <AddFriend
          send={sendFriendRequest}
          accept={acceptFriendRequest}
          block={blockUser}
          unblock={unBlockUser}
        />
        <div>
          <p>{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  if (isRelationshipEmpty(relationships)) {
    return (
      <div className="friends-page m-2 p-2">
        <AddFriend
          send={sendFriendRequest}
          accept={acceptFriendRequest}
          block={blockUser}
          unblock={unBlockUser}
        />
        <div>
          <p>{t('friends.no-friends')}</p>
          <p>{t('friends.no-friends-hint')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="friends-page m-2 p-2">
      <AddFriend
        send={sendFriendRequest}
        accept={acceptFriendRequest}
        decline={declineFriendRequest}
        block={blockUser}
        unblock={unBlockUser}
      />

      {relationships.friends.length > 0 && (
        <FriendsList friends={relationships.friends} onDeleteFriend={deleteFriendship} />
      )}

      {relationships.incomingRequests.length > 0 && (
        <IncomingRequestsList
          incomingRequests={relationships.incomingRequests}
          onAcceptRequest={acceptFriendRequest}
          onDeclineRequest={declineFriendRequest}
        />
      )}

      {relationships.outgoingRequests.length > 0 && (
        <OutgoingRequestsList
          outgoingRequests={relationships.outgoingRequests}
          onCancelRequest={cancelFriendRequest}
        />
      )}

      {relationships.blockedUsers.length > 0 && (
        <BlockList blockedUsers={relationships.blockedUsers} onUnblockUser={unBlockUser} />
      )}
    </div>
  );
}

export default MyFriends;
