import apiService from "@/api/apiService";
import { apiPaths } from "@/api/apiPaths";
import { VariantsApiResponse } from "../types/variations.types";

// POST: /products/:id/variants (Generate combinations)
export const generateCombinations = async (data: any) => {
  return apiService({
    method: "POST",
    data: { variants: data.variants },
    endpoint: apiPaths.variations.generate(data.productId),
  });
};

// GET: /products/:id/variants
export const getVariants = async (productId: string): Promise<VariantsApiResponse> => {
  return apiService({
    method: "GET",
    endpoint: apiPaths.variations.getVariants(productId),
  });
};

// PATCH: /products/:id/variants/details
export const updateVariantDetails = async (productId: string, data: any) => {
  return apiService({
    method: "PATCH",
    data,
    endpoint: apiPaths.variations.updateVariantDetails(productId),
  });
};