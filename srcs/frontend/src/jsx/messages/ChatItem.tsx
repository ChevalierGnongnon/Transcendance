import type { ChatProps } from './types.js';
import { useFriendships } from '../friends/useFriendships.js';


export const ChatItem = ({ chat, setActiveView, setActiveChat }: ChatProps) => {
  const {getStatus} = useFriendships();
  return (
    <>
      <li
        className="message-block d-flex"
        onClick={() => {
          setActiveView('conversation');
          setActiveChat(chat);
        }}
      >
        <figure className={`avatar-msg ${getStatus(chat.user.id)}-avatar`}>
          <img src={`/api/${chat.user.profilePhoto.id}/download`} alt="avatar" />
        </figure>
        <div className="p-2 message-text fw-semibold fs-3">{chat.user.pseudo}</div>
        {chat.unreadCount > 0 && (
          <span className="badge rounded-pill bg-success me-2 text-start ">{chat.unreadCount}</span>
        )}
      </li>
    </>
  );
};
