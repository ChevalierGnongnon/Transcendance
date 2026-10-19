import { useTranslation } from 'react-i18next';
import type { SearchResult } from './types';

interface UserCardProps {
  user: SearchResult;
  actionLabel: string;
  onAction: (user: SearchResult) => void;
  className?: string;
}

function UserCard({ user, actionLabel, onAction, className }: UserCardProps) {
  const { t } = useTranslation();

  const profilePhotoId = user.profilePhoto?.id;
  const avatarUrl = profilePhotoId ? `api/${profilePhotoId}/download` : '/default-avatar.png';

  return (
    <div className={`col-12 col-md-6 col-xl-4 ${className ?? ''}`}>
      <figure className="friend-card py-2 px-1 justify-content-center text-break">
        <img src={avatarUrl} alt={t('friends.avatar-alt')} />
        <span>
          {user.firstName} {user.lastName}
        </span>
        <input
          type="button"
          value={actionLabel}
          className="accept-button text-break"
          onClick={() => onAction(user)}
        />
      </figure>
    </div>
  );
}

export default UserCard;
