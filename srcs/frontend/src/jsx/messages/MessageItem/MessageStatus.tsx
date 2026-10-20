import { useTranslation } from 'react-i18next';
import type { MessageStatus } from '../types';

import { Clock, Check, CheckCheck } from 'lucide-react';

interface MessageStatusProps {
  status: MessageStatus;
  isOwnMessage: boolean;
}

function MessageStatus({ status, isOwnMessage }: MessageStatusProps) {
  const { t } = useTranslation();

  if (!isOwnMessage) return null;

  if (status === 'error') {
    return (
      <div className="d-flex message-error card p-1 m-1 border-danger bg-light text-start">
        <span className="text-danger fw-bold">{t('message.failed-to-send')}</span>
      </div>
    );
  }

  const getStatusIcon = () => {
    switch (status) {
      case 'sending':
        return <Clock size={12} />;
      case 'sent':
        return <Check size={12} />;
      case 'read':
        return <CheckCheck size={12} />;
      default:
        return null;
    }
  };

  const icon = getStatusIcon();
  if (!icon) return null;

  return <div className="message-status-badge">{icon}</div>;
}

export default MessageStatus;
