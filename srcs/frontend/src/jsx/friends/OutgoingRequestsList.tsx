import { useTranslation } from 'react-i18next';
import FriendCard from './FriendCard';
import { OutgoingRequest } from './types';

interface OutgoingListProps {
  outgoingRequests: OutgoingRequest[];
  onCancelRequest: (id: string) => void;
}

function OutgoingRequestsList({ outgoingRequests, onCancelRequest }: OutgoingListProps) {
  const { t } = useTranslation();

  return (
    <div className="green-border p-2">
      <h1>{t('friends.your-requests')}</h1>
      <div className="row g-4 justify-content-center shortcut-grid">
        {outgoingRequests.map((item) => (
          <FriendCard
            key={item.id}
            name={`${item.receiver.firstName} ${item.receiver.lastName}`}
            profilePhotoId={item.receiver.profilePhotoId}
            buttonValue={t('friends.cancel')}
            buttonClassName={'delete-button px-2'}
            onButtonClick={() => {
              onCancelRequest(item.id);
            }}
          />
        ))}
      </div>
    </div>
  );
}

export default OutgoingRequestsList;
