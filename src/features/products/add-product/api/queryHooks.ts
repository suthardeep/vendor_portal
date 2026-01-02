import { useQuery, useMutation } from "@tanstack/react-query";
import { createProduct, getBrands } from "./queryFunctions";
import {
  BrandsDataResponse,
  CreateProductPayload,
  CreateProductResponse,
} from "../types/addProduct.types";
import { BaseResponse } from "@/api/types/response.types";

export const useBrandsQuery = (enabled: boolean) => {
  return useQuery({
    queryKey: ["brands"],
    queryFn: getBrands,
    enabled: enabled,
    retry: false,
  });
};

export const useCreateProductMutation = () => {
  return useMutation<BaseResponse<CreateProductResponse>, Error, CreateProductPayload>({
    mutationFn: (data) => createProduct(data),
  });
};
