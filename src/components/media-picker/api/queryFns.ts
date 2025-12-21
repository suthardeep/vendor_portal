import apiService from "@/api/apiService";
import { apiPaths } from "@/api/apiPaths";
import { MediaFileParams, UploadMediaProps, FolderSearchParams } from "../types/media.api";
import { MediaItem, PaginatedResponse } from "../types/media.types";

export const fetchFolders = (params: FolderSearchParams) => {
  return apiService({
    method: "GET",
    endpoint: apiPaths.media.vendorFolders,
    params: {
      search: params.search,
      page: params.page,
      pageSize: params.pageSize
    }
  }) as Promise<PaginatedResponse<string>>;
};

export const fetchFiles = (params: MediaFileParams) => {
  return apiService({
    method: "GET",
    endpoint: apiPaths.media.vendorList,
    params: {
        page: params.page,
        pageSize: params.pageSize,
        group: params.group,
        search: params.search
    },
  }) as Promise<PaginatedResponse<MediaItem>>;
};

export const uploadFiles = (data: UploadMediaProps) => {
  const formData = new FormData();

  data.files.forEach((item) => {
    formData.append(`files`, item);
  });

  formData.append(`uploader`, "vendor");
  formData.append(`platformType`, "vendor");
  formData.append(`group`, data.group);

  return apiService({
    method: "POST",
    endpoint: apiPaths.media.bulkUpload,
    headers: {
      "Content-type": "multipart/form-data",
    },
    data: formData,
  });
};