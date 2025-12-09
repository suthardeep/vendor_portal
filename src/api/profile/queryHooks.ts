import { useQuery } from "@tanstack/react-query";
import { getProfile } from "./queryFns";

/**
 * React Query hook to fetch user profile
 * @param enabled - Whether to enable the query (default: true)
 */
export const useGetProfile = (enabled: boolean = true) => {
  return useQuery({
    queryKey: ["profile"],
    queryFn: getProfile,
    enabled,
    retry: 1,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
