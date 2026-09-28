import { useAiChat } from './hooks/useAiChat';
import { useTranslation } from 'react-i18next';
import '../../scss/common-classes.scss';
import '../../scss/messages.scss';
import { AiMessage } from './AiMessage';

// Was sieht der benutzer? 

const MAX_MESSAGE_LENGTH = 200;

function ImaginaryFriend() {
  const { t } = useTranslation();

  const {
    messages,
    messageText,
    setMessageText,
    loading,
    sending,
    error,
    rateLimitReached,
    rateLimitSeconds,
    sendMessage,
  } = useAiChat();

  function handleKeyDown(
    event: React.KeyboardEvent<HTMLTextAreaElement>
  ) {
    if (
      event.key === 'Enter' &&
      !event.shiftKey
    ) {
      event.preventDefault();
      sendMessage();
    }
  }

  if (loading) {
    return (
      <div>
        Starting your imaginary friend...
      </div>
    );
  }

  return (
    <div className="chat-list chat-list-right my-2">

      <div className="chat-header">
        <h2>Imaginary Friend</h2>
      </div>

      <ul className="px-3">
        {messages.map((message, index) => (
          <AiMessage
            key={index}
            content={message.content}
            isUser={message.role === 'user'}
          />
        ))}
      </ul>

      {error && (
        <div className="text-danger px-3">
          {error}
        </div>
      )}

      {rateLimitReached && (
        <div className="text-danger px-3">
          You can send another message in{' '}
          {rateLimitSeconds} seconds.
        </div>
      )}

      <div className="input-group group-new-message my-3">
        <textarea
          className="form-control message-area"
          value={messageText}
          onChange={event =>
            setMessageText(event.target.value)
          }
          onKeyDown={handleKeyDown}
          placeholder="Write a message..."
          disabled={sending}
          maxLength={MAX_MESSAGE_LENGTH}
        />

        <button
          type="button"
          className="btn send-message"
          onClick={sendMessage}
          disabled={
            sending ||
            !messageText.trim() ||
            rateLimitReached
          }
        >
          Send
        </button>
      </div>

      <div className="text-white text-end px-3">
        <span className="border rounded px-2 py-1">
          {messageText.length} /{' '}
          {MAX_MESSAGE_LENGTH}
        </span>
      </div>

    </div>
  );
}

export default ImaginaryFriend;