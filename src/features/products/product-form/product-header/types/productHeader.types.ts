import { Category, CategoryRequirementField } from "@/features/category/types.category";
import { CustomField } from "../../basic-details/types/basicDetails.types";

export interface ProductVariant {
  id: string;
  aavakSku: string;
  sellerSku: string | null;
  attributes: {
    size?: string;
    color?: string;
    [key: string]: any;
  };
  targetAge: string | null;
  targetGender: string | null;
  quantity: number;
  mrp: string | null;
  sellingPrice: string | null;
  aavakCoinsPrice: number | null;
  eanUpc: string | null;
  description: string | null;
  mediaUrls: string[];
  deliveryCharges: {
    local: {
      cost: number;
      unitDelivered: number;
    };
    regional: {
      cost: number;
      unitDelivered: number;
    };
    national: {
      cost: number;
      unitDelivered: number;
    };
  } | null;
  dimensions: {
    width: number;
    height: number;
    length: number;
    weight: number;
  } | null;
  pricing?: {
    onLocal: number;
    onRegional: number;
    onNational: number;
    userGets: number;
  };
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProductData {
  id: string;
  name: string;
  categoryId: string;
  externalSku: string;

  attributes: unknown | null;

  hasVariants: boolean;
  hasBrand: boolean;

  brandName: string | null;
  brandId: string | null;
  brandLogoUrl: string | null;

  categoryPath: string[];
  categories: Pick<Category , "id" | "name">[]

  customFields: CustomField[] | null;

  vendorId: string;

  createdByAdminId: string | null;
  createdBy: "vendor" | "admin";

  description: string | null;
  bulletPoints: string[] | null;

  mediaUrls: string[] | null;

  modelNumber: string | null;
  modelName: string | null;

  isFragile: boolean;

  manufacturerName: string | null;
  packerDetails: string | null;
  importerDetails: string | null;

  tags: string[] | null;

  hsnCode: string | null;
  gstRate: number | null;
  cessCode: string | null;

  minPrice: string;
  maxPrice: string;
  avgRating: string;

  reviewCount: number;
  viewCount: number;
  soldCount: number;

  approvedAt: string | null;
  approvedBy: string | null;

  rejectedAt: string | null;
  rejectedBy: string | null;
  rejectionReason: string | null;
  rejectedFields: string[] | null;

  adminNotes: string | null;

  status: "draft" | "approved" | "rejected" | "under_review";

  variants?: ProductVariant[];

  createdAt: string;
  updatedAt: string;
}


export interface ProductDataResponse {
  statusCode: number;
  message: string;
  data: ProductData;
}