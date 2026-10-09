import React, { useState, useRef, useEffect } from 'react';
import { Send, CornerDownLeft } from 'lucide-react';
import { Button } from '../ui/Button';

interface QuestionComposerProps {
  onSend: (question: string) => void;
  isLoading: boolean;
  disabled: boolean;
}

export const QuestionComposer: React.FC<QuestionComposerProps> = ({
  onSend,
  isLoading,
  disabled,
}) => {
  const [question, setQuestion] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea height
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 160)}px`;
    }
  }, [question]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    const trimmed = question.trim();
    if (trimmed && !isLoading && !disabled) {
      onSend(trimmed);
      setQuestion('');
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  return (
    <div className="p-3 bg-white border border-[#E2E2DB] rounded-lg shadow-sm">
      <div className="relative flex items-end space-x-2">
        <textarea
          ref={textareaRef}
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={
            disabled
              ? 'Select an indexed document to ask questions...'
              : 'Ask anything grounded in this document... (Enter to send)'
          }
          disabled={disabled || isLoading}
          rows={1}
          className="w-full resize-none bg-transparent text-sm text-[#1C1D1F] placeholder-[#88898E] focus:outline-none p-1.5 min-h-[38px] max-h-[160px] leading-relaxed disabled:cursor-not-allowed"
        />

        <Button
          size="sm"
          onClick={handleSubmit}
          disabled={disabled || isLoading || !question.trim()}
          isLoading={isLoading}
          icon={<Send className="w-4 h-4" />}
          className="shrink-0 self-end mb-0.5"
        >
          Ask
        </Button>
      </div>

      <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#F0F0EB] text-[11px] text-[#88898E]">
        <span className="flex items-center gap-1">
          <CornerDownLeft className="w-3 h-3 text-[#A0A09A]" /> Press{' '}
          <kbd className="px-1 py-0.5 bg-[#F0F0EB] rounded font-mono text-[10px]">Enter</kbd> to ask,{' '}
          <kbd className="px-1 py-0.5 bg-[#F0F0EB] rounded font-mono text-[10px]">Shift+Enter</kbd> for newline
        </span>
        <span>{question.length} chars</span>
      </div>
    </div>
  );
};

