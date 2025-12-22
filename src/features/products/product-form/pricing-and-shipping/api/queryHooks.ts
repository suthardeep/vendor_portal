import { useQuery, useMutation } from "@tanstack/react-query";
import {
  getVariantsPricing,
  updateVariantsPricing,
  getVariantsPriceBreakdown,
  getVariantPriceBreakdownById,
  submitProduct,
} from "./queryFunctions";
import { VariantsPricingApiResponse } from "../types/pricing.types";
import { queryClient } from "@/lib/queryClient";

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
    onSuccess: () => {
      // Invalidate the fetch query to ensure fresh data if the user comes back
      queryClient.invalidateQueries({ queryKey: ["product", productId] });
    },
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

// Submit product for approval
export const useSubmitProductMutation = (productId: string) => {
  return useMutation({
    mutationFn: () => submitProduct(productId),
    onSuccess: () => {
      // Invalidate the fetch query to ensure fresh data if the user comes back
      queryClient.invalidateQueries({ queryKey: ["product", productId] });
    },
  });
};
