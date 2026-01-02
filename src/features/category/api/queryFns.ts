import { apiPaths } from "../../../api/apiPaths";
import apiService from "../../../api/apiService";
import { BaseResponse } from "../../../api/types/response.types";
import { CategoryApiResponse, CategoryRequirementsResponse } from "../types.category";

export const getCategories = async (level: string, parentId?: string): Promise<CategoryApiResponse> => {
  return apiService({
    method: "GET",
    endpoint: apiPaths.products.categories,
    params: { level, parentId },
  });
};

export const getCategoryRequirements = (
  ids: string[]
): Promise<BaseResponse<CategoryRequirementsResponse>> => {
  return apiService({
    method: "GET",
    endpoint: apiPaths.category.fetchRequirements(),
    params: {
      ids: ids.join(","),
    },
  });
};
