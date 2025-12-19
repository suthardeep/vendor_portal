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
  categoryId: string; // The final selected category ID (whether main, sub, or child)
  externalSku: string;
  hasVariants: boolean;
  brandId?: string;
}

export interface CreateProductResponse {
  statusCode: number;
  data: {
    id: string;
    // ... other fields
  };
}

export interface BrandData {
  brandId: string;
  brandName: string;
  brandLogo: string;
}

export interface BrandsDataResponse {
  data: BrandData[];
}
