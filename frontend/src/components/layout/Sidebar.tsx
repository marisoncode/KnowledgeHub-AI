import React, { useState } from 'react';
import { FileText, Search, RefreshCw, Plus, Trash2 } from 'lucide-react';
import type { DocumentItem } from '../../types/document';
import { Badge } from '../ui/Badge';

interface SidebarProps {
  documents: DocumentItem[];
  selectedDocumentId: number | null;
  onSelectDocument: (id: number) => void;
  onDeleteDocument: (id: number, filename: string) => void;
  onOpenUpload: () => void;
  onRefresh: () => void;
  isLoading: boolean;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  documents,
  selectedDocumentId,
  onSelectDocument,
  onDeleteDocument,
  onOpenUpload,
  onRefresh,
  isLoading,
  isOpenMobile = false,
  onCloseMobile,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredDocuments = documents.filter((doc) =>
    doc.filename.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = (e: React.MouseEvent, id: number, filename: string) => {
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to delete "${filename}"? This will remove the file, database record, and Qdrant vectors.`)) {
      onDeleteDocument(id, filename);
    }
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-30 md:hidden"
        />
      )}

      <aside
        className={`w-72 bg-[#FAFAF7] border-r border-[#E2E2DB] flex flex-col h-full z-40 transition-transform duration-200 ease-in-out md:translate-x-0 ${
          isOpenMobile ? 'fixed inset-y-0 left-0 shadow-2xl translate-x-0' : 'hidden md:flex'
        }`}
      >
        {/* Sidebar Header */}
        <div className="p-4 border-b border-[#E5E5DF] space-y-3 bg-white">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold text-[#1C1D1F] uppercase tracking-wider flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-blue-600" /> Document Library
            </h2>
            <button
              onClick={onRefresh}
              disabled={isLoading}
              className="text-[#77787D] hover:text-[#1C1D1F] p-1 rounded hover:bg-[#F0F0EB] transition-colors disabled:opacity-50"
              title="Refresh library"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>

          {/* Search box */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-[#88898E] absolute left-2.5 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search documents..."
              className="w-full pl-8 pr-3 py-1.5 bg-[#F5F5F0] border border-[#E2E2DB] rounded-md text-xs text-[#1C1D1F] placeholder-[#88898E] focus:outline-none focus:border-blue-500 focus:bg-white"
            />
          </div>
        </div>

        {/* List of Documents */}
        <div className="flex-1 overflow-y-auto p-3 space-y-1.5">
          {isLoading && documents.length === 0 ? (
            <div className="p-6 text-center text-xs text-[#88898E] space-y-2">
              <RefreshCw className="w-4 h-4 animate-spin mx-auto text-blue-600" />
              <p>Loading documents...</p>
            </div>
          ) : filteredDocuments.length === 0 ? (
            <div className="p-6 text-center text-xs text-[#88898E] space-y-3">
              <p>{searchQuery ? 'No documents match search.' : 'No documents uploaded yet.'}</p>
              <button
                onClick={onOpenUpload}
                className="inline-flex items-center gap-1 text-xs text-blue-600 font-semibold hover:underline"
              >
                <Plus className="w-3.5 h-3.5" /> Upload your first PDF
              </button>
            </div>
          ) : (
            filteredDocuments.map((doc) => {
              const isSelected = doc.id === selectedDocumentId;
              return (
                <div
                  key={doc.id}
                  onClick={() => {
                    onSelectDocument(doc.id);
                    if (onCloseMobile) onCloseMobile();
                  }}
                  className={`group cursor-pointer p-3 rounded-lg border transition-all duration-150 select-none ${
                    isSelected
                      ? 'bg-white border-blue-500 shadow-xs ring-1 ring-blue-500/20'
                      : 'bg-[#FAFAF7] border-[#E5E5DF] hover:bg-white hover:border-[#D8D8D0]'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center space-x-2 min-w-0">
                      <FileText
                        className={`w-4 h-4 shrink-0 ${
                          isSelected ? 'text-blue-600' : 'text-[#77787D] group-hover:text-[#1C1D1F]'
                        }`}
                      />
                      <p
                        className={`text-xs font-semibold truncate ${
                          isSelected ? 'text-blue-900' : 'text-[#1C1D1F]'
                        }`}
                      >
                        {doc.filename}
                      </p>
                    </div>

                    {/* Delete Icon Button */}
                    <button
                      onClick={(e) => handleDelete(e, doc.id, doc.filename)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity p-1 text-[#88898E] hover:text-rose-600 rounded hover:bg-rose-50"
                      title="Delete document"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#F0F0EB] text-[11px] text-[#77787D]">
                    <span className="font-mono text-[10px]">ID: #{doc.id}</span>
                    <Badge status={doc.status} />
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Sidebar Footer Action */}
        <div className="p-3 border-t border-[#E5E5DF] bg-white">
          <button
            onClick={onOpenUpload}
            className="w-full flex items-center justify-center space-x-2 p-2 bg-[#F0F0EB] hover:bg-[#E5E5DF] border border-[#E0E0D8] rounded-md text-xs font-semibold text-[#1C1D1F] transition-colors"
          >
            <Plus className="w-4 h-4 text-blue-600" />
            <span>Add PDF Document</span>
          </button>
        </div>
      </aside>
    </>
  );
};
