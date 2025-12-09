import apiService from "@/api/apiService";
import { apiPaths } from "@/api/apiPaths";
import { User } from "@/types/user";

export interface ProfileResponse {
  statusCode: number;
  data: User;
}

/**
 * Fetch user profile
 * GET /profile
 */
export const getProfile = () => {
  return apiService<ProfileResponse>({
    method: "GET",
    endpoint: apiPaths.profile.getProfile,
  });
};
