import defaultAvatar from '../../../public/default-avatar.png'; // TMP
import type { MessageProps } from './types.js';

export const Message = ({ userId, senderId, profilePhoto, content }: MessageProps) => {
  return (
    <>
      <li
        className={`d-flex ${senderId === userId ? 'justify-content-end' : 'justify-content-start'}`}
      >
        <figure className="avatar-msg">
          <img src={`/uploads/${profilePhoto}`} alt="avatar" />
        </figure>
        <div className={`${senderId === userId ? 'message-right' : 'message-left'} card p-3 m-2`}>
          {content}
        </div>
      </li>
    </>
  );
};
