import { PaginationMeta } from "@/types/baseApi";

// --- Base Types ---
interface BaseApiResponse<T> {
  statusCode: number;
  message: string;
  data: T;
}

// --- Active Product Types ---
export interface ActiveProduct {
  id: string;
  name: string;
  externalSku: string;
  categoryName: string;
  thumbnailUrl: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  quantity: number;
  // Pricing fields
  pricing: {
    minPrice: number;
    maxPrice: number;
  };
  basePrice: number;
  settlementPrice: number;
  // Legacy fields for backward compatibility
  categoryId?: string;
  categoryPath?: string[];
  brandName?: string;
  brandId?: string;
  brandLogo?: string;
  mediaUrls?: string[];
  // Additional fields from API response
  attributes?: any;
  hasVariants?: boolean;
  hasBrand?: boolean;
  vendorId?: string;
  createdByAdminId?: string;
  createdBy?: string;
  description?: string;
  bulletPoints?: string[];
  modelNumber?: string;
  modelName?: string;
  isFragile?: boolean;
  manufacturerName?: string;
  packerDetails?: string;
  importerDetails?: string;
  tags?: string[];
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
}

export interface PaginatedActiveProducts {
  data: ActiveProduct[];
  meta: PaginationMeta;
}

// --- API Response Types ---
export type GetActiveProductsResponse = BaseApiResponse<PaginatedActiveProducts>;
export type DeleteActiveProductResponse = BaseApiResponse<null>;

// --- Query Parameters ---
export interface GetActiveProductsParams {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: string;
  categoryId?: string;
}

export interface UpdateActiveProductParams {
  productId: string;
  data: Partial<ActiveProduct>;
}