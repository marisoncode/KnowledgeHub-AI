import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { User, Sparkles, Copy, Check, AlertTriangle, RefreshCw } from 'lucide-react';
import type { ChatMessage } from '../../types/chat';
import { SourcesList } from './SourcesList';

interface MessageItemProps {
  message: ChatMessage;
  onRetry?: (questionText: string, failedMsgId: string) => void;
}

export const MessageItem: React.FC<MessageItemProps> = ({ message, onRetry }) => {
  const [copied, setCopied] = useState(false);
  const isUser = message.role === 'user';

  const handleCopy = () => {
    if (!message.content) return;
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={`flex space-x-3 text-sm transition-opacity ${
        message.status === 'sending' ? 'opacity-70' : 'opacity-100'
      }`}
    >
      {/* Avatar */}
      <div
        className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5 shadow-xs ${
          isUser
            ? 'bg-[#E5E5DF] text-[#2D2E32]'
            : 'bg-blue-600 text-white'
        }`}
      >
        {isUser ? (
          <User className="w-4 h-4" />
        ) : (
          <Sparkles className="w-3.5 h-3.5 fill-current" />
        )}
      </div>

      {/* Bubble Container */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-semibold text-[#1C1D1F]">
              {isUser ? 'You' : 'KnowledgeHub AI'}
            </span>
            <span className="text-[11px] text-[#88898E]">{message.timestamp}</span>
          </div>

          {!isUser && message.content && message.status === 'success' && (
            <button
              onClick={handleCopy}
              className="text-[#88898E] hover:text-[#1C1D1F] p-1 rounded hover:bg-[#EBEBE5] transition-colors flex items-center gap-1 text-[11px]"
              title="Copy answer"
            >
              {copied ? (
                <>
                  <Check className="w-3 h-3 text-emerald-600" />
                  <span className="text-emerald-700">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" />
                  <span>Copy</span>
                </>
              )}
            </button>
          )}
        </div>

        {/* Message Box */}
        <div
          className={`p-4 rounded-lg border text-[#1C1D1F] ${
            isUser
              ? 'bg-[#F0F0EB] border-[#E2E2DB] font-medium'
              : message.status === 'error'
              ? 'bg-rose-50/70 border-rose-200 text-rose-900'
              : 'bg-white border-[#E0E0D8] shadow-xs'
          }`}
        >
          {message.status === 'sending' && !message.content ? (
            <div className="flex items-center space-x-2 text-[#77787D] py-1">
              <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
              <span className="text-xs font-medium">Reading document & reasoning...</span>
            </div>
          ) : message.status === 'error' ? (
            <div className="space-y-2">
              <div className="flex items-start space-x-2 text-rose-800 text-xs">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span>{message.errorMessage || 'An error occurred while answering.'}</span>
              </div>
              {onRetry && message.questionRef && (
                <button
                  onClick={() => onRetry(message.questionRef!, message.id)}
                  className="inline-flex items-center space-x-1.5 text-xs text-blue-700 font-semibold hover:underline"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Retry Question</span>
                </button>
              )}
            </div>
          ) : (
            <div className="prose prose-sm max-w-none text-[#1C1D1F] leading-relaxed">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {message.content}
              </ReactMarkdown>
            </div>
          )}

          {/* Citation sources panel */}
          {!isUser && message.sources && message.sources.length > 0 && (
            <SourcesList sources={message.sources} />
          )}
        </div>
      </div>
    </div>
  );
};

