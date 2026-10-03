import { useTranslation } from 'react-i18next';
import FriendCard from './FriendCard';
import { Friend } from './types';

interface FriendsListProps {
  friends: Friend[];
  onDeleteFriend: (id: string) => void;
}

function FriendsList({ friends, onDeleteFriend }: FriendsListProps) {
  const { t } = useTranslation();

  if (friends.length === 0) return null;

  return (
    <div>
      <h1>{t('friends.my-friends')}</h1>
      <div className="row g-4 justify-content-center shortcut-grid">
        {friends.map((item) => (
          <FriendCard
            key={item.id}
            name={`${item.friend.firstName} ${item.friend.lastName}`}
            profilePhotoId={item.friend.profilePhotoId}
            buttonValue={t('friends.delete-friend')}
            buttonClassName="delete-button px-2"
            onButtonClick={() => onDeleteFriend(item.id)}
          />
        ))}
      </div>
    </div>
  );
}

export default FriendsList;
