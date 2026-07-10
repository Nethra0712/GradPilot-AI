import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { documentService } from '../services/document.service';

export const FOLDERS_QUERY_KEY = ['folders'] as const;

/**
 * Hook to list folders owned by user.
 */
export const useFolders = () => {
  return useQuery({
    queryKey: FOLDERS_QUERY_KEY,
    queryFn: documentService.listFolders,
  });
};

/**
 * Hook to create a folder.
 */
export const useCreateFolder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: documentService.createFolder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: FOLDERS_QUERY_KEY });
    },
  });
};

/**
 * Hook to rename a folder.
 */
export const useRenameFolder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: { id: string; name: string }) =>
      documentService.renameFolder(input.id, input.name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: FOLDERS_QUERY_KEY });
    },
  });
};

/**
 * Hook to delete a folder.
 */
export const useDeleteFolder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: documentService.deleteFolder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: FOLDERS_QUERY_KEY });
    },
  });
};
