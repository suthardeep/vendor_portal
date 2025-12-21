import { apiPaths } from "@/api/apiPaths";
import apiService from "@/api/apiService";
import { GetProfileResponse } from "../types/profile";

/**
 * Get user profile
 */
export const getProfile = async (): Promise<GetProfileResponse> => {
  const data = await apiService<GetProfileResponse>({
    method: "GET",
    endpoint: apiPaths.profile.getProfile,
  });
  return data;
};
