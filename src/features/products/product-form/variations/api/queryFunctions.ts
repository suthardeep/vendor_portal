import apiService from "@/api/apiService";
import { apiPaths } from "@/api/apiPaths";
import { VariationsApiResponse } from "../types/variations.types";

// POST: /api/v1/variations/generate
export const generateCombinations = async (data: any) => {
  return apiService({
    method: "POST",
    data,
    endpoint: apiPaths.variations.generate,
  });
};

// GET: /api/v1/products/:id/variations
export const getVariations = async (productId: string) => {
  return apiService({
    method: "GET",
    endpoint: apiPaths.variations.get(productId),
  }) as Promise<VariationsApiResponse>;
};

// PUT: /api/v1/products/:id/variations (Assuming this exists for Step 2 save)
export const updateVariations = async ({ productId, variations }: any) => {
  return apiService({
    method: "PUT",
    data: { variations },
    endpoint: apiPaths.variations.update(productId),
  });
};