import { useTranslation } from "react-i18next";
import { useAuth } from "../auth/auth-context";
// import ""
type FriendCardProps = {
  userId: string;
  name: string;
  profilePhotoId?: string;
  isFriend: boolean;
  
  buttonValue: string;
  buttonClassName?: string;
  onButtonClick?: () => void;

  secondButtonValue?: string;
  secondButtonClassName?: string;
  onSecondButtonClick?: () => void;
};


function FriendCard({
    name,
    profilePhotoId,
    buttonValue,
    buttonClassName,
    onButtonClick,

    secondButtonValue,
    secondButtonClassName,
    onSecondButtonClick,
    userId,
    isFriend
  }: FriendCardProps) {
  const { t } = useTranslation();
  const {onlineFriends} = useAuth();
  
  let isOnline = onlineFriends.includes(userId);

  
  return (
    <div className="col-12 col-md-6 col-xl-4">
      <figure className="friend-card py-2 px-1 justify-content-center">
        <img
          src={`/api/${profilePhotoId}/download`}
          alt={t('friends.avatar-alt')}
          className={!isFriend ? 'not-friend-avatar' : isOnline ? 'online-avatar' : 'offline-avatar'}
        />
        <span>{name}</span>

        {buttonValue && (
          <input
            type="button"
            value={buttonValue}
            className={buttonClassName}
            onClick={onButtonClick}
          />
        )}

        {secondButtonValue && (
          <input
            type="button"
            value={secondButtonValue}
            className={secondButtonClassName}
            onClick={onSecondButtonClick}
          />
        )}
      </figure>
    </div>
  );
}

export default FriendCard;
