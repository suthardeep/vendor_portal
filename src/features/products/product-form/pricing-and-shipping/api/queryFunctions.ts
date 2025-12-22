import apiService from "@/api/apiService";
import { apiPaths } from "@/api/apiPaths";
import { VariantsPricingApiResponse } from "../types/pricing.types";

// GET: /products/:id/variants (to get pricing data with limits)
export const getVariantsPricing = async (productId: string): Promise<VariantsPricingApiResponse> => {
  return apiService({
    method: "GET",
    endpoint: apiPaths.variations.getVariants(productId),
  });
};

// PATCH: /products/:id/variants/pricing
export const updateVariantsPricing = async (productId: string, data: any) => {
  return apiService({
    method: "PATCH",
    data,
    endpoint: apiPaths.variations.updateVariantPricing(productId),
  });
};

// GET: /products/:id/variants/price-breakdown
export const getVariantsPriceBreakdown = async (productId: string) => {
  return apiService({
    method: "GET",
    endpoint: apiPaths.variations.getVariantPriceBreakdown(productId),
  });
};

// GET: /products/variants/:variantId/price-breakdown
export const getVariantPriceBreakdownById = async (variantId: string) => {
  return apiService({
    method: "GET",
    endpoint: apiPaths.variations.getVariantPriceBreakdownById(variantId),
  });
};

// POST: /products/:id/submit
export const submitProduct = async (productId: string) => {
  return apiService({
    method: "POST",
    endpoint: apiPaths.products.submit(productId),
  });
};