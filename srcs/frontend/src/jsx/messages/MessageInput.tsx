import { useState, ChangeEvent, KeyboardEvent, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { socket } from './socket';

import '../../scss/common-classes.scss';
import '../../scss/messages.scss';
import MoreOptions from './options';

interface MessageInputProps {
  opponentId: string;
  chatId: string;
  userId: string;
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  disabled?: boolean;
  placeholder?: string;
}

function MessageInput({
  chatId,
  opponentId,
  userId,
  value,
  onChange,
  onSend,
  disabled = false,
  placeholder,
}: MessageInputProps) {
  const { t } = useTranslation();
  const [showMoreOptions, setShowMoreOptions] = useState(false);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const MAX_LENGTH = 5000;
  const isOverLimit = value.length >= MAX_LENGTH;

  const handleChange = async (e: ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;

    if (newValue.length > MAX_LENGTH) return;
    onChange(newValue);

    if (!typingTimeoutRef.current) {
      const response = await socket.emitWithAck('chat:typing:start', {
        chatId: chatId,
        to: userId,
      });

      if (!response.ok) {
        console.error(`error: ${response}`);
        return;
      }
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      socket.emit('chat:typing:stop', { chatId: chatId, to: userId });
      typingTimeoutRef.current = null;
    }, 2000);
  };

  useEffect(() => {
    return () => clearTimeout(typingTimeoutRef.current);
  }, []);

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!disabled || !isOverLimit) {
        socket.emit('chat:typing:stop', { chatId: chatId, to: userId });
        typingTimeoutRef.current = null;
        onSend();
      }
    }
  };

  const toggleMoreOptions = () => {
    setShowMoreOptions((prev) => !prev);
  };

  const handleSendClick = () => {
    if (!disabled || !isOverLimit) {
      socket.emit('chat:typing:stop', { chatId: chatId, to: userId });
      typingTimeoutRef.current = null;
      onSend();
    }
  };

  return (
    <>
      <div className="input-group group-new-message my-3 mt-auto">
        <div className="position-relative">
          <button
            className="btn fs-2 send-message d-flex align-items-center justify-content-center"
            onClick={toggleMoreOptions}
            type="button"
            disabled={disabled}
          >
            +
          </button>
          {showMoreOptions && (
            <MoreOptions
              chatId={chatId}
              opponentId={opponentId}
              onClose={toggleMoreOptions}
              onSendMessage={onSend}
            />
          )}
        </div>

        <textarea
          className="form-control message-area"
          name="new-message"
          placeholder={placeholder || t('message.type-your-message')}
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          disabled={disabled}
        />

        <button
          className="btn send-message"
          onClick={handleSendClick}
          type="button"
          disabled={disabled || !value.trim() || isOverLimit}
        >
          {t('common.send')}
        </button>
      </div>
      {isOverLimit && (
        <div className="text-danger small px-2">
          {t('message.message-too-long', { max: MAX_LENGTH })}
        </div>
      )}
    </>
  );
}

export default MessageInput;
