import '../../scss/common-classes.scss';
import '../../scss/messages.scss';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';

import ChatRoom from './ChatRoom';
import NavBar from './navbar';
import NewChat from './new-chat';
import ChatList from './ChatList';
import ImaginaryFriend from '../ai/ImaginaryFriend';
import type { IChatPreview, NewChatState } from './types';
import { Loading } from './Loading';
import useChat from './hooks/useChat';

function Messages() {
  const { t } = useTranslation();

  const location = useLocation();
  const state = location.state as NewChatState | null;
  const [autoStartChat, setAutoStartChat] = useState<boolean>(state?.autoStart ?? false);

  const {
    me,
    activeView,
    activeChat,
    chatList,
    setActiveView,
    setActiveChat,
    loadingChats,
    error,
    messages,
    addMessage,
    updateMessage,
    startChat,
    otherlastReadMessagesId,
  } = useChat();

  const openChat = (chat: IChatPreview | null) => {
    setActiveChat(chat);
    setActiveView('conversation');
  };

  if (!me || error) {
    return <div>{t('common.something-went-wrong')}</div>;
  }

  if (loadingChats) {
    return <Loading text={t('common.loading')} />;
  }

  return (
    <>
      <NavBar activeView={activeView} setActiveView={setActiveView} />

      <div className={activeView !== 'chats' ? 'd-flex' : ''}>
        <div
          className={
            activeView === 'chats'
              ? 'chat-list mx-auto my-2'
              : 'chat-list chat-list-side my-2 d-none d-md-block'
          }
        >
          <ChatList
            chatList={chatList}
            loading={loadingChats}
            error={error}
            onOpenChat={openChat}
          />
        </div>
        {activeView === 'conversation' && activeChat && (
          <ChatRoom
            me={me}
            chat={activeChat}
            setActiveView={setActiveView}
            messages={messages}
            onAddMessage={addMessage}
            onUpdateMessage={updateMessage}
            otherLastReadMessagesId={otherlastReadMessagesId}
          />
        )}
        {(activeView === 'new message' || autoStartChat) && (
          <NewChat
            autoStartUser={state?.user ? state?.user : null}
            autoStart={autoStartChat}
            setAutoStart={setAutoStartChat}
            onStartChat={startChat}
          />
        )}
        {activeView === 'imaginaryfriend' && <ImaginaryFriend />}
        </div>
      </>
  );
}

export default Messages;
