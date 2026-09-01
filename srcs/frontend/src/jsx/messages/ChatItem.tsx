import type { ChatProps } from './types.js';

export const ChatItem = ({
  chatId,
  pseudo,
  profilePhoto,
  setActiveView,
  setActiveChatId,
}: ChatProps) => {
  return (
    <>
      <li
        className="message-block d-flex"
        onClick={() => {
          setActiveView('conversation');
          setActiveChatId(chatId);
        }}
      >
        <figure className="avatar-msg">
          <img src={`/uploads/${profilePhoto}`} alt="avatar" />
        </figure>
        <div className="p-2 message-text">
          {pseudo} =={'>'} id: {chatId}
        </div>
      </li>
    </>
  );
};
