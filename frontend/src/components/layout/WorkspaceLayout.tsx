import React, { useState } from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { ChatContainer } from '../chat/ChatContainer';
import { UploadModal } from '../documents/UploadModal';
import { useDocuments } from '../../hooks/useDocuments';
import { useChat } from '../../hooks/useChat';

export const WorkspaceLayout: React.FC = () => {
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const {
    documents,
    selectedDocument,
    selectedDocumentId,
    setSelectedDocumentId,
    isLoading: isDocsLoading,
    error: docsError,
    refreshDocuments,
  } = useDocuments();

  const {
    messages,
    isLoading: isChatLoading,
    error: chatError,
    sendMessage,
    retryQuestion,
    clearChat,
  } = useChat(selectedDocumentId);

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[#F8F8F5]">
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
        }}
      />
    </div>
  );
};

