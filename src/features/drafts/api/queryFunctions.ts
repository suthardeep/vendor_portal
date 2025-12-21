import apiService from "@/api/apiService";
import { apiPaths } from "@/api/apiPaths";
import type {
  GetDraftProductsResponse,
  DeleteDraftProductResponse,
  GetDraftProductsParams,
} from '../types/draft';

const draftsApi = {
  // Get all draft products with pagination and search
  getDraftProducts: (params: GetDraftProductsParams): Promise<GetDraftProductsResponse> => {
    // Add status=draft by default and filter out undefined values
    const cleanParams = Object.fromEntries(
      Object.entries({ ...params, status: 'draft' }).filter(([_, value]) => value !== undefined)
    ) as Record<string, string | number | boolean>;

    return apiService({
      method: "GET",
      endpoint: apiPaths.products.myProducts,
      params: cleanParams,
    });
  },

  // Delete draft product
  deleteDraftProduct: (productId: string): Promise<DeleteDraftProductResponse> => {
    return apiService({
      method: "DELETE",
      endpoint: `${apiPaths.products.myProducts}/${productId}`,
    });
  },

  // Update draft product status
  updateDraftProductStatus: (productId: string, status: string): Promise<DeleteDraftProductResponse> => {
    return apiService({
      method: "PATCH",
      endpoint: `${apiPaths.products.myProducts}/${productId}/status`,
      data: { status },
    });
  },
};

export default draftsApi;