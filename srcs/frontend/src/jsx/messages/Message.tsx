import { useTranslation } from 'react-i18next';
import type { MessageProps } from './types.js';
import { socket } from './socket.js';
import { useNavigate } from "react-router-dom";

const previewable = ['image/png', 'image/webp', 'image/jpeg', 'image/gif', 'application/pdf'];

export const Message = (props: MessageProps) => {
  const navigate = useNavigate();

  const { t } = useTranslation();

  return (
    <>

      <li
        className={`d-flex align-items-start ${props.senderId === props.userId ? 'flex-row-reverse justify-content-start' : 'justify-content-start'}`}
      >
        <figure className="avatar-msg">
          <img
            src={
              props.profilePhoto.id
                ? `/api/${props.profilePhoto.id}/download`
                : '/default-avatar.png'
            }
            alt="avatar"
          />
        </figure>
        {props.type === 'text' && (
          <>
            <div
              className={`${props.senderId === props.userId ? 'message-right' : 'message-left'} card p-3 m-2 text-break`}
            >
              {props.content}
            </div>
          </>
        )}
        {props.type === 'invitation' && (
          <>
            <div className="game-invite-box card p-2 m-2">
              <span className="text-message">You invited to play Gomoku</span>
              <div className="invite-actions">
                <button
                  className="btn btn-success"
                  disabled={props.senderId === props.userId || !props.messageId}
                  onClick={() => {
                    
                    socket.emit("ping-test");

                    socket.emit("game:accept", {
                      invitationId: props.messageId,
                      chatId: props.chatId,
                      fromUserId: props.senderId,
                      toUserId: props.userId,
                      boardSize: Number(props.content),
                    });
                  }}
                >
                  Accept
                </button>

                <button
                  className="btn btn-danger"

                  onClick={() => socket.emit("game:decline", '')}

                >
                  Decline
                </button>
              </div>
            </div>
          </>
        )}


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