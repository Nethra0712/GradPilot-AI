import { useQuery } from '@tanstack/react-query';
import { documentService } from '../services/document.service';

export const documentQueryKey = (id: string) => ['documents', id] as const;

/**
 * Hook to retrieve specific document details.
 */
export const useDocument = (id: string) => {
  return useQuery({
    queryKey: documentQueryKey(id),
    queryFn: () => documentService.getDocument(id),
    enabled: !!id,
  });
};

export default useDocument;
