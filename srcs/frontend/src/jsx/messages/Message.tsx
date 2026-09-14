import defaultAvatar from '../../../public/default-avatar.png'; // TMP
import type { MessageProps } from './types.js';

export const Message = ({ userId, senderId, profilePhoto, content }: MessageProps) => {
  return (
    <>
      <li
        className={`d-flex align-items-start ${senderId === userId ? 'flex-row-reverse justify-content-start' : 'justify-content-start'}`}
      >
        <figure className="avatar-msg">
          <img src={`/uploads/${profilePhoto}` || defaultAvatar} alt="avatar" />
        </figure>
        <div
          className={`${senderId === userId ? 'message-right' : 'message-left'} card p-3 m-2 text-break`}
        >
          {content}
        </div>
      </li>
    </>
  );
};
