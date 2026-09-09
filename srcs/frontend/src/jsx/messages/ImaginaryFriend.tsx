import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import '../../scss/common-classes.scss';
import '../../scss/messages.scss';

import {
  createAiConversation,
  sendAiMessage,
} from './utils/api';

import { AiMessage } from './AiMessage';

interface AIMessageData {
  role: 'user' | 'assistant';
  content: string;
}

function ImaginaryFriend() {
  const { t } = useTranslation();

  const [conversationId, setConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<AIMessageData[]>([]);
  const [messageText, setMessageText] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadConversation() {
      try {
        setLoading(true);
        setError(null);

        const id = await createAiConversation();

        setConversationId(id);
      } catch (error) {
        console.error('Error creating AI conversation:', error);
        setError('Could not start the conversation.');
      } finally {
        setLoading(false);
      }
    }

    loadConversation();
  }, []);

	// function to read the streamed aiResponse
	async function readAiResponseStream(response: Response, onChunk: (text: string) => void) {
		if (!response.body) 
			throw new Error('Streaming is not supported by this response.');

		const reader = response.body.getReader();
		const decoder = new TextDecoder();

		while (true) {
			const { done, value } = await reader.read();
			console.log('FRONTEND CHUNK:', value);
			if (done) {
			decoder.decode();
			break;
			}

			const chunk = decoder.decode(value, { stream: true });
			console.log('FRONTEND TEXT:', chunk);


			if (chunk)
				onChunk(chunk);
			}
	}

  async function handleSendMessage() {
  const trimmedMessage = messageText.trim();

  if (!trimmedMessage || !conversationId || sending) {
    return;
  }

  setMessageText('');
  setSending(true);
  setError(null);

  // Show user's message immediately
  setMessages((previous) => [
    ...previous,
    {
      role: 'user',
      content: trimmedMessage,
    },
  ]);

  try {
    // Send message to backend
    const response = await sendAiMessage(
      conversationId,
      trimmedMessage
    );

    // Create an empty AI message
    setMessages((previous) => [
      ...previous,
      {
        role: 'assistant',
        content: '',
      },
    ]);

    // Read the AI response chunk by chunk
    let aiResponse = '';

    await readAiResponseStream(response, (chunk) => {
      aiResponse += chunk;

      setMessages((previous) => {
        const updated = [...previous];

        const lastMessage = updated[updated.length - 1];

        if (lastMessage?.role === 'assistant') {
          updated[updated.length - 1] = {
            ...lastMessage,
            content: aiResponse,
          };
        }

        return updated;
      });
    });
  } catch (error) {
    console.error('Error sending AI message:', error);
    setError('Could not send your message.');
  } finally {
    setSending(false);
  }
	}

  function handleKeyDown(
    event: React.KeyboardEvent<HTMLTextAreaElement>
  ) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  }

  if (loading) {
    return <div>Starting your imaginary friend...</div>;
  }

  if (error && !conversationId) {
    return <div>{error}</div>;
  }

  if (!conversationId) {
    return <div>Could not create a conversation.</div>;
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

      <div className="input-group group-new-message my-3">
        <textarea
          className="form-control message-area"
          value={messageText}
          onChange={(event) => setMessageText(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Write a message..."
          disabled={sending}
        />

        <button
          type="button"
          className="btn send-message"
          onClick={handleSendMessage}
          disabled={sending || !messageText.trim()}
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default ImaginaryFriend;