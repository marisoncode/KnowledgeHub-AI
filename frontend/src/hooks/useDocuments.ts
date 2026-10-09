import { useState, useEffect, useCallback } from 'react';
import { DocumentItem } from '../types/document';
import { documentsApi } from '../services/documentsApi';

export function useDocuments() {
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [selectedDocumentId, setSelectedDocumentId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDocuments = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await documentsApi.getDocuments();
      setDocuments(data);
      
      // Auto-select first completed document if none selected
      setSelectedDocumentId((prevId) => {
        if (prevId !== null && data.some((doc) => doc.id === prevId)) {
          return prevId;
        }
        const firstValid = data.find((doc) => doc.status === 'completed') || data[0];
        return firstValid ? firstValid.id : null;
      });
    } catch (err: any) {
      setError(err.message || 'Failed to load document library');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  const selectedDocument = documents.find((doc) => doc.id === selectedDocumentId) || null;

  return {
    documents,
    selectedDocument,
    selectedDocumentId,
    setSelectedDocumentId,
    isLoading,
    error,
    refreshDocuments: fetchDocuments,
  };
}
