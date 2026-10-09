import React, { useState } from 'react';
import { CheckCircle2, X } from 'lucide-react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { ChatContainer } from '../chat/ChatContainer';
import { UploadModal } from '../documents/UploadModal';
import { useDocuments } from '../../hooks/useDocuments';
import { useChat } from '../../hooks/useChat';

export const WorkspaceLayout: React.FC = () => {
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const {
    documents,
    selectedDocument,
    selectedDocumentId,
    setSelectedDocumentId,
    isLoading: isDocsLoading,
    error: docsError,
    refreshDocuments,
    deleteDocument,
  } = useDocuments();

  const {
    messages,
    isLoading: isChatLoading,
    error: chatError,
    sendMessage,
    retryQuestion,
    clearChat,
  } = useChat(selectedDocumentId);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const handleDeleteDocument = async (id: number, filename: string) => {
    await deleteDocument(id);
    showToast(`Document "${filename}" deleted successfully.`);
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[#F8F8F5] relative">
      {/* Toast Notification Alert */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 flex items-center space-x-2.5 px-4 py-3 bg-[#1C1D1F] text-white rounded-lg shadow-xl text-xs animate-in fade-in slide-in-from-top-2 duration-200 border border-slate-700">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="font-medium">{toastMessage}</span>
          <button
            onClick={() => setToastMessage(null)}
            className="text-slate-400 hover:text-white ml-2 p-0.5"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Top Header */}
      <Header
        onOpenUpload={() => setIsUploadOpen(true)}
        documentCount={documents.length}
        onToggleSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar */}
        <Sidebar
          documents={documents}
          selectedDocumentId={selectedDocumentId}
          onSelectDocument={setSelectedDocumentId}
          onDeleteDocument={handleDeleteDocument}
          onOpenUpload={() => setIsUploadOpen(true)}
          onRefresh={refreshDocuments}
          isLoading={isDocsLoading}
          isOpenMobile={isMobileSidebarOpen}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
        />

        {/* Right Main Chat / Document Reasoning Workspace */}
        <main className="flex-1 h-full overflow-hidden">
          <ChatContainer
            document={selectedDocument}
            messages={messages}
            isLoading={isChatLoading}
            error={chatError || docsError}
            onSendMessage={sendMessage}
            onRetryQuestion={retryQuestion}
            onClearChat={clearChat}
            onOpenUpload={() => setIsUploadOpen(true)}
          />
        </main>
      </div>

      {/* PDF Upload Modal */}
      <UploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onUploadSuccess={(newDoc) => {
          refreshDocuments();
          setSelectedDocumentId(newDoc.id);
          showToast(`Document "${newDoc.filename}" uploaded and indexed.`);
        }}
      />
    </div>
  );
};
