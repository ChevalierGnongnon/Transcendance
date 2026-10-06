import {getAiMessages} from '../utils/api';
import { useState, useEffect } from 'react';

export interface AIMessageData {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

export function useMessages(conversationId: string | null) {
  const [messages, setMessages] =
        useState<AIMessageData[]>([]);

    useEffect(() => {
        if (!conversationId) {
            setMessages([]);
            return;
        }

        async function loadMessages() {
            try {
                const loadedMessages = await getAiMessages(conversationId);
                setMessages(loadedMessages);
            } catch (error) {
                console.error('Error loading AI messages:',error);
            }
        }
        loadMessages();
    }, [conversationId]);

  function addUserMessage(content: string) {
    setMessages(previous => [
      ...previous,
      {
        id: crypto.randomUUID(),
        role: 'user',
        content,
      },
    ]);
  }

  function addAssistantMessage() {
    const id = crypto.randomUUID();

    setMessages(previous => [
      ...previous,
      {
        id,
        role: 'assistant',
        content: '',
      },
    ]);

    return id;
  }

  function updateMessage(
    id: string,
    content: string
  ) {
    setMessages(previous =>
      previous.map(message =>
        message.id === id
          ? {
              ...message,
              content,
            }
          : message
      )
    );
  }

  return {
    messages,
    addUserMessage,
    addAssistantMessage,
    updateMessage,
  };
}