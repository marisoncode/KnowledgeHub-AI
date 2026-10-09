import React from 'react';
import { FileText, CheckCircle2 } from 'lucide-react';
import type { SourceCitation } from '../../types/chat';

interface SourceCardProps {
  source: SourceCitation;
  index: number;
}

export const SourceCard: React.FC<SourceCardProps> = ({ source, index }) => {
  const formattedScore = (source.score * 100).toFixed(0);

  return (
    <div className="border border-[#E2E2DB] bg-white rounded-md p-2.5 transition-all duration-150 hover:border-blue-300 shadow-2xs text-xs">
      <div className="flex items-center justify-between gap-2">
        {/* Left: Source Index & Document Filename */}
        <div className="flex items-center space-x-2 min-w-0">
          <span className="w-5 h-5 rounded bg-[#F0F0EB] text-[#55565B] text-[10px] font-bold flex items-center justify-center shrink-0">
            #{index + 1}
          </span>
          <FileText className="w-4 h-4 text-blue-600 shrink-0" />
          <span className="font-semibold text-[#1C1D1F] truncate max-w-[200px] sm:max-w-xs">
            {source.filename}
          </span>
        </div>

        {/* Right: Page Badge & Confidence Match Badge */}
        <div className="flex items-center space-x-2 shrink-0">
          <span className="inline-flex items-center px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-semibold text-[11px] border border-blue-200/60">
            Page {source.page}
          </span>

          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-medium text-[11px] border border-emerald-200/60">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            {formattedScore}% Match
          </span>
        </div>
      </div>
    </div>
  );
};
