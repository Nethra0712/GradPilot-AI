import { useQuery } from '@tanstack/react-query';
import { documentService } from '../services/document.service';

export const DOCUMENTS_QUERY_KEY = ['documents'] as const;

/**
 * Hook to retrieve all primary documents.
 */
export const useDocuments = () => {
  return useQuery({
    queryKey: DOCUMENTS_QUERY_KEY,
    queryFn: documentService.listDocuments,
  });
};

export default useDocuments;
