import { useQuery, useMutation } from "@tanstack/react-query";
import { getVariations, generateCombinations, updateVariations } from "./queryFunctions";
import { VariationsApiResponse, CombinationItem } from "../types/variations.types";

// 1. Fetch Variations
export const useGetVariationsQuery = (productId: string) => {
  return useQuery<VariationsApiResponse>({
    queryKey: ["variations", productId],
    queryFn: () => getVariations(productId),
    retry: false,
    enabled: !!productId,
  });
};

// 2. Generate Combinations (Step 1 -> Step 2)
export const useGenerateCombinationsMutation = () => {
  return useMutation({
    mutationFn: (data: { productId: string; combinations: CombinationItem[] }) => 
      generateCombinations(data),
  });
};

// 3. Update Variations (Step 2 Save)
export const useUpdateVariationsMutation = () => {
  return useMutation({
    mutationFn: (data: { productId: string; variations: any[] }) => 
      updateVariations(data),
  });
};