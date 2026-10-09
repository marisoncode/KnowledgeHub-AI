import { useState, useCallback } from 'react';
import type { DocumentItem, UploadProgress } from '../types/document';
import { documentsApi } from '../services/documentsApi';

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50 MB

export function useDocumentUpload(onSuccess?: (newDoc: DocumentItem) => void) {
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [progress, setProgress] = useState<UploadProgress | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [uploadedDoc, setUploadedDoc] = useState<DocumentItem | null>(null);

  const validateFile = (file: File): string | null => {
    if (!file.name.toLowerCase().endsWith('.pdf')) {
      return 'Invalid file type. Only PDF documents are supported.';
    }
    if (file.size > MAX_FILE_SIZE) {
      return `File size exceeds limit (${(MAX_FILE_SIZE / (1024 * 1024)).toFixed(0)}MB maximum).`;
    }
    return null;
  };

  const uploadFile = useCallback(
    async (file: File) => {
      const validationError = validateFile(file);
      if (validationError) {
        setError(validationError);
        return;
      }

      setIsUploading(true);
      setError(null);
      setProgress({ loaded: 0, total: file.size, percentage: 0 });
      setUploadedDoc(null);

      try {
        const result = await documentsApi.uploadDocument(file, (prog) => {
          setProgress(prog);
        });

        setUploadedDoc(result);
        if (onSuccess) {
          onSuccess(result);
        }
      } catch (err: any) {
        setError(err.message || 'Failed to upload document');
      } finally {
        setIsUploading(false);
      }
    },
    [onSuccess]
  );

  const reset = useCallback(() => {
    setIsUploading(false);
    setProgress(null);
    setError(null);
    setUploadedDoc(null);
  }, []);

  return {
    isUploading,
    progress,
    error,
    uploadedDoc,
    uploadFile,
    reset,
    validateFile,
  };
}

