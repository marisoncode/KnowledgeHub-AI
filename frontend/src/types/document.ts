export type DocumentStatus = 'processing' | 'completed' | 'failed';

export interface DocumentItem {
  id: number;
  filename: string;
  file_path: string;
  file_type: string;
  status: DocumentStatus;
  created_at?: string;
  page_count?: number;
  chunk_count?: number;
}

export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}
