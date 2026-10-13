import { useEffect, useState } from 'react';

export function useConversation() {
    const [conversationId, setConversationId] =
        useState<string | null>(null);

    const [loading, setLoading] =
        useState(true);

    useEffect(() => {
        const storedConversationId =
            sessionStorage.getItem('aiConversationId');

        setConversationId(storedConversationId);
        setLoading(false);
    }, []);

    return {
        conversationId,
        loading,
    };
}