import React, { useState } from 'react';
import { FileText, ChevronDown, ChevronUp, Bookmark } from 'lucide-react';
import type { SourceCitation } from '../../types/chat';

interface SourceCardProps {
  source: SourceCitation;
  index: number;
}

export const SourceCard: React.FC<SourceCardProps> = ({ source, index }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const formattedScore = (source.score * 100).toFixed(1);

  return (
    <div className="border border-[#E2E2DB] bg-[#FAFAF6] rounded-md transition-all duration-150 hover:border-[#D0D0C8] hover:bg-white text-xs">
      {/* Header bar */}
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-between p-2.5 cursor-pointer select-none"
      >
        <div className="flex items-center space-x-2 truncate">
          <span className="w-5 h-5 rounded bg-[#EAEAE3] text-[#444549] text-[10px] font-semibold flex items-center justify-center shrink-0">
            #{index + 1}
          </span>
          <FileText className="w-3.5 h-3.5 text-blue-600 shrink-0" />
          <span className="font-medium text-[#1C1D1F] truncate max-w-[180px] sm:max-w-xs">
            {source.filename}
          </span>
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 font-medium text-[10px]">
            Page {source.page}
          </span>
          {isExpanded ? (
            <ChevronUp className="w-3.5 h-3.5 text-[#88898E]" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5 text-[#88898E]" />
          )}
        </div>
      </div>

      {/* Expanded details */}
      {isExpanded && (
        <div className="px-3 pb-3 pt-1 border-t border-[#EDEDE6] bg-white rounded-b-md space-y-1.5 text-[11px] text-[#55565B]">
          <div className="flex items-center justify-between text-[#77787D]">
            <span className="flex items-center gap-1">
              <Bookmark className="w-3 h-3 text-amber-600" /> Vector Match Metadata
            </span>
            <span className="font-mono text-emerald-700 font-medium">
              Similarity: {formattedScore}%
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 p-2 bg-[#F8F8F5] rounded border border-[#EBEBE5] text-[11px]">
            <div>
              <span className="text-[#88898E]">PDF Page:</span>{' '}
              <span className="font-semibold text-[#1C1D1F]">{source.page}</span>
            </div>
            {source.chunk !== undefined && (
              <div>
                <span className="text-[#88898E]">Chunk Index:</span>{' '}
                <span className="font-semibold text-[#1C1D1F]">{source.chunk}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

