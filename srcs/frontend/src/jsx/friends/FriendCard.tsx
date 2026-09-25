type FriendCardProps = {
  name: string;
  profilePhotoId?: string;

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
}: FriendCardProps) {
  return (
    <div className="col-12 col-md-6 col-xl-4">
      <figure className="friend-card py-2 px-1 justify-content-center">
        <img src={`/api/${profilePhotoId}/download`} alt="Friend avatar" />
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
