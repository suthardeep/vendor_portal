import { useQuery, useMutation } from "@tanstack/react-query";
import { getCategories, createProduct, getBrands } from "./queryFunctions";
import { Category, CreateProductPayload, CreateProductResponse } from "../types/addProduct.types";

// Reusable hook for categories based on dependency
export const useCategoriesQuery = (level: Category["level"], parentId?: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: ["categories", level, parentId],
    queryFn: () => getCategories(level, parentId),
    enabled: enabled,
  });
};

export const useBrandsQuery = (enabled: boolean) => {
  return useQuery({
    queryKey: ["brands"],
    queryFn: getBrands,
    enabled: enabled,
  });
};

export const useCreateProductMutation = () => {
  return useMutation<CreateProductResponse, Error, CreateProductPayload>({
    mutationFn: (data) => createProduct(data),
  });
};