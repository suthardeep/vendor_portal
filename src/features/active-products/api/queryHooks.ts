import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import activeProductsApi from './queryFunctions';
import type {
  GetActiveProductsResponse,
  ActiveProduct,
  DeleteActiveProductResponse,
  GetActiveProductsParams,
} from '../types/activeProduct';
import { PaginationMeta } from '@/types/baseApi';

// Define query keys for effective caching and invalidation
export const activeProductsQueryKeys = {
  all: ['activeProducts'] as const,
  lists: (params: GetActiveProductsParams) => [...activeProductsQueryKeys.all, 'list', params] as const,
};

// Define the shape of the data returned by the list hook
type ActiveProductsListResult = { data: ActiveProduct[]; meta: PaginationMeta };

// --- GET All Active Products Hook ---
export const useGetActiveProductsQuery = (params: GetActiveProductsParams) => {
  return useQuery<GetActiveProductsResponse | ActiveProductsListResult, Error, ActiveProductsListResult>({
    queryKey: activeProductsQueryKeys.lists(params),
    queryFn: () => {
      return activeProductsApi.getActiveProducts(params);
    },
    // Select function extracts data and meta from the nested response structure
    select: (response) => {
      // Real API response needs extraction
      const apiResponse = response as GetActiveProductsResponse;
      return {
        data: apiResponse.data.data,
        meta: apiResponse.data.meta,
      };
    },
  });
};

// --- Delete Active Product Hook (useMutation) ---
export const useDeleteActiveProductMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<DeleteActiveProductResponse, Error, string>({
    mutationFn: (productId: string) => activeProductsApi.deleteActiveProduct(productId),
    // Invalidate all active product queries after deletion
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: activeProductsQueryKeys.all });
    },
  });
};

// --- Update Active Product Status Hook (useMutation) ---
export const useUpdateActiveProductStatusMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<DeleteActiveProductResponse, Error, { productId: string; status: string }>({
    mutationFn: ({ productId, status }) => activeProductsApi.updateActiveProductStatus(productId, status),
    // Invalidate queries to refresh the data
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: activeProductsQueryKeys.all });
    },
  });
};