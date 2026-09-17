import { useTranslation } from 'react-i18next';
import defaultAvatar from '../../../public/default-avatar.png'; // TMP
import type { MessageProps } from './types.js';
const previewable = ["image/png", "image/webp", "image/jpeg", "image/gif", "application/pdf"];

export const Message = (props: MessageProps) => {
  const {t} = useTranslation()

  return (
    <>
     
    <li
        className={`d-flex align-items-start ${props.senderId === props.userId ? 'flex-row-reverse justify-content-start' : 'justify-content-start'}`}
      >
        <figure className="avatar-msg">
          <img src={`/api/${props.profilePhoto.id}/download` || defaultAvatar} alt="avatar" />
      </figure>
    {props.type === "text" &&
      <>
       
        <div
          className={`${props.senderId === props.userId ? 'message-right' : 'message-left'} card p-3 m-2 text-break`}
        >
          {props.content}
        </div>
      </>
    }
    { props.type === "invitation" &&
      <div className="game-invite-box">
            <p>
              {isMe
                ? "You invited opponent to play Gomoku"
                : `${invite.fromUserName} invites you to play Gomoku`}
            </p>
      
            <p>Board size: {invite.boardSize}</p>
            <p>Mode: {invite.mode}</p>
      
            {!isMe && (
              <div className="invite-actions">
                <button
                  className="btn btn-success"
                  onClick={() => socket.emit("game:accept", invite)}
                >
                  Accept
                </button>
      
                <button
                  className="btn btn-danger"
                  onClick={() => socket.emit("game:decline", invite)}
                >
                  Decline
                </button>
              </div>
            )}
          </div>
    }

    {props.type === "file" &&
      <>
        <div
          className={`${props.senderId === props.userId ? 'message-right' : 'message-left'} card p-3 m-2 text-break`}
        >
          <span className="text-message">{t('message.file-received')}</span>
          { /* file preview here if not previewable just use file type icon */ }
          <embed src="" type="" />
          { /* download button */ }
          <input type="button" className="btn btn-primary" value={t('common.download-file')} />
        </div>
      </>
    }
    </li>


      
    </>
  );
};
