import { useTranslation } from 'react-i18next';
import { useState, useEffect, useCallback } from 'react';

import '../../scss/common-classes.scss';
import '../../scss/messages.scss';
// import defaultAvatar from '../../../public/default-avatar.png';
import { ChatItem } from './ChatItem';
import { ChatListProps, IChatPreview, IMessage } from './types';
import { getChats, fetchMessages } from './utils/api.js';

function ChatList(props: ChatListProps) {
  const { t } = useTranslation();
  // const [unread, setUnread] = useState<[{ chatId: string; count: string }]>();

  return (
    <>
      <div
        className={
          props.align === 'center'
            ? 'chat-list mx-auto my-2'
            : 'chat-list chat-list-side my-2 d-none d-md-block'
        }
      >
        <div className="list-header pt-4">
          <h1>{t('message.my-messages')}</h1>
        </div>
        {props.error ? (
          <div className="list-header pt-4">{'Failed to load chats'}</div>
        ) : props.loading ? (
          <div className="list-header pt-4">{'Loading...'}</div>
        ) : (
          <ul>
            {props.chatList.map((chat) => (
              <ChatItem
                key={chat.chatId}
                chat={chat}
                setActiveView={props.setActiveView}
                setActiveChat={props.setActiveChat}
              />
            ))}
          </ul>
        )}
      </div>
    </>
  );
}

export default ChatList;
