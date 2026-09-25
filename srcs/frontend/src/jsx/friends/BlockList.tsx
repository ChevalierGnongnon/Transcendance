import { useTranslation } from 'react-i18next';
import FriendCard from './FriendCard';
import { BlockedUsers } from './types';

interface BlockListProps {
  blockedUsers: BlockedUsers[];
  onUnblockUser: (id: string) => void;
}

function BlockList({ blockedUsers, onUnblockUser }: BlockListProps) {
  const { t } = useTranslation();

  return (
    <div className="red-border p-2">
      <div className="form-new-chat p-3 my-2 gap-3 d-flex flex-column justify-content-center align-items-center">
        {/*<h1>{t('friends.delete-confirm-title', { name: 'user' })}</h1>*/}
        <h1>{t('friends.blocked-users')}</h1>
        <div className="col-12 col-md-6 col-xl-4">
          {blockedUsers.map((item) => (
            <FriendCard
              key={item.id}
              name={`${item.blocked.firstName} ${item.blocked.lastName}`}
              profilePhotoId={item.blocked.profilePhotoId}
              buttonValue={t('friends.unblock')}
              buttonClassName={'delete-button px-2'}
              onButtonClick={() => {
                onUnblockUser(item.blocked.id);
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default BlockList;
