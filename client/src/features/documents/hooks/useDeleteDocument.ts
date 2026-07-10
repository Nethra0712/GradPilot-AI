import { useMutation, useQueryClient } from '@tanstack/react-query';
import { documentService } from '../services/document.service';
import { DOCUMENTS_QUERY_KEY } from './useDocuments';

/**
 * Mutation hook to delete a document.
 */
export const useDeleteDocument = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: documentService.deleteDocument,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: DOCUMENTS_QUERY_KEY });
    },
  });
};

export default useDeleteDocument;
