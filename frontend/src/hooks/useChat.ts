import { useState, useCallback } from 'react';
import type { ChatMessage } from '../types/chat';
import { chatApi } from '../services/chatApi';

export function useChat(documentId: number | null) {
  // Store chat history per documentId in memory
  const [chatStore, setChatStore] = useState<Record<number, ChatMessage[]>>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const currentMessages = documentId ? chatStore[documentId] || [] : [];

  const sendMessage = useCallback(
    async (questionText: string) => {
      const trimmed = questionText.trim();
      if (!trimmed || !documentId) return;

      const userMsgId = `user-${Date.now()}`;
      const userMessage: ChatMessage = {
        id: userMsgId,
        role: 'user',
        content: trimmed,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: 'success',
      };

      const assistantMsgId = `assistant-${Date.now()}`;
      const placeholderAssistantMsg: ChatMessage = {
        id: assistantMsgId,
        role: 'assistant',
        content: '',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: 'sending',
        questionRef: trimmed,
      };

      // Optimistically append messages to state
      setChatStore((prev) => ({
        ...prev,
        [documentId]: [...(prev[documentId] || []), userMessage, placeholderAssistantMsg],
      }));

      setIsLoading(true);
      setError(null);

      try {
        const response = await chatApi.askQuestion(documentId, trimmed);

        // Update placeholder message with actual answer and sources
        setChatStore((prev) => {
          const docMsgs = prev[documentId] || [];
          return {
            ...prev,
            [documentId]: docMsgs.map((msg) =>
              msg.id === assistantMsgId
                ? {
                    ...msg,
                    content: response.answer,
                    sources: response.sources,
                    status: 'success',
                  }
                : msg
            ),
          };
        });
      } catch (err: any) {
        const errorText = err.message || 'Failed to generate answer. Please try again.';
        setError(errorText);

        // Mark placeholder assistant message with error state
        setChatStore((prev) => {
          const docMsgs = prev[documentId] || [];
          return {
            ...prev,
            [documentId]: docMsgs.map((msg) =>
              msg.id === assistantMsgId
                ? {
                    ...msg,
                    status: 'error',
                    errorMessage: errorText,
                    content: 'Sorry, I encountered an error while processing your request.',
                  }
                : msg
            ),
          };
        });
      } finally {
        setIsLoading(false);
      }
    },
    [documentId]
  );

  const retryQuestion = useCallback(
    (questionText: string, failedAssistantMsgId: string) => {
      if (!documentId) return;
      // Remove failed assistant message and re-send question
      setChatStore((prev) => ({
        ...prev,
        [documentId]: (prev[documentId] || []).filter((msg) => msg.id !== failedAssistantMsgId),
      }));
      sendMessage(questionText);
    },
    [documentId, sendMessage]
  );

  const clearChat = useCallback(() => {
    if (documentId) {
      setChatStore((prev) => ({
        ...prev,
        [documentId]: [],
      }));
    }
  }, [documentId]);

  return {
    messages: currentMessages,
    isLoading,
    error,
    sendMessage,
    retryQuestion,
    clearChat,
  };
}

