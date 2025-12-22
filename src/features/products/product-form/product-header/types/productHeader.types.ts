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
  brandLogo: string | null;

  categoryPath: string[];

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

  approvedAt: string | null;
  approvedBy: string | null;

  rejectedAt: string | null;
  rejectedBy: string | null;
  rejectionReason: string | null;
  rejectedFields: string[] | null;

  adminNotes: string | null;

  status: "draft" | "approved" | "rejected";

  targetAge?: string;
  targetGender?: string;
  quantity?: number;

  createdAt: string;
  updatedAt: string;
}


export interface ProductDataResponse {
  statusCode: number;
  message: string;
  data: ProductData;
}