import { Document, DocumentType, DocumentStatus } from '@prisma/client';

// ─── Structured JSON content for a document ───────────────────────────────────

export interface DocumentSection {
  key: string; // e.g. "introduction", "research_experience"
  heading: string;
  body: string;
}

export interface DocumentContent {
  title?: string;
  targetUniversity?: string;
  targetProgram?: string;
  sections: DocumentSection[];
}

// ─── Input types for Document CRUD ────────────────────────────────────────────

export interface CreateDocumentInput {
  userId: string;
  documentType: DocumentType;
  status?: DocumentStatus;
  content?: DocumentContent;
}

export interface UpdateDocumentInput {
  status?: DocumentStatus;
  content?: DocumentContent;
}

// ─── Query filter for document listing ────────────────────────────────────────

export interface DocumentFilters {
  userId: string;
  documentType?: DocumentType;
  status?: DocumentStatus;
  includeDeleted?: boolean; // defaults to false (soft-delete aware)
}

export type DocumentWithGenerations = Document & {
  aiGenerations: {
    id: string;
    createdAt: Date;
    tokensUsed: number | null;
    provider: string | null;
  }[];
};
