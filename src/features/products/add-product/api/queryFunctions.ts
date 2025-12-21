import apiService from "@/api/apiService";
import { 
  CategoryApiResponse, 
  CreateProductPayload, 
  CreateProductResponse, 
  BrandsDataResponse 
} from "../types/addProduct.types";
import { apiPaths } from "@/api/apiPaths";

export const getCategories = async (level: string, parentId?: string): Promise<CategoryApiResponse> => {
  return apiService({
    method: "GET",
    endpoint: apiPaths.products.categories,
    params: { level, parentId },
  });
};

export const createProduct = async (data: CreateProductPayload): Promise<CreateProductResponse> => {
  return apiService({
    method: "POST",
    data,
    endpoint: apiPaths.products.draft, // Exact endpoint from doc
  });
};

export const getBrands = async () => {
  return apiService({
    method: "GET",
    endpoint: apiPaths.products.brands,
  }) as Promise<BrandsDataResponse>;
};