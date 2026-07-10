import api from '@/services/api';
import {
  DocumentResponse,
  DocumentListResponse,
  GenerateSopInput,
  RegenerateSopInput,
  Document,
} from '../types/document.types';

export interface Folder {
  id: string;
  userId: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  metadata: {
    total: number;
    page: number;
    limit: number;
  };
}

export interface AIAnalyticsData {
  provider: string;
  model: string;
  promptVersion: string;
  latency: number;
  tokens: number;
  cost: number;
  summary: {
    averageLatency: number;
    generationsCount: number;
    averageTokens: number;
    totalPromptTokens: number;
    totalCompletionTokens: number;
    totalEstimatedCost: number;
  };
}

/**
 * documentService
 *
 * Frontend service interfacing with all document workspace endpoints.
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
   * Regenerates a document with revision suggestions.
   */
  regenerateSop: async (input: RegenerateSopInput): Promise<DocumentResponse> => {
    const res = await api.post<DocumentResponse>('/documents/sop/regenerate', input);
    return res.data;
  },

  /**
   * Lists primary documents.
   */
  listDocuments: async (): Promise<DocumentListResponse> => {
    const res = await api.get<DocumentListResponse>('/documents');
    return res.data;
  },

  /**
   * Searches and filters documents.
   */
  searchDocuments: async (
    filters: {
      query?: string;
      type?: string;
      status?: string;
      tag?: string;
      folderId?: string;
    },
    sort: {
      sortBy: 'updatedAt' | 'title';
      sortOrder: 'asc' | 'desc';
    }
  ): Promise<DocumentListResponse> => {
    const params = {
      ...filters,
      sortBy: sort.sortBy,
      sortOrder: sort.sortOrder,
    };
    const res = await api.get<DocumentListResponse>('/documents/search', { params });
    return res.data;
  },

  /**
   * Gets specific document details.
   */
  getDocument: async (id: string): Promise<DocumentResponse> => {
    const res = await api.get<DocumentResponse>(`/documents/${id}`);
    return res.data;
  },

  /**
   * Saves text content updates.
   */
  saveEdits: async (id: string, text: string): Promise<DocumentResponse> => {
    const res = await api.post<DocumentResponse>(`/documents/${id}/save`, { text });
    return res.data;
  },

  /**
   * Restores a document to a historic version.
   */
  restoreVersion: async (id: string, versionId: string): Promise<DocumentResponse> => {
    const res = await api.post<DocumentResponse>(`/documents/${id}/restore`, { versionId });
    return res.data;
  },

  /**
   * Fetches paginated document versions.
   */
  getHistory: async (id: string, page = 1, limit = 10): Promise<PaginatedResponse<Document>> => {
    const res = await api.get<PaginatedResponse<Document>>(`/documents/${id}/history`, {
      params: { page, limit },
    });
    return res.data;
  },

  /**
   * Fetches paginated activity timeline.
   */
  getActivities: async (id: string, page = 1, limit = 10): Promise<PaginatedResponse<unknown>> => {
    const res = await api.get<PaginatedResponse<unknown>>(`/documents/${id}/activities`, {
      params: { page, limit },
    });
    return res.data;
  },

  /**
   * Fetches cached AI generation stats.
   */
  getAnalytics: async (id: string): Promise<{ success: boolean; data: AIAnalyticsData }> => {
    const res = await api.get<{ success: boolean; data: AIAnalyticsData }>(
      `/documents/${id}/analytics`
    );
    return res.data;
  },

  /**
   * Soft-deletes a document.
   */
  deleteDocument: async (id: string): Promise<{ success: boolean; data: { id: string } }> => {
    const res = await api.delete<{ success: boolean; data: { id: string } }>(`/documents/${id}`);
    return res.data;
  },

  /**
   * Updates document tagging, folder, favorite/pin state, or status.
   */
  updateMetadata: async (
    id: string,
    updates: {
      isPinned?: boolean;
      isFavorite?: boolean;
      folderId?: string | null;
      tags?: string[];
      status?: string;
    }
  ): Promise<DocumentResponse> => {
    const res = await api.put<DocumentResponse>(`/documents/${id}/metadata`, updates);
    return res.data;
  },

  // ─── FOLDER MANAGEMENT ENDPOINTS ───
  listFolders: async (): Promise<{ success: boolean; data: Folder[] }> => {
    const res = await api.get<{ success: boolean; data: Folder[] }>('/folders');
    return res.data;
  },

  createFolder: async (name: string): Promise<{ success: boolean; data: Folder }> => {
    const res = await api.post<{ success: boolean; data: Folder }>('/folders', { name });
    return res.data;
  },

  renameFolder: async (id: string, name: string): Promise<{ success: boolean; data: Folder }> => {
    const res = await api.put<{ success: boolean; data: Folder }>(`/folders/${id}`, { name });
    return res.data;
  },

  deleteFolder: async (id: string): Promise<{ success: boolean; data: { id: string } }> => {
    const res = await api.delete<{ success: boolean; data: { id: string } }>(`/folders/${id}`);
    return res.data;
  },
};

export default documentService;
