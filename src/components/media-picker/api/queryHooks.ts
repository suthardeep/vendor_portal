import { useMutation, useQuery, useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { fetchFiles, fetchFolders, uploadFiles } from "./queryFns";
import { MediaFileParams } from "../types/media.api";
import { PaginatedResponse, MediaItem, FolderResponse } from "../types/media.types";

const MEDIA_FOLDER_QUERY_KEY = "media-folder";
const MEDIA_FILE_QUERY_KEY = "media-file";
const GC_TIME = 1000 * 60 * 5;
const STALE_TIME = 1000 * 60 * 5;

export const useFoldersApi = (search: string , enabled:boolean) => {
  return useQuery<FolderResponse>({
    queryKey: [MEDIA_FOLDER_QUERY_KEY, search],
    queryFn: ()=> fetchFolders(search),
    gcTime: GC_TIME,
    enabled ,
    staleTime: STALE_TIME,
    retry: false,
    refetchOnWindowFocus:false,
    refetchOnMount:false,
    refetchOnReconnect:false,
  });
};

export const useFilesApi = (params: Omit<MediaFileParams, 'page'>) => {
  return useInfiniteQuery<PaginatedResponse<MediaItem>>({
    queryKey: [MEDIA_FILE_QUERY_KEY, params.group, params.search],
    queryFn: ({ pageParam = 1 }) => 
      fetchFiles({ ...params, page: pageParam as number, limit: 20 }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const currentPage = Number(lastPage.data.page);
      const totalPages = lastPage.data.totalPages;
      return currentPage < totalPages ? currentPage + 1 : undefined;
    },
    gcTime: GC_TIME,
    staleTime: STALE_TIME,
    retry: false,
    refetchOnWindowFocus:false,
    refetchOnMount:false,
    refetchOnReconnect:false,
    enabled: !!params.group, // Only fetch if folder is selected
  });
};

export const useUploadFiles = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: uploadFiles,
    onSuccess: (_, variables) => {
      // Invalidate folders in case a new one was created implicitly
      queryClient.invalidateQueries({ queryKey: [MEDIA_FOLDER_QUERY_KEY] });
      // Invalidate specific folder files
      queryClient.invalidateQueries({ 
        queryKey: [MEDIA_FILE_QUERY_KEY, variables.group] 
      });
    },
  });
};