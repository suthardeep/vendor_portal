import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import approvalProductsApi from './queryFunctions';
import type {
  GetApprovalProductsResponse,
  ApprovalProduct,
  DeleteApprovalProductResponse,
  GetApprovalProductsParams,
} from '../types/approvalProduct';
import { PaginationMeta } from '@/types/baseApi';

// Define query keys for effective caching and invalidation
export const approvalProductsQueryKeys = {
  all: ['approvalProducts'] as const,
  lists: (params: GetApprovalProductsParams) => [...approvalProductsQueryKeys.all, 'list', params] as const,
};

// Define the shape of the data returned by the list hook
type ApprovalProductsListResult = { data: ApprovalProduct[]; meta: PaginationMeta };

// --- GET All Approval Products Hook ---
export const useGetApprovalProductsQuery = (params: GetApprovalProductsParams) => {
  return useQuery<GetApprovalProductsResponse | ApprovalProductsListResult, Error, ApprovalProductsListResult>({
    queryKey: approvalProductsQueryKeys.lists(params),
    queryFn: () => {
      return approvalProductsApi.getApprovalProducts(params);
    },
    // Select function extracts data and meta from the nested response structure
    select: (response) => {
      // Real API response needs extraction
      const apiResponse = response as GetApprovalProductsResponse;
      return {
        data: apiResponse.data.data,
        meta: apiResponse.data.meta,
      };
    },
  });
};

// --- Delete Approval Product Hook (useMutation) ---
export const useDeleteApprovalProductMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<DeleteApprovalProductResponse, Error, string>({
    mutationFn: (productId: string) => approvalProductsApi.deleteApprovalProduct(productId),
    // Invalidate all approval product queries after deletion
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: approvalProductsQueryKeys.all });
    },
  });
};

// --- Update Approval Product Status Hook (useMutation) ---
export const useUpdateApprovalProductStatusMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<DeleteApprovalProductResponse, Error, { productId: string; status: string }>({
    mutationFn: ({ productId, status }) => approvalProductsApi.updateApprovalProductStatus(productId, status),
    // Invalidate queries to refresh the data
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: approvalProductsQueryKeys.all });
    },
  });
};