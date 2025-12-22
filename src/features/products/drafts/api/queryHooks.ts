import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import draftsApi from './queryFunctions';
import type {
  GetDraftProductsResponse,
  DraftProduct,
  DeleteDraftProductResponse,
  GetDraftProductsParams,
} from '../types/draft';
import { PaginationMeta } from '@/types/baseApi';

// Define query keys for effective caching and invalidation
export const draftsQueryKeys = {
  all: ['drafts'] as const,
  lists: (params: GetDraftProductsParams) => [...draftsQueryKeys.all, 'list', params] as const,
};

// Define the shape of the data returned by the list hook
type DraftsListResult = { data: DraftProduct[]; meta: PaginationMeta };

// --- GET All Draft Products Hook ---
export const useGetDraftProductsQuery = (params: GetDraftProductsParams) => {
  return useQuery<GetDraftProductsResponse | DraftsListResult, Error, DraftsListResult>({
    queryKey: draftsQueryKeys.lists(params),
    queryFn: () => {
      return draftsApi.getDraftProducts(params);
    },
    // Select function extracts data and meta from the nested response structure
    select: (response) => {
      // Real API response needs extraction
      const apiResponse = response as GetDraftProductsResponse;
      return {
        data: apiResponse.data.data,
        meta: apiResponse.data.meta,
      };
    },
  });
};

// --- Delete Draft Product Hook (useMutation) ---
export const useDeleteDraftProductMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<DeleteDraftProductResponse, Error, string>({
    mutationFn: (productId: string) => draftsApi.deleteDraftProduct(productId),
    // Invalidate all draft queries after deletion
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: draftsQueryKeys.all });
    },
  });
};

// --- Update Draft Product Status Hook (useMutation) ---
export const useUpdateDraftProductStatusMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<DeleteDraftProductResponse, Error, { productId: string; status: string }>({
    mutationFn: ({ productId, status }) => draftsApi.updateDraftProductStatus(productId, status),
    // Invalidate queries to refresh the data
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: draftsQueryKeys.all });
    },
  });
};