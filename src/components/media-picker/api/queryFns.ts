import apiService from "@/api/apiService";
import { apiPaths } from "@/api/apiPaths";
import { MediaFileParams, UploadMediaProps } from "../types/media.api";
import { FolderResponse, MediaItem, PaginatedResponse } from "../types/media.types";

export const fetchFolders = (search: string) => {
  return apiService({
    method: "GET",
    endpoint: apiPaths.media.vendorFolders,
    params: {search}
  }) as Promise<FolderResponse>;;
};

export const fetchFiles = (params: MediaFileParams) => {
  return apiService({
    method: "GET",
    endpoint: apiPaths.media.vendorList,
    params: {
        page: params.page,
        limit: params.limit,
        group: params.group,
        search: params.search
    },
  }) as Promise<PaginatedResponse<MediaItem>>;
};

export const uploadFiles = (data: UploadMediaProps) => {
  const formData = new FormData();

  data.files.forEach((item) => {
    // Note: dont do file[0]... here as the backend expects multiple "files" keys and not array
    formData.append(`files`, item);
  });

  formData.append(`uploader`, "vendor");
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