import { useTranslation } from 'react-i18next';
import type { MessageProps } from './types.js';
import { socket } from './socket.js';
import { useEffect, useState } from 'react';
import ErrorMessage from '../others/error-message.js';

const previewable = ['image/png', 'image/webp', 'image/jpeg', 'image/gif', 'application/pdf'];

export const Message = (props: MessageProps) => {
  const { t } = useTranslation();
  const fileId = props.type === 'file' ? props.content : '';
  const [MimeType, setMimeType] = useState('');
  const [loading, setLoading] = useState(false);
  const [deletedFile, setDeletedFile] = useState<boolean>(false);

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
        if (!cancelled){
          setMimeType(MimeType);
          if (!res.ok)
            setDeletedFile(true);
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
              {!loading && !deletedFile && MimeType.startsWith('image/') && (
                <img
                  src={`/api/${fileId}/download`}
                  alt="attachment"
                  className="bg-img-message"
                />
              )}

              {/* {!loading && !deletedFile && MimeType === 'application/pdf' && (
                <embed
                  src={`/api/${fileId}/download`}
                  className="pdf-preview"
                  type="application/pdf"
                />
              )} */}

              {!loading && !deletedFile && MimeType === 'application/pdf' &&
                <img
                  src="/pdf-icon.svg"
                  alt="icon-pdf"
                  className="icon-type"
                />
              }

              {!loading && !deletedFile
                && MimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' &&
                <img
                  src="/docx-icon.svg"
                  alt="icon-docx"
                  className="icon-type"
                />
              }

              {!loading && !deletedFile 
                && MimeType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' &&
                <img
                  src="/xlsx-icon.svg"
                  alt="icon-xslx"
                  className="icon-type"
                />
              }

              {!loading && !deletedFile 
                && MimeType === 'application/vnd.openxmlformats-officedocument.presentationml.presentation' &&
                <img
                  src="/pptx-icon.svg"
                  alt="icon-pdf"
                  className="icon-type"
                />
              }
              {/* download button */}
              {!deletedFile &&
                // <a
                //   href={`/api/${props.content}/download`}
                //   download
                //   // type="button"
                //   className="btn btn-primary"
                // >
                //   {t('common.download-file')}
                // </a>
                <input type="button" value={t('common.download-file')} className='btn btn-primary m-1' onClick={
                  async()=>{
                    const res = await fetch(`/api/${props.content}/download`, {credentials: 'include'})
                    if (!res.ok)
                      setDeletedFile(true)
                    else {
                      const blob = await res.blob();
                      const url = URL.createObjectURL(blob)
                      const contentDisposition = res.headers.get('Content-Disposition');
                      const match = contentDisposition?.match(/filename="(.+)"/);
                      const filename = match?.[1] ?? fileId;
                      const link = document.createElement('a');
                      link.download = filename;
                      link.href = url;
                      link.click();
                      URL.revokeObjectURL(url)
                    }
                    
                  }
                }/>
              }
              { deletedFile &&
                <ErrorMessage error={t('common.file-is-deleted')}></ErrorMessage>
                
              }
              
              {!deletedFile &&
                <input
                type="button"
                value={t('common.delete-file')}
                className='btn btn-primary m-1'
                onClick={async() =>{
                  const res = await fetch(`/api/${fileId}`, { credentials: 'include', method: 'DELETE' })
                    if (!res.ok)
                      setDeletedFile(false);
                    else
                      setDeletedFile(true);
                  }
                }/>
              } 
            </div>
          </>
        )}
      </li>
    </>
  );
};
