export interface SourceCitation {
  filename: string;
  page: number;
  chunk?: number;
  score: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  sources?: SourceCitation[];
  timestamp: string;
  status?: 'sending' | 'success' | 'error';
  errorMessage?: string;
  questionRef?: string;
}

export interface ChatAskResponse {
  document_id: number;
  question: string;
  answer: string;
  sources: SourceCitation[];
}

