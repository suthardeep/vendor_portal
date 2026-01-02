import apiService from "@/api/apiService";
import { apiPaths } from "@/api/apiPaths";
import {
  CalculatePricingRequest,
  CalculatePricingResponse,
  UpdateVariantsPricingPayload,
  UpdateVariantsPricingResponse,
} from "../types/pricing.types";

// POST: /products/variants/calculate-pricing
export const calculatePricing = async (
  data: CalculatePricingRequest
): Promise<CalculatePricingResponse> => {
  return apiService({
    method: "POST",
    data,
    endpoint: apiPaths.variations.calculatePricing,
  });
};

// PATCH: /products/:id/variants/details
export const updateVariantsPricing = async (
  productId: string,
  data: UpdateVariantsPricingPayload
): Promise<UpdateVariantsPricingResponse> => {
  return apiService({
    method: "PATCH",
    data,
    endpoint: apiPaths.variations.updateVariantPricing,
  });
};

// POST: /products/:id/submit
export const submitProduct = async (productId: string) => {
  return apiService({
    method: "POST",
    endpoint: apiPaths.products.submit(productId),
  });
};
