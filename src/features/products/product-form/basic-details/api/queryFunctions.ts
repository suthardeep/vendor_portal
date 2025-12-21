import apiService from "@/api/apiService";
import { SaveBasicDetailsPayload, BasicDetailsApiResponse } from "../types/basicDetails.types";
import { apiPaths } from "@/api/apiPaths";

export const getBasicDetails = async (productId: string): Promise<BasicDetailsApiResponse> => {
  return apiService({
    method: "GET",
    endpoint: apiPaths.products.getById(productId), // Standard details fetch
  });
};

export const saveBasicDetails = async (
  productId: string,
  data: SaveBasicDetailsPayload
): Promise<BasicDetailsApiResponse> => {
  return apiService({
    method: "POST", // Method from API doc
    data,
    endpoint: apiPaths.products.basicDetails(productId),
  });
};
