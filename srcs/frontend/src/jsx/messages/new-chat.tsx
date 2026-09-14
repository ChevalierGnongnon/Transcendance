import { useTranslation } from 'react-i18next';

import '../../scss/messages.scss';
import { useEffect, useState } from 'react';
import { useUser } from './hooks/useUser';
import { socket } from './socket';
import { IChatPreview, ActiveView } from './types';

export interface nProps {
  ausers: [];
  setActiveView: (view: ActiveView) => void;
  setActiveChat: (chat: IChatPreview | null) => void;
  setChatList: (chatList: IChatPreview[]) => void;
}

function NewChat({ ausers, setActiveChat, setActiveView, setChatList }: nProps) {
  const { t } = useTranslation();

  // const [searchTerm, setSearchTerm] = useState('');
  // const [searchResults, setSearchResults] = useState('');
  const [userId, setUserId] = useState('');
  const users = ausers;
  const me = useUser();

  const startChat = () => {
    socket.emit('start-new-chat', { recipientId: userId }, (res: any) => {
      if (res.ok) {
        const newChat = res.data;

        setChatList((prev) => {
          const exists = prev.some((chat) => chat.chatId === newChat.chatId);
          return exists ? prev : [newChat, ...prev];
        });
        setActiveChat(newChat);
        setActiveView('conversation');
      } else {
        console.log(res);
        console.log(res);
      }
    });
  };

  return (
    // <form
    //   onSubmit={startChat}
    //   className="form-new-chat p-3 my-2 gap-3 d-flex flex-column justify-content-center align-items-center"
    // >
    <div className="chat-list chat-list-right my-2">
      <h1>{t('message.new-message')}</h1>
      <h3>{t('message.search-user')} : </h3>

      <div className="game-start-wrapper common-head">
        <h1 className="game-start-title">Start Chat</h1>

        <div className="section">
          <h3 className="form-text">Choose partner</h3>

          <select
            className="form-input select-opponent"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
          >
            <option value="">-- choose partner --</option>

            {users.map((u) => (
              <option key={u.id} value={u.id}>
                {u.pseudo} {u.id === me?.id ? '(ви)' : ''}
              </option>
            ))}
          </select>
        </div>

        <button className="form-button start-btn" onClick={startChat}>
          Start Chat
        </button>
      </div>
    </div>
  );
}

export default NewChat;
