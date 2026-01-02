import { useMutation } from "@tanstack/react-query";
import {
  calculatePricing,
  updateVariantsPricing,
  submitProduct,
} from "./queryFunctions";
import {
  CalculatePricingRequest,
  CalculatePricingResponse,
  UpdateVariantsPricingPayload,
  UpdateVariantsPricingResponse,
} from "../types/pricing.types";
import { queryClient } from "@/lib/queryClient";

// Calculate settlement pricing for a variant
export const useCalculatePricingMutation = () => {
  return useMutation<CalculatePricingResponse, Error, CalculatePricingRequest>({
    mutationFn: (data) => calculatePricing(data),
  });
};

// Update variant pricing and shipping details
export const useUpdateVariantsPricingMutation = (productId: string) => {
  return useMutation<UpdateVariantsPricingResponse, Error, UpdateVariantsPricingPayload>({
    mutationFn: (data) => updateVariantsPricing(productId, data),
    onSuccess: () => {
      // Invalidate queries to ensure fresh data
      queryClient.invalidateQueries({ queryKey: ["product", productId] });
      queryClient.invalidateQueries({ queryKey: ["variants", productId] });
    },
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
