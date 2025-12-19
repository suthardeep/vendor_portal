import apiService from "@/api/apiService";
import { SaveBasicDetailsPayload, BasicDetailsApiResponse } from "../types/basicDetails.types";

// Helper to construct the path
const getPath = (productId: string) => `/products/${productId}/basic-details`;

export const getBasicDetails = async (productId: string): Promise<BasicDetailsApiResponse> => {
  return apiService({
    method: "GET",
    endpoint: getPath(productId),
  });
};

export const saveBasicDetails = async (
  productId: string, 
  data: SaveBasicDetailsPayload
): Promise<BasicDetailsApiResponse> => {
  return apiService({
    method: "POST", // or PUT depending on your backend convention
    data,
    endpoint: getPath(productId),
  });
};