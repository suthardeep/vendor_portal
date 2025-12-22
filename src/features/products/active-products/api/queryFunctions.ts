import apiService from "@/api/apiService";
import { apiPaths } from "@/api/apiPaths";
import type {
  GetActiveProductsResponse,
  DeleteActiveProductResponse,
  GetActiveProductsParams,
} from '../types/activeProduct';

const activeProductsApi = {
  // Get all active products with pagination and search
  getActiveProducts: (params: GetActiveProductsParams): Promise<GetActiveProductsResponse> => {
    // Add status=active by default and filter out undefined values
    const cleanParams = Object.fromEntries(
      Object.entries({ ...params, status: 'active' }).filter(([_, value]) => value !== undefined)
    ) as Record<string, string | number | boolean>;

    return apiService({
      method: "GET",
      endpoint: apiPaths.products.myProducts,
      params: cleanParams,
    });
  },

  // Delete active product
  deleteActiveProduct: (productId: string): Promise<DeleteActiveProductResponse> => {
    return apiService({
      method: "DELETE",
      endpoint: `${apiPaths.products.myProducts}/${productId}`,
    });
  },

  // Update active product status
  updateActiveProductStatus: (productId: string, status: string): Promise<DeleteActiveProductResponse> => {
    return apiService({
      method: "PATCH",
      endpoint: `${apiPaths.products.myProducts}/${productId}/status`,
      data: { status },
    });
  },
};

export default activeProductsApi;