import { useEffect, useState } from 'react';

/**
 * Reads the conversation ID from session storage.
 */
export function useConversation() {
    const [conversationId, setConversationId] =useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedConversationId =localStorage.getItem('aiConversationId');

        setConversationId(storedConversationId);
        setLoading(false);
    }, []);

    return {
        conversationId,
        loading,
    };
}