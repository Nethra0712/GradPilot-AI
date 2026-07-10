export type DocumentType =
  | 'SOP'
  | 'PERSONAL_STATEMENT'
  | 'CV'
  | 'RESEARCH_PROPOSAL'
  | 'SCHOLARSHIP_ESSAY'
  | 'EMAIL_PROFESSOR';
export type DocumentStatus =
  'DRAFT' | 'FINAL' | 'PENDING' | 'GENERATING' | 'COMPLETED' | 'FAILED' | 'REVIEW' | 'ARCHIVED';

export interface Document {
  id: string;
  userId: string;
  documentType: DocumentType;
  status: DocumentStatus;
  content: { text: string } | null;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
  title: string;
  version: number;
  generatedBy: string | null;
  promptVersion: string | null;
  provider: string | null;
  model: string | null;
  requestId: string | null;
  parentId: string | null;
  children?: Document[];

  // Sprint 9 extensions
  isPinned: boolean;
  isFavorite: boolean;
  tags: string[];
  folderId: string | null;
}

export interface DocumentResponse {
  success: boolean;
  data: Document;
  metadata?: {
    documentType: string;
    version: number;
  };
  requestId?: string;
}

export interface DocumentListResponse {
  success: boolean;
  data: Document[];
}

export interface GenerateSopInput {
  provider?: string;
  modelOverride?: string;
  title?: string;
  customVariables?: Record<string, unknown>;
  folderId?: string;
}

export interface RegenerateSopInput {
  documentId: string;
  feedbackInstructions: string;
  provider?: string;
  modelOverride?: string;
}
