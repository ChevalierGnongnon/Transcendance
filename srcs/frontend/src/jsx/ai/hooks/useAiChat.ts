import { useState } from 'react';
import { useConversation } from './useConversation';
import { useRateLimit } from './useRateLimit';
import { useMessages } from './useMessages';
import {sendAiMessage,} from '../utils/api';
import {readAiResponseStream,} from '../utils/readAiResponseStream';


/**
 * Central react function which handles three different hooks 
 * @returns the usable components for Imaginary Friend 
 */
export function useAiChat() {
  const conversation = useConversation();
  const messages = useMessages(conversation.conversationId);
  const rateLimit = useRateLimit();
  const [messageText, setMessageText] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] =useState<string | null>(null);

  async function sendMessage() {
    const trimmedMessage = messageText.trim();
    if (!trimmedMessage || !conversation.conversationId || sending || rateLimit.rateLimitReached )
      return;

    // set all to default at start
    setMessageText('');
    setSending(true);
    setError(null);

    // Directly print User message for responsivness
    messages.addUserMessage(trimmedMessage);

    try {
      const { response, rateLimit: responseRateLimit, } = await sendAiMessage(conversation.conversationId,trimmedMessage);

      // No request avalibale
      if ( responseRateLimit?.remaining === 0 && responseRateLimit.resetSeconds !== null )
        rateLimit.startRateLimit(responseRateLimit.resetSeconds);

      const assistantMessageId =messages.addAssistantMessage();
      let aiResponse = '';

      // read ai Repsonse stream chunk by chunkl
      await readAiResponseStream(response, chunk => {
          aiResponse += chunk;
          //console.log("CHUNK:", chunk);
          messages.updateMessage(assistantMessageId, aiResponse);
        }
      );
    } 
    catch (error) {
      handleSendError(error);
    } finally {
      setSending(false);
    }
  }

  function handleSendError(error: unknown) {
    // console.error('Error sending AI message:',error);

    if (error instanceof Error && error.message.startsWith(
        'AI_RATE_LIMIT:')) {
      const seconds = Number(error.message.split(':')[1]);

      rateLimit.startRateLimit(seconds);

      setError('Maximum AI request limit reached.');
      return;
    }

    setError('Could not send your message.',);
    // console.log('Error sending', error);
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