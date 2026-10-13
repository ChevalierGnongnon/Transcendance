import { useState } from 'react';
import { useConversation } from './useConversation';
import { useRateLimit } from './useRateLimit';
import { useMessages } from './useMessages';
import {sendAiMessage,} from '../utils/api';

import {readAiResponseStream,} from '../utils/readAiResponseStream';

export function useAiChat() {
  const conversation = useConversation();
  const messages = useMessages(conversation.conversationId);
  const rateLimit = useRateLimit();
  const [messageText, setMessageText] = useState('');

  // Wird gerade eine Nachricht gesendet?
  const [sending, setSending] = useState(false);

  // Fehler beim Chat
  const [error, setError] =useState<string | null>(null);

  async function sendMessage() {
    const trimmedMessage = messageText.trim();
    if (!trimmedMessage || !conversation.conversationId || sending || rateLimit.rateLimitReached )
      return;

    // Input-Feld leeren
    setMessageText('');
    // UI auf "sending" setzen
    setSending(true);
    // alten Fehler entfernen
    setError(null);

    	// User-Nachricht sofort anzeigen
    messages.addUserMessage(
      trimmedMessage
    );
    

    try {
    const { response,
      rateLimit: responseRateLimit,
    } = await sendAiMessage(
      conversation.conversationId,
      trimmedMessage
    );

    // Keine Requests mehr übrig
    if ( responseRateLimit?.remaining === 0 && responseRateLimit.resetSeconds !== null ) {
      rateLimit.startRateLimit(responseRateLimit.resetSeconds);
    }

    const assistantMessageId =
      messages.addAssistantMessage();

    let aiResponse = '';

    await readAiResponseStream(
      response,
      chunk => {
        aiResponse += chunk;

        messages.updateMessage(
          assistantMessageId,
          aiResponse
        );
      }
    );
  } catch (error) {
    handleSendError(error);
  } finally {
    setSending(false);
  }
}

  function handleSendError(error: unknown) {
    console.error(
      'Error sending AI message:',
      error
    );

    if (
      error instanceof Error &&
      error.message.startsWith(
        'AI_RATE_LIMIT:'
      )
    ) {
      const seconds = Number(
        error.message.split(':')[1]
      );

      rateLimit.startRateLimit(seconds);

      setError(
        'Maximum AI request limit reached.'
      );

      return;
    }

    setError(
      'Could not send your message.',
    );
    console.log('Error sending', error);
  }

  return {
    conversationId: conversation.conversationId,
    loading: conversation.loading,
    messages: messages.messages,
    messageText,
    setMessageText,
    sending,
    error,
    rateLimitReached: rateLimit.rateLimitReached,
    rateLimitSeconds:rateLimit.rateLimitSeconds,
    sendMessage,
  };
}
