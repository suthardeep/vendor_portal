import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getBasicDetails, saveBasicDetails } from "./queryFunctions";
import { SaveBasicDetailsPayload, BasicDetailsApiResponse } from "../types/basicDetails.types";
import { queryClient } from "@/lib/queryClient";

export const useGetBasicDetailsQuery = (productId: string) => {
  return useQuery({
    queryKey: ["product-basic-details", productId],
    queryFn: () => getBasicDetails(productId),
    enabled: !!productId,
    retry: false,
    // Optional: Transform data if necessary before it reaches the component
    select: (response) => response.data 
  });
};

export const useSaveBasicDetailsMutation = (productId: string) => {
  return useMutation<BasicDetailsApiResponse, Error, SaveBasicDetailsPayload>({
    mutationFn: (data) => saveBasicDetails(productId, data),
    onSuccess: () => {
      // Invalidate the fetch query to ensure fresh data if the user comes back
      queryClient.invalidateQueries({ queryKey: ["product", productId] });
    },
  });
};