import apiService from "@/api/apiService";
import { ProductHeaderData } from "../types/productHeader.types";
import { apiPaths } from "@/api/apiPaths";

export const getProductDetails = async (id: string) => {
  // Matches section 3 of provided Backend API Doc
  const response:any = await apiService({
    method: "GET",
    endpoint: apiPaths.products.getById(id),
  });
  
  // Map API response to UI shape
  return {
    id: response.data.id,
    productName: response.data.name,
    status: response.data.status,
    categories: response.data.categoryPath || [],
    brandName: response.data.brandName,
    brandLogo: response.data.brandLogo,
  } as ProductHeaderData;
};