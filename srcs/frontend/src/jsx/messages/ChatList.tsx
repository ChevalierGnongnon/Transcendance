import { useTranslation } from 'react-i18next';

import '../../scss/common-classes.scss';
import '../../scss/messages.scss';
import ChatItem from './ChatItem';
import type { IChatPreview } from './types';

export interface ChatListProps {
  chatList: IChatPreview[];
  loading: boolean;
  error: Error | null;
  onOpenChat: (chat: IChatPreview | null) => void;
}

function ChatList({ chatList, loading, error, onOpenChat }: ChatListProps) {
  const { t } = useTranslation();

  return (
    <>
      <div className="list-header pt-4">
        <h1>{t('message.chats')}</h1>
      </div>
      {error ? (
        <div className="list-header pt-4">{'Failed to load chats'}</div>
      ) : loading ? (
        <div className="list-header pt-4">{'Loading...'}</div>
      ) : (
        <ul>
          {chatList.map((chat) => (
            <ChatItem key={chat.chatId} chat={chat} onOpenChat={onOpenChat} />
          ))}
        </ul>
      )}
    </>
  );
}

export default ChatList;
