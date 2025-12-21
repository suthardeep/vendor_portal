import { PaginationMeta } from "@/types/baseApi";

// --- Base Types ---
interface BaseApiResponse<T> {
  statusCode: number;
  message: string;
  data: T;
}

// --- Draft Product Types ---
export interface DraftProduct {
  id: string;
  name: string;
  externalSku: string;
  categoryId: string;
  categoryPath: string[];
  brandName: string;
  brandId: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  // Additional fields from API response
  attributes?: any;
  hasVariants?: boolean;
  hasBrand?: boolean;
  brandLogo?: string;
  vendorId?: string;
  createdByAdminId?: string;
  createdBy?: string;
  description?: string;
  bulletPoints?: any;
  mediaUrls?: any;
  modelNumber?: string;
  modelName?: string;
  isFragile?: boolean;
  manufacturerName?: string;
  packerDetails?: any;
  importerDetails?: any;
  tags?: any;
  hsnCode?: string;
  gstRate?: number;
  cessCode?: string;
  approvedAt?: string;
  approvedBy?: string;
  rejectedAt?: string;
  rejectedBy?: string;
  rejectionReason?: string;
  rejectedFields?: any;
  adminNotes?: string;
  thumbnailUrl?: string;
}

export interface PaginatedDraftProducts {
  data: DraftProduct[];
  meta: PaginationMeta;
}

// --- API Response Types ---
export type GetDraftProductsResponse = BaseApiResponse<PaginatedDraftProducts>;
export type DeleteDraftProductResponse = BaseApiResponse<null>;

// --- Query Parameters ---
export interface GetDraftProductsParams {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: string;
  categoryId?: string;
}

export interface UpdateDraftProductParams {
  productId: string;
  data: Partial<DraftProduct>;
}