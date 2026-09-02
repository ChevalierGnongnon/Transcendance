import type { ChatProps } from './types.js';

export const ChatItem = ({ chat, setActiveView, setActiveChat }: ChatProps) => {
  return (
    <>
      <li
        className="message-block d-flex"
        onClick={() => {
          setActiveView('conversation');
          setActiveChat(chat);
        }}
      >
        <figure className="avatar-msg">
          <img src={`/uploads/${chat.profilePhoto}`} alt="avatar" />
        </figure>
        <div className="p-2 message-text fw-semibold fs-3">{chat.pseudo}</div>
        {chat.unreadCount !== '0' && (
          <span className="badge rounded-pill bg-success me-2 text-start ">{chat.unreadCount}</span>
        )}
      </li>
    </>
  );
};
