import api from '@/services/api';
import {
  DocumentResponse,
  DocumentListResponse,
  GenerateSopInput,
  RegenerateSopInput,
} from '../types/document.types';

/**
 * documentService
 *
 * Frontend service interfacing with backend Document endpoints.
 */
export const documentService = {
  /**
   * Generates a new SOP document.
   */
  generateSop: async (input: GenerateSopInput): Promise<DocumentResponse> => {
    const res = await api.post<DocumentResponse>('/documents/sop/generate', input);
    return res.data;
  },

  /**
   * Regenerates a document with dynamic revision suggestions.
   */
  regenerateSop: async (input: RegenerateSopInput): Promise<DocumentResponse> => {
    const res = await api.post<DocumentResponse>('/documents/sop/regenerate', input);
    return res.data;
  },

  /**
   * Lists all primary documents.
   */
  listDocuments: async (): Promise<DocumentListResponse> => {
    const res = await api.get<DocumentListResponse>('/documents');
    return res.data;
  },

  /**
   * Gets details for a document.
   */
  getDocument: async (id: string): Promise<DocumentResponse> => {
    const res = await api.get<DocumentResponse>(`/documents/${id}`);
    return res.data;
  },

  /**
   * Soft-deletes a document.
   */
  deleteDocument: async (id: string): Promise<{ success: boolean; data: { id: string } }> => {
    const res = await api.delete<{ success: boolean; data: { id: string } }>(`/documents/${id}`);
    return res.data;
  },
};

export default documentService;
