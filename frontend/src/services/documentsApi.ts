import { apiClient } from './api';
import type { DocumentItem, UploadProgress } from '../types/document';

export const documentsApi = {
  async getDocuments(): Promise<DocumentItem[]> {
    const response = await apiClient.get<DocumentItem[]>('/documents');
    return response.data;
  },

  async uploadDocument(
    file: File,
    onProgress?: (progress: UploadProgress) => void
  ): Promise<DocumentItem> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await apiClient.post<DocumentItem>('/documents/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total && onProgress) {
          onProgress({
            loaded: progressEvent.loaded,
            total: progressEvent.total,
            percentage: Math.round((progressEvent.loaded * 100) / progressEvent.total),
          });
        }
      },
    });

    return response.data;
  },

  async deleteDocument(id: number): Promise<{ message: string }> {
    const response = await apiClient.delete<{ message: string }>(`/documents/${id}`);
    return response.data;
  },
};
