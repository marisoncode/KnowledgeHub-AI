import { apiClient } from './api';
import type { ChatAskResponse } from '../types/chat';

export const chatApi = {
  async askQuestion(documentId: number, question: string): Promise<ChatAskResponse> {
    const response = await apiClient.post<ChatAskResponse>('/documents/chat/ask', {
      document_id: documentId,
      question,
    });
    return response.data;
  },
};

