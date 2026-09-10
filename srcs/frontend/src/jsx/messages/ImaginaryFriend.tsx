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

const MAX_MESSAGE_LENGTH = 200;

function ImaginaryFriend() {
  const { t } = useTranslation();

  const [conversationId, setConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<AIMessageData[]>([]);
  const [messageText, setMessageText] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [rateLimitReached, setRateLimitReached] = useState(false);
  const [rateLimitSeconds, setRateLimitSeconds] = useState(0);
  const [error, setError] = useState<string | null>(null);

  // loadConversation
useEffect(() => {
  async function loadConversation() {
    try {
      setLoading(true);
      setError(null);

      const storedConversationId = sessionStorage.getItem(
        'aiConversationId'
      );

      if (storedConversationId) {
        setConversationId(storedConversationId);
        console.log("found ID");
        return;
      }
      console.log("Starting new conversation");

      const id = await createAiConversation();

      sessionStorage.setItem('aiConversationId', id);
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

  // Countdown 
  useEffect(() => {
    if (!rateLimitReached || rateLimitSeconds <= 0)
        return;
    
    const timer = setInterval(() => {
      setRateLimitSeconds((previous) => previous -1);}, 1000);
      return () => clearInterval(timer)
  }, [rateLimitReached, rateLimitSeconds]);

  // free the rateLimit
  useEffect(() => {
    if (rateLimitReached && rateLimitSeconds <= 0){
      setRateLimitReached(false);
      setError(null);
    }
  }, [rateLimitReached, rateLimitSeconds]);

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

      if (chunk.includes('[AI_PROVIDER_RATE_LIMIT]')) {
        console.warn('AI PROVIDER RATE LIMIT');
        throw new Error('AI_PROVIDER_RATE_LIMIT');
      }

      if (chunk.includes('[AI_SERVICE_ERROR]')) {
        console.warn('AI PROVIDER ERROR');
        throw new Error('AI_PROVIDER_ERROR');
      }


			if (chunk)
				onChunk(chunk);
			}
	}

  async function handleSendMessage() {
  const trimmedMessage = messageText.trim();

  if (!trimmedMessage || !conversationId || sending || rateLimitReached) {
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

    if (
      error instanceof Error &&
      error.message.startsWith('AI_RATE_LIMIT:')
    ) {
      const seconds = Number(error.message.split(':')[1]);

      setRateLimitReached(true);
      setRateLimitSeconds(seconds);
      setError('Maximum AI request limit reached.');
    } else {
      setError('Could not send your message.');
    }
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

      {rateLimitReached && (
        <div className="text-danger px-3">
          You can send another message in {rateLimitSeconds} seconds.
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
          maxLength={MAX_MESSAGE_LENGTH}
        />
    
        <button
          type="button"
          className="btn send-message"
          onClick={handleSendMessage}
          disabled={sending || !messageText.trim() || rateLimitReached}
        >
          Send
        </button>
      </div>
       <div className="text-white text-end px-3">
        <span className="border rounded px-2 py-1">
         {messageText.length} / {MAX_MESSAGE_LENGTH}
       </span>
        </div>
    </div>
  );
}

export default ImaginaryFriend;