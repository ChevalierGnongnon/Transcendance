import { useTranslation } from 'react-i18next';
import type { MessageStatus } from '../types.js';
import { socket } from '../socket.js';
import { useEffect, useState } from 'react';
import ErrorMessage from '../../others/error-message.js';
import { useFriendships } from '../../friends/useFriendships.js';

export interface MessageFileItemProps {
  fileId: string;
  isOwnMessage: boolean;
  status?: MessageStatus;
}

function MessageFileItem(props: MessageFileItemProps) {
  const { t } = useTranslation();
  const [MimeType, setMimeType] = useState('');
  const [loading, setLoading] = useState(false);
  const [deletedFile, setDeletedFile] = useState<boolean>(false);
  const { getStatus } = useFriendships();

  useEffect(() => {
    if (!props.fileId) {
      setMimeType('');
      setLoading(false);

      return;
    }
    //if status is sending, it is not attached to the chat
    if (props.status === 'sending') 
        return;
    let cancelled = false;
    setLoading(true);

    fetch(`/api/${props.fileId}/download`, { credentials: 'include', method: 'HEAD' })
      .then((res) => {
        const MimeType = res.headers.get('Content-Type') ?? '';
        if (!cancelled) {
          setMimeType(MimeType);
          if (!res.ok) setDeletedFile(true);
        }
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
  }, [props.fileId, props.status]); // will restart when status changes

  useEffect(() => {
    function handleFileDeleted(data: {fileId: string}) {
      if (data.fileId === props.fileId) setDeletedFile(true);
    }
    socket.on('file-deleted', handleFileDeleted);
    return () => {socket.off('file-deleted', handleFileDeleted)}
  }, []);

  return (
    <>
      {/*<div className={`${isOwnMessage ? 'message-right' : 'message-left'} card p-3 m-2 text-break`}>*/}
      {!props.isOwnMessage && !MimeType.startsWith('image/') && (
        <span className="text-message">{t('message.file-received')}</span>
      )}
      {/* file preview here if not previewable just use file type icon */}
      {!loading && !deletedFile && MimeType.startsWith('image/') && (
        <img src={`/api/${props.fileId}/download`} alt={t('alt.attachment')} className="bg-img-message" />
      )}

      {!loading && !deletedFile && MimeType === 'application/pdf' && (
        <img src="/pdf-icon.svg" alt={t('alt.pdf')} className="icon-type" />
      )}

      {!loading &&
        !deletedFile &&
        MimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' && (
          <img src="/docx-icon.svg" alt={t('alt.docx')} className="icon-type" />
        )}

      {!loading &&
        !deletedFile &&
        MimeType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' && (
          <img src="/xlsx-icon.svg" alt={t('alt.xlsx')} className="icon-type" />
        )}

      {!loading &&
        !deletedFile &&
        MimeType ===
          'application/vnd.openxmlformats-officedocument.presentationml.presentation' && (
          <img src="/pptx-icon.svg" alt={t('alt.pptx')} className="icon-type" />
        )}
      {/* download button */}
      {!deletedFile && (
        <input
          type="button"
          value={t('common.download-file')}
          className="btn btn-primary m-1"
          onClick={async () => {
            const res = await fetch(`/api/${props.fileId}/download`, {
              credentials: 'include',
            });
            if (!res.ok) setDeletedFile(true);
            else {
              const blob = await res.blob();
              const url = URL.createObjectURL(blob);
              const contentDisposition = res.headers.get('Content-Disposition');
              const match = contentDisposition?.match(/filename="(.+)"/);
              const filename = match?.[1] ?? props.fileId;
              const link = document.createElement('a');
              link.download = filename;
              link.href = url;
              link.click();
              URL.revokeObjectURL(url);
            }
          }}
        />
      )}
      {deletedFile && <ErrorMessage error="FILE_DELETED"></ErrorMessage>}

      {!deletedFile && props.isOwnMessage && (
        <input
          type="button"
          value={t('common.delete-file')}
          className="btn btn-primary m-1"
          onClick={async () => {
            const res = await fetch(`/api/${props.fileId}`, {
              credentials: 'include',
              method: 'DELETE',
            });
            if (!res.ok) setDeletedFile(false);
            else setDeletedFile(true);
          }}
        />
      )}
      {/*</div>*/}
    </>
  );
}

export default MessageFileItem;
