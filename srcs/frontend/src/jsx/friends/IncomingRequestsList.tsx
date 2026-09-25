import { useTranslation } from 'react-i18next';
import FriendCard from './FriendCard';
import { IncomingRequests } from './types';

interface IncomingRequestsListProps {
  incomingRequests: IncomingRequests[];
  onAcceptRequest: (id: string) => void;
  onDeclineRequest: (id: string) => void;
}

function IncomingRequestsList({
  incomingRequests,
  onAcceptRequest,
  onDeclineRequest,
}: IncomingRequestsListProps) {
  const { t } = useTranslation();

  return (
    <div className="orange-border p-2">
      <h1>{t('friends.pending-requests')}</h1>
      <div className="row g-4 justify-content-center shortcut-grid"></div>
      {incomingRequests.map((item) => (
        <FriendCard
          key={item.id}
          name={`${item.sender.firstName} ${item.sender.lastName}`}
          profilePhotoId={item.sender.profilePhotoId}
          buttonValue={t('friends.accept')}
          buttonClassName={'accept-button px-2'}
          onButtonClick={() => {
            onAcceptRequest(item.id);
          }}
          secondButtonValue={t('friends.refuse')}
          secondButtonClassName={'delete-button'}
          onSecondButtonClick={() => {
            onDeclineRequest(item.id);
          }}
        />
      ))}
    </div>
  );
}

export default IncomingRequestsList;
