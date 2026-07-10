import { useMutation, useQueryClient } from '@tanstack/react-query';
import { documentService } from '../services/document.service';
import { RegenerateSopInput, DocumentResponse } from '../types/document.types';
import { documentQueryKey } from './useDocument';
import { DOCUMENTS_QUERY_KEY } from './useDocuments';

/**
 * Mutation hook to regenerate/revise an existing Statement of Purpose.
 * Updates the document detail cache and general lists.
 */
export const useRegenerateSop = () => {
  const queryClient = useQueryClient();

  return useMutation<DocumentResponse, Error, RegenerateSopInput>({
    mutationFn: documentService.regenerateSop,
    onSuccess: (data) => {
      const docId = data.data.parentId || data.data.id;
      queryClient.invalidateQueries({ queryKey: documentQueryKey(docId) });
      queryClient.invalidateQueries({ queryKey: DOCUMENTS_QUERY_KEY });
    },
  });
};

export default useRegenerateSop;
