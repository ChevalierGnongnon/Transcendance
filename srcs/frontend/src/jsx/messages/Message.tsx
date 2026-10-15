import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { MessageProps } from './types.js';
import { socket } from './socket.js';
import { useNavigate } from "react-router-dom";
import MessageInvitationItem from "./MessageInvitationItem"

const previewable = ['image/png', 'image/webp', 'image/jpeg', 'image/gif', 'application/pdf'];

export const Message = (props: MessageProps) => {
  const navigate = useNavigate();

  const { t } = useTranslation();
  const [resolvedState, setResolvedState] = useState<'accepted' | 'declined' | 'expired' | null>(null);
  const [isResponding, setIsResponding] = useState(false);
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
          <MessageInvitationItem {...props} />
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
            </div>
          </>
        )}
      </li>
    </>
  );
};