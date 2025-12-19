import apiService from "@/api/apiService";
import { apiPaths } from "@/api/apiPaths";
import { ProductHeaderData } from "../types/productHeader.types";

export const getProductDetails = async (id: string) => {
  return apiService({
    method: "GET",
    endpoint: apiPaths.products.getById(id),
  }) as Promise<ProductHeaderData>;
};