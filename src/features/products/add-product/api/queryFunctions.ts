import apiService from "@/api/apiService";
import { CreateProductPayload, CreateProductResponse, BrandsDataResponse } from "../types/addProduct.types";
import { apiPaths } from "@/api/apiPaths";
import { BaseResponse } from "@/api/types/response.types";

export const createProduct = async (
  data: CreateProductPayload
): Promise<BaseResponse<CreateProductResponse>> => {
  return apiService({
    method: "POST",
    data,
    endpoint: apiPaths.products.draft, // Exact endpoint from doc
  });
};

export const getBrands = async (): Promise<BrandsDataResponse> => {
  return apiService({
    method: "GET",
    endpoint: apiPaths.products.brands,
  });
};
