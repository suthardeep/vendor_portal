import apiService from "@/api/apiService";
import { ProductDataResponse } from "../types/productHeader.types";
import { apiPaths } from "@/api/apiPaths";

export const getProductDetails = async (id: string) => {
  // Matches section 3 of provided Backend API Doc
  return apiService({
    method: "GET",
    endpoint: apiPaths.products.getById(id),
  }) as Promise<ProductDataResponse>;
};