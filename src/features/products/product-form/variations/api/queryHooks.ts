import { useQuery, useMutation } from "@tanstack/react-query";
import { 
  generateCombinations,
  getVariants,
  updateVariantDetails
} from "./queryFunctions";
import { VariantsApiResponse, CombinationItem } from "../types/variations.types";

// Generate Combinations (Step 1 -> Step 2)
export const useGenerateCombinationsMutation = () => {
  return useMutation({
    mutationFn: (data: { productId: string; combinations?: CombinationItem[]; variants?: any[] }) => 
      generateCombinations(data),
  });
};

// Get Variants
export const useGetVariantsQuery = (productId: string) => {
  return useQuery<VariantsApiResponse>({
    queryKey: ["variants", productId],
    queryFn: () => getVariants(productId),
    retry: false,
    enabled: !!productId,
  });
};

// Update Variant Details (Step 2 Save)
export const useUpdateVariantDetailsMutation = (productId: string) => {
  return useMutation({
    mutationFn: (data: any) => updateVariantDetails(productId, data),
  });
};