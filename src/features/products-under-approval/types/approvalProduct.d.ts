import { PaginationMeta } from "@/types/baseApi";

// --- Base Types ---
interface BaseApiResponse<T> {
  statusCode: number;
  message: string;
  data: T;
}

// --- Approval Product Types ---
export interface ApprovalProduct {
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

export interface PaginatedApprovalProducts {
  data: ApprovalProduct[];
  meta: PaginationMeta;
}

// --- API Response Types ---
export type GetApprovalProductsResponse = BaseApiResponse<PaginatedApprovalProducts>;
export type DeleteApprovalProductResponse = BaseApiResponse<null>;

// --- Query Parameters ---
export interface GetApprovalProductsParams {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: string;
  categoryId?: string;
}

export interface UpdateApprovalProductParams {
  productId: string;
  data: Partial<ApprovalProduct>;
}