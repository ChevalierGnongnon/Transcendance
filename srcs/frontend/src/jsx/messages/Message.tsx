import { useTranslation } from 'react-i18next';
import type { MessageProps } from './types.js';
import { socket } from './socket.js';
import { useEffect, useState } from 'react';

const previewable = ['image/png', 'image/webp', 'image/jpeg', 'image/gif', 'application/pdf'];

export const Message = (props: MessageProps) => {
  const { t } = useTranslation();
  const fileId = props.type === 'file' ? props.content : '';
  const [MimeType, setMimeType] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!fileId) {
      setMimeType('');
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);

    fetch(`/api/${fileId}/download`, { credentials: 'include', method: 'HEAD' })
      .then((res) => {
        const MimeType = res.headers.get('Content-Type') ?? '';
        if (!cancelled) setMimeType(MimeType);
      })
      .catch((e) => {
        if (!cancelled) setMimeType('');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

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
              <p>Board size: {props.content}</p>
              <div className="invite-actions">
                <button
                  className="btn btn-success"
                  onClick={() => {
                    socket.emit('game:invite:answer', 'accept');
                    // 'naviagete to game page'
                  }}
                >
                  Accept
                </button>

                <button
                  className="btn btn-danger"
                  onClick={() => {
                    socket.emit('game:invite:answer', 'decline');
                  }}
                >
                  Decline
                </button>
              </div>
            </div>
          </>
        )}

        {props.type === 'file' && (
          <>
            <div
              className={`${props.senderId === props.userId ? 'message-right' : 'message-left'} card p-3 m-2 text-break`}
            >
              {props.senderId !== props.userId && !MimeType.startsWith('image/') && (
                <span className="text-message">{t('message.file-received')}</span>
              )}
              {/* file preview here if not previewable just use file type icon */}
              {!loading && MimeType.startsWith('image/') && (
                <img
                  src={`/api/${fileId}/download`}
                  alt="attachment"
                  style={{ maxWidth: 300, maxHeight: 300, objectFit: 'contain', borderRadius: 8 }}
                />
              )}
              {/* download button */}
              <a
                href={`/api/${props.content}/download`}
                download
                // type="button"
                className="btn btn-primary"
              >
                {t('common.download-file')}
              </a>
              <input type="button" value={t('common.delete-file')}/>
            </div>
          </>
        )}
      </li>
    </>
  );
};
