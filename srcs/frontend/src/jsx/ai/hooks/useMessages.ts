import {getAiMessages} from '../utils/api';
import { useState, useEffect } from 'react';

export interface AIMessageData {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

/**
 * Loads and manages the displayed messages 
 * @param conversationId 
 * @returns 
 */
export function useMessages(conversationId: string | null) {
  const [messages, setMessages] = useState<AIMessageData[]>([]);

    // If conversation Id changes rerun
    useEffect(() => {
        if (!conversationId) {
            setMessages([]);
            return;
        }

        // await the messages stored in the database by a given conversationID
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

  // Add user Message for the react state
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

  // add the assistant message for the react state
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

  // update stored messages by message id
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