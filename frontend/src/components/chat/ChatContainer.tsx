import React, { useRef, useEffect } from 'react';
import { MessageSquare, Sparkles, AlertCircle, Trash2 } from 'lucide-react';
import type { ChatMessage } from '../../types/chat';
import type { DocumentItem } from '../../types/document';
import { MessageItem } from './MessageItem';
import { QuestionComposer } from './QuestionComposer';

interface ChatContainerProps {
  document: DocumentItem | null;
  messages: ChatMessage[];
  isLoading: boolean;
  error: string | null;
  onSendMessage: (question: string) => void;
  onRetryQuestion: (questionText: string, failedMsgId: string) => void;
  onClearChat: () => void;
  onOpenUpload: () => void;
}

export const ChatContainer: React.FC<ChatContainerProps> = ({
  document,
  messages,
  isLoading,
  error,
  onSendMessage,
  onRetryQuestion,
  onClearChat,
  onOpenUpload,
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  if (!document) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 text-center bg-[#F8F8F5]">
        <div className="max-w-md space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-white border border-[#E0E0D8] shadow-xs flex items-center justify-center text-blue-600 mx-auto">
            <Sparkles className="w-8 h-8 stroke-[1.5]" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-[#1C1D1F]">
              Select a Document to Start Reasoning
            </h2>
            <p className="text-sm text-[#66676B] mt-1.5 leading-relaxed">
              Upload a PDF document or choose an existing document from your library to ask grounded questions.
            </p>
          </div>
          <button
            onClick={onOpenUpload}
            className="inline-flex items-center px-4 py-2 bg-[#2563EB] text-white text-sm font-semibold rounded-md hover:bg-[#1D4ED8] shadow-xs transition-colors"
          >
            Upload PDF Document
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-[#F8F8F5]">
      {/* Top Bar / Document Header */}
      <div className="px-6 py-3.5 bg-white border-b border-[#E2E2DB] flex items-center justify-between shadow-2xs">
        <div className="flex items-center space-x-3 truncate">
          <div className="w-7 h-7 rounded bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <MessageSquare className="w-4 h-4" />
          </div>
          <div className="truncate">
            <h3 className="text-sm font-semibold text-[#1C1D1F] truncate">
              {document.filename}
            </h3>
            <p className="text-[11px] text-[#77787D] flex items-center gap-2">
              <span>ID: #{document.id}</span>
              <span>•</span>
              <span className="capitalize">{document.status}</span>
            </p>
          </div>
        </div>

        {messages.length > 0 && (
          <button
            onClick={onClearChat}
            className="text-xs text-[#88898E] hover:text-rose-600 p-1.5 rounded hover:bg-rose-50 transition-colors flex items-center gap-1"
            title="Clear current conversation"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Clear Chat</span>
          </button>
        )}
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.length === 0 ? (
          <div className="max-w-lg mx-auto py-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-white border border-[#E0E0D8] shadow-2xs flex items-center justify-center text-blue-600 mx-auto">
              <MessageSquare className="w-6 h-6 stroke-[1.75]" />
            </div>
            <div>
              <h4 className="text-base font-semibold text-[#1C1D1F]">
                Grounded Q&A with {document.filename}
              </h4>
              <p className="text-xs text-[#66676B] mt-1">
                Ask any question below. KnowledgeHub AI will retrieve grounded vector citations from Qdrant and answer via Gemini.
              </p>
            </div>
          </div>
        ) : (
          messages.map((msg) => (
            <MessageItem key={msg.id} message={msg} onRetry={onRetryQuestion} />
          ))
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Error alert */}
      {error && (
        <div className="mx-6 mb-2 p-3 bg-rose-50 border border-rose-200 rounded-md text-xs text-rose-800 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Bottom Composer */}
      <div className="p-4 bg-white border-t border-[#E2E2DB]">
        <QuestionComposer
          onSend={onSendMessage}
          isLoading={isLoading}
          disabled={document.status !== 'completed'}
        />
      </div>
    </div>
  );
};
