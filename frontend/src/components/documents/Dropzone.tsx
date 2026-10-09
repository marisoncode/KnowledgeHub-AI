import React, { useState, useRef } from 'react';
import { UploadCloud, FileText, AlertCircle, CheckCircle2 } from 'lucide-react';
import type { UploadProgress } from '../../types/document';
import { Button } from '../ui/Button';

interface DropzoneProps {
  onFileSelected: (file: File) => void;
  isUploading: boolean;
  progress: UploadProgress | null;
  error: string | null;
  validateFile: (file: File) => string | null;
}

export const Dropzone: React.FC<DropzoneProps> = ({
  onFileSelected,
  isUploading,
  progress,
  error,
  validateFile,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const processFile = (file: File) => {
    const err = validateFile(file);
    if (err) {
      setValidationError(err);
      setSelectedFile(null);
    } else {
      setValidationError(null);
      setSelectedFile(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      processFile(file);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      processFile(file);
    }
  };

  const handleStartUpload = () => {
    if (selectedFile && !isUploading) {
      onFileSelected(selectedFile);
    }
  };

  return (
    <div className="w-full space-y-4">
      {/* Drag & Drop Area */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !isUploading && fileInputRef.current?.click()}
        className={`relative cursor-pointer transition-all duration-200 border-2 border-dashed rounded-lg p-8 text-center bg-white ${
          isDragOver
            ? 'border-blue-500 bg-blue-50/50 scale-[1.005]'
            : 'border-[#E0E0D8] hover:border-blue-400 hover:bg-[#FAF9F5]'
        } ${isUploading ? 'pointer-events-none opacity-80' : ''}`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf"
          className="hidden"
          onChange={handleInputChange}
          disabled={isUploading}
        />

        <div className="flex flex-col items-center justify-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-[#F2F2EC] flex items-center justify-center text-[#2563EB]">
            <UploadCloud className="w-6 h-6 stroke-[1.75]" />
          </div>
          <div>
            <p className="text-sm font-semibold text-[#1C1D1F]">
              Click to upload <span className="font-normal text-[#66676B]">or drag and drop</span>
            </p>
            <p className="text-xs text-[#88898E] mt-1">
              PDF documents up to 50MB (Extracts text, chunks & builds Qdrant embeddings)
            </p>
          </div>
        </div>
      </div>

      {/* Selected File Details */}
      {selectedFile && !isUploading && (
        <div className="flex items-center justify-between p-3.5 bg-white border border-[#E5E5DF] rounded-md shadow-xs">
          <div className="flex items-center space-x-3 truncate">
            <FileText className="w-5 h-5 text-blue-600 shrink-0" />
            <div className="truncate">
              <p className="text-xs font-semibold text-[#1C1D1F] truncate">
                {selectedFile.name}
              </p>
              <p className="text-[11px] text-[#77787D]">
                {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
              </p>
            </div>
          </div>
          <Button
            size="sm"
            onClick={handleStartUpload}
            isLoading={isUploading}
            icon={<CheckCircle2 className="w-4 h-4" />}
          >
            Process & Upload
          </Button>
        </div>
      )}

      {/* Upload Progress Bar */}
      {isUploading && (
        <div className="p-4 bg-white border border-[#E5E5DF] rounded-md space-y-2">
          <div className="flex items-center justify-between text-xs text-[#1C1D1F]">
            <span className="font-medium flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-600 animate-ping" />
              Ingesting & Vectorizing Document...
            </span>
            <span className="font-mono text-[#66676B]">{progress?.percentage || 0}%</span>
          </div>
          <div className="w-full bg-[#EBEBE5] rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-blue-600 h-full transition-all duration-300 rounded-full"
              style={{ width: `${progress?.percentage || 10}%` }}
            />
          </div>
          <p className="text-[11px] text-[#88898E]">
            Extracting pages, generating embeddings via Gemini & indexing into Qdrant...
          </p>
        </div>
      )}

      {/* Error feedback */}
      {(validationError || error) && (
        <div className="flex items-start space-x-2.5 p-3 rounded-md bg-rose-50 border border-rose-200 text-rose-800 text-xs">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <p className="font-medium">Upload Error</p>
            <p className="opacity-90">{validationError || error}</p>
          </div>
        </div>
      )}
    </div>
  );
};

