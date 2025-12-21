import { z } from "zod";
import { createProductSchema, basicDetailsSchema } from "../schemas/addProduct.schema";

export type CreateProductFormValues = z.infer<typeof createProductSchema>;
export type BasicDetailsFormValues = z.infer<typeof basicDetailsSchema>;

export interface CatalogProduct {
  id: string;
  name: string;
  image?: string;
  category?: string;
}

export interface CategoryOption {
  id: string;
  name: string;
}

// API Responses based on your provided JSON
export interface Category {
  id: string;
  name: string;
  slug: string;
  level: "MAIN" | "SUB" | "CHILD";
  parentId?: string;
  subcategoryCount: number;
  childCategoryCount: number;
  isActive: boolean;
}

export interface CategoryApiResponse {
  statusCode: number;
  message: string;
  data: {
    data: Category[];
    meta: {
      currentPage: string;
      totalPages: number;
      totalRows: number;
    };
  };
}

export interface CreateProductPayload {
  name: string;
  categoryId: string;
  externalSku: string;
  hasVariants: boolean;
  hasBrand: boolean;
  brandName?: string;
  brandLogo?: string;
  categoryPath: string[]; // Parent -> Sub -> Child names
  brandId?: string;
}

export interface CreateProductResponse {
  statusCode: number;
  message: string;
  data: {
    id: string;
    name: string;
    status: string;
    // ... other fields matching API doc
  };
}

// Updated Brand interface to match new response fields
export interface Brand {
  id: string;
  brandName: string;
  brandLogo: string | null;
  selectedCategoryIds: string[];
}

// Updated wrapper to match the new nested response structure
export interface BrandsDataResponse {
  statusCode: number;
  message: string;
  data: {
    brands: Brand[];
    totalBrands: number;
  };
}
