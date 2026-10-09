import React from 'react';
import { X, FileCode2 } from 'lucide-react';
import { Dropzone } from './Dropzone';
import { useDocumentUpload } from '../../hooks/useDocumentUpload';
import type { DocumentItem } from '../../types/document';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUploadSuccess: (newDoc: DocumentItem) => void;
}

export const UploadModal: React.FC<UploadModalProps> = ({
  isOpen,
  onClose,
  onUploadSuccess,
}) => {
  const { isUploading, progress, error, uploadFile, reset, validateFile } =
    useDocumentUpload((newDoc) => {
      onUploadSuccess(newDoc);
      setTimeout(() => {
        reset();
        onClose();
      }, 800);
    });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs transition-opacity animate-in fade-in duration-200">
      <div
        className="bg-[#FAFAF7] border border-[#E2E2DB] rounded-lg shadow-xl max-w-lg w-full overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E5E5DF] bg-white">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded bg-blue-50 flex items-center justify-center text-blue-600">
              <FileCode2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-[#1C1D1F]">
                Upload PDF Document
              </h3>
              <p className="text-xs text-[#77787D]">
                Index a document into KnowledgeHub AI RAG Memory
              </p>
            </div>
          </div>
          <button
            onClick={() => !isUploading && onClose()}
            disabled={isUploading}
            className="text-[#88898E] hover:text-[#1C1D1F] p-1.5 rounded-md hover:bg-[#F0F0EB] transition-colors disabled:opacity-40"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 bg-[#FAFAF7]">
          <Dropzone
            onFileSelected={uploadFile}
            isUploading={isUploading}
            progress={progress}
            error={error}
            validateFile={validateFile}
          />
        </div>
      </div>
    </div>
  );
};

