import { useTranslation } from 'react-i18next';
import '../../scss/messages.scss';
import { useRef } from 'react';
import { MessageType } from './types';
import { useAuth } from '../auth/auth-context';

interface MoreOptionsProps {
  chatId: string;
  onClose: () => void;
  onSendMessage: (content?: string, type?: MessageType) => void;
}

function MoreOptions(props: MoreOptionsProps) {
  const { t } = useTranslation();
  const { logout } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const handleSendMessage = props.onSendMessage;

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch(`/api/message/${props.chatId}`, {
      credentials: 'include',
      method: 'POST',
      body: formData,
    });

    if (res.status == 401) {
      logout();
      return;
    }

    if (!res.ok) {
      return;
    }

    const data = await res.json();

    handleSendMessage(data.file_id);
    props.onClose();
  };

  return (
    <div className="more-options-div gap-1 d-flex flex-column align-items-center">
      <input
        type="button"
        value={t('message.upload-file')}
        className="btn btn-primary more-options-btn"
        onClick={handleClick}
      />
      <input type="file" ref={fileInputRef} onChange={handleChange} style={{ display: 'none' }} />
      <input
        type="button"
        value={t('message.invite-to-game')}
        className="btn btn-primary more-options-btn"
      />
    </div>
  );
}

export default MoreOptions;
