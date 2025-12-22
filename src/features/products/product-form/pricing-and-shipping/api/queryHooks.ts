import { useQuery, useMutation } from "@tanstack/react-query";
import {
  getVariantsPricing,
  updateVariantsPricing,
  getVariantsPriceBreakdown,
  getVariantPriceBreakdownById
} from "./queryFunctions";
import { VariantsPricingApiResponse } from "../types/pricing.types";

// Get variants for pricing (with pricing limits)
export const useGetVariantsPricingQuery = (productId: string) => {
  return useQuery<VariantsPricingApiResponse>({
    queryKey: ["variants-pricing", productId],
    queryFn: () => getVariantsPricing(productId),
    retry: false,
    enabled: !!productId,
  });
};

// Update variant pricing
export const useUpdateVariantsPricingMutation = (productId: string) => {
  return useMutation({
    mutationFn: (data: any) => updateVariantsPricing(productId, data),
  });
};

// Get variants price breakdown
export const useGetVariantsPriceBreakdownQuery = (productId: string) => {
  return useQuery({
    queryKey: ["variants-price-breakdown", productId],
    queryFn: () => getVariantsPriceBreakdown(productId),
    retry: false,
    enabled: !!productId,
  });
};

// Get variant price breakdown by ID
export const useGetVariantPriceBreakdownByIdQuery = (variantId: string, enabled = false) => {
  return useQuery({
    queryKey: ["variant-price-breakdown", variantId],
    queryFn: () => getVariantPriceBreakdownById(variantId),
    retry: false,
    enabled: !!variantId && enabled,
  });
};