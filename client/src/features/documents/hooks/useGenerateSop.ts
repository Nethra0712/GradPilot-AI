import { useMutation, useQueryClient } from '@tanstack/react-query';
import { documentService } from '../services/document.service';
import { GenerateSopInput, DocumentResponse } from '../types/document.types';
import { DOCUMENTS_QUERY_KEY } from './useDocuments';

/**
 * Mutation hook to generate a Statement of Purpose.
 * Invalidates general documents query to keep lists in sync.
 */
export const useGenerateSop = () => {
  const queryClient = useQueryClient();

  return useMutation<DocumentResponse, Error, GenerateSopInput>({
    mutationFn: documentService.generateSop,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: DOCUMENTS_QUERY_KEY });
    },
  });
};

export default useGenerateSop;
