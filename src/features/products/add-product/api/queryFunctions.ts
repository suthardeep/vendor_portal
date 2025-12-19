import apiService from "@/api/apiService";
import { apiPaths } from "@/api/apiPaths";
import { BrandsDataResponse, Category, CategoryApiResponse, CreateProductPayload, CreateProductResponse } from "../types/addProduct.types";

export const getCategories = async (level: Category["level"] , parentId?: string): Promise<CategoryApiResponse> => {
  // In a real scenario, use apiService. For now, returning structure to match specific instructions
  // to use "apiService" pattern but "mock data" logic.
  
  const params: any = { level };
  if (parentId) params.parentId = parentId;

  return apiService({
    method: "GET",
    endpoint: apiPaths.products.categories,
    params,
  });
};

export const createProduct = async (data: CreateProductPayload): Promise<CreateProductResponse> => {
  return apiService({
    method: "POST",
    data,
    endpoint: apiPaths.products.create,
  });
};

// Mock Brand function
export const getBrands = async () => {
  return apiService({
    method: "GET",
    endpoint: apiPaths.products.brands,
  }) as Promise<BrandsDataResponse>;
};