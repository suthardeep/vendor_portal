import apiService from "@/api/apiService";
import { apiPaths } from "@/api/apiPaths";
import type {
  GetApprovalProductsResponse,
  DeleteApprovalProductResponse,
  GetApprovalProductsParams,
} from '../types/approvalProduct';

const approvalProductsApi = {
  // Get all approval products with pagination and search
  getApprovalProducts: (params: GetApprovalProductsParams): Promise<GetApprovalProductsResponse> => {
    // Add status=under_review by default and filter out undefined values
    const cleanParams = Object.fromEntries(
      Object.entries({ ...params, status: 'under_review' }).filter(([_, value]) => value !== undefined)
    ) as Record<string, string | number | boolean>;

    return apiService({
      method: "GET",
      endpoint: apiPaths.products.myProducts,
      params: cleanParams,
    });
  },

  // Delete approval product
  deleteApprovalProduct: (productId: string): Promise<DeleteApprovalProductResponse> => {
    return apiService({
      method: "DELETE",
      endpoint: `${apiPaths.products.myProducts}/${productId}`,
    });
  },

  // Update approval product status
  updateApprovalProductStatus: (productId: string, status: string): Promise<DeleteApprovalProductResponse> => {
    return apiService({
      method: "PATCH",
      endpoint: `${apiPaths.products.myProducts}/${productId}/status`,
      data: { status },
    });
  },
};

export default approvalProductsApi;