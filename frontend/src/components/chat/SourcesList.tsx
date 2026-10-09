import React, { useState } from 'react';
import { Layers, ChevronDown, ChevronUp } from 'lucide-react';
import type { SourceCitation } from '../../types/chat';
import { SourceCard } from './SourceCard';

interface SourcesListProps {
  sources: SourceCitation[];
}

export const SourcesList: React.FC<SourcesListProps> = ({ sources }) => {
  const [isOpen, setIsOpen] = useState(true);

  if (!sources || sources.length === 0) {
    return null;
  }

  return (
    <div className="mt-3 pt-3 border-t border-[#EAEAE3]">
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between cursor-pointer select-none text-xs font-semibold text-[#55565B] hover:text-[#1C1D1F] mb-2"
      >
        <span className="flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5 text-blue-600" />
          Retrieved Grounding Sources ({sources.length})
        </span>
        <button className="text-[#88898E] hover:text-[#1C1D1F] p-0.5">
          {isOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {isOpen && (
        <div className="space-y-2">
          {sources.map((src, idx) => (
            <SourceCard key={`${src.filename}-${src.page}-${idx}`} source={src} index={idx} />
          ))}
        </div>
      )}
    </div>
  );
};

