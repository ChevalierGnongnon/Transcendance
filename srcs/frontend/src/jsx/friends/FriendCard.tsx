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

export const FriendCard = (props: FriendCardProps) => {
  const {onlineFriends} = useAuth();
  
  let isOnline = onlineFriends.includes(props.userId);

  return (
    <div className="col-12 col-md-6 col-xl-4">
      <figure className="friend-card py-2 px-1 justify-content-center">
        <img
          src={`/api/${props.profilePhotoId}/download`}
          alt="Friend avatar"
          className={!props.isFriend ? 'not-friend-avatar' : isOnline ? 'online-avatar' : 'offline-avatar'}
        />
        <span>{props.name}</span>

        {props.buttonValue && (
          <input
            type="button"
            value={props.buttonValue}
            className={props.buttonClassName}
            onClick={props.onButtonClick}
          />
        )}

        {props.secondButtonValue && (
          <input
            type="button"
            value={props.secondButtonValue}
            className={props.secondButtonClassName}
            onClick={props.onSecondButtonClick}
          />
        )}
      </figure>
    </div>
  );
};
