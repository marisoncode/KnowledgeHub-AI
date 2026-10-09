import { BookOpen, Layers, Menu } from 'lucide-react';
import { Button } from '../ui/Button';

interface HeaderProps {
  onOpenUpload: () => void;
  documentCount: number;
  onToggleSidebar?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenUpload,
  documentCount,
  onToggleSidebar,
}) => {
  return (
    <header className="h-14 bg-white border-b border-[#E2E2DB] px-4 sm:px-6 flex items-center justify-between z-20 shrink-0">
      {/* Product Identity */}
      <div className="flex items-center space-x-3">
        {onToggleSidebar && (
          <button
            onClick={onToggleSidebar}
            className="md:hidden text-[#66676B] hover:text-[#1C1D1F] p-1.5 rounded-md hover:bg-[#F0F0EB]"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}

        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-md bg-[#1C1D1F] text-white flex items-center justify-center font-bold text-sm shadow-xs tracking-tight">
            KH
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-sm font-bold text-[#1C1D1F] tracking-tight">
                KnowledgeHub AI
              </h1>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-[#F0F0EB] text-[#55565B] border border-[#E0E0D8] uppercase tracking-wider">
                RAG v1.0
              </span>
            </div>
            <p className="text-[11px] text-[#77787D] hidden sm:block">
              Document Intelligence & Vector Retrieval System
            </p>
          </div>
        </div>
      </div>

      {/* Action / Controls */}
      <div className="flex items-center space-x-3">
        <div className="hidden lg:flex items-center space-x-2 text-xs text-[#66676B] px-3 py-1 bg-[#F8F8F5] border border-[#E2E2DB] rounded-md">
          <Layers className="w-3.5 h-3.5 text-blue-600" />
          <span>{documentCount} Indexed Document{documentCount !== 1 ? 's' : ''}</span>
        </div>

        <Button
          size="sm"
          onClick={onOpenUpload}
          icon={<BookOpen className="w-4 h-4" />}
          className="shadow-xs"
        >
          Upload PDF
        </Button>
      </div>
    </header>
  );
};

