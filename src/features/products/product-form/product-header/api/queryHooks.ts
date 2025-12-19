import { useQuery } from "@tanstack/react-query";
import { getProductDetails } from "./queryFunctions";

export const useProductDetailsQuery = (id: string) => {
  return useQuery({
    queryKey: ["product", id],
    queryFn: () => getProductDetails(id),
    enabled: !!id,
  });
};