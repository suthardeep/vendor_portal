import { useMutation, useQuery } from "@tanstack/react-query";
import { getCategories, getCategoryRequirements } from "./queryFns";
import { Category, CategoryRequirementsResponse } from "../types.category";
import { BaseResponse } from "../../../api/types/response.types";

// Reusable hook for categories based on dependency
export const useCategoriesQuery = (level: Category["level"], parentId?: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: ["categories", level, parentId],
    queryFn: () => getCategories(level, parentId),
    enabled: enabled,
    retry: false,
  });
};

export const useGetCategoryRequirementsQuery = (ids: string[]) => {
  return useQuery({
    queryKey: ["category-requirements", ids],
    queryFn: () => getCategoryRequirements(ids),
    enabled: ids.length > 0,
    gcTime: 5 * 60 * 1000,
    staleTime: 5 * 60 * 1000,
    retry: false,
    select: (data) => data.data,
  });
};

// i made mutation if user triggered action is needed
export const useGetCategoryRequirementsMutation = () => {
  return useMutation<BaseResponse<CategoryRequirementsResponse>, Error, string[]>({
    mutationFn: (ids) => getCategoryRequirements(ids),
  });
};
