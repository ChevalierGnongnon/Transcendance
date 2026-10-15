import { useFriendships } from '../friends/useFriendships.js';
import Badge from './Badge.js';
import type { IChatPreview } from './types.js';

export interface ChatItemProps {
  chat: IChatPreview;
  onOpenChat: (chat: IChatPreview | null) => void;
}

function ChatItem({ chat, onOpenChat }: ChatItemProps) {
  const { getStatus } = useFriendships();
  const { user, unreadCount = 0 } = chat;
  const { pseudo, profilePhoto } = user;

  return (
    <>
      <li
        className="message-block d-flex"
        onClick={() => {
          onOpenChat(chat);
        }}
      >
        <figure className={`avatar-msg ${getStatus(user.id)}-avatar`}>
          <img
            src={profilePhoto?.id ? `/api/${profilePhoto.id}/download` : '/default-avatar.png'}
            alt={pseudo}
          />
        </figure>
        <div className="p-2 message-text fw-semibold fs-3">{pseudo}</div>
        <Badge count={unreadCount} />
      </li>
    </>
  );
}

export default ChatItem;
