export interface AIMessageData {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

import { useState } from 'react';

export function useMessages() {
  const [messages, setMessages] =
    useState<AIMessageData[]>([]);

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