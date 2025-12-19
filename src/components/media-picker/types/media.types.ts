export interface MediaItem {
  id: string;
  originalName: string;
  fileName: string;
  s3Url: string;
  mimeType: string;
  fileSize: string | number;
  type: "image" | "video" | "pdf" | "other" | string;
  group: string;
  uploadedBy: string;
  uploaderType: string;
  createdAt: string;
  updatedAt: string;
}

export interface MinimalMediaProps {
  id:string;
  s3Url:string;
}

export interface MetaData {
  currentPage: number;
  pageSize: number;
  totalPages: number;
  currentRows: number;
  totalRows: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface PaginatedResponse<T> {
  statusCode: number;
  message: string;
  data: {
    data: T[];
    meta: MetaData;
  };
}