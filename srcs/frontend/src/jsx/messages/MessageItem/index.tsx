import { useTranslation } from 'react-i18next';

import '../../../scss/messages.scss';
import type { MessageProps } from '../types.js';
import MessageStatus from './MessageStatus';
import MessageFileItem from './MessageFileItem';
import MessageInvitationItem from './MessageInvitationItem';

function Message(props: MessageProps) {
  const fileId = props.type === 'file' ? props.content : '';
  const isOwnMessage = props.senderId === props.userId;

  const renderContent = () => {
    switch (props.type) {
      case 'text':
        return props.content;
      case 'invitation':
        return <MessageInvitationItem {...props} />;
      case 'file':
        return (
          <MessageFileItem fileId={fileId} isOwnMessage={isOwnMessage} status={props.status} />
        );
      default:
        return null;
    }
  };

  return (
    <>
      <li
        className={`d-flex align-items-start ${isOwnMessage ? 'flex-row-reverse justify-content-start' : 'justify-content-start'}`}
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

        <div
          className={`${isOwnMessage ? 'message-right' : 'message-left'} card p-3 m-2 text-break`}
        >
          {renderContent()}

          <MessageStatus status={props.status} isOwnMessage={isOwnMessage} />
        </div>
      </li>
    </>
  );
}

export default Message;
