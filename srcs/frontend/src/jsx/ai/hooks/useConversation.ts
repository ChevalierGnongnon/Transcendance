import { useEffect, useState } from 'react';
import { createAiConversation } from '../utils/api';

export function useConversation() {
  const [conversationId, setConversationId] =
    useState<string | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  useEffect(() => {
    async function createConversation() {
      try {
        setLoading(true);
        setError(null);

        const id =
          await createAiConversation();

        sessionStorage.setItem(
          'aiConversationId',
          id
        );

        setConversationId(id);
      } catch (error) {
        console.error(
          'Error creating AI conversation:',
          error
        );

        setError(
          'Could not start the conversation.'
        );
      } finally {
        setLoading(false);
      }
    }

    createConversation();
  }, []);

  return {
    conversationId,
    loading,
    error,
  };
}