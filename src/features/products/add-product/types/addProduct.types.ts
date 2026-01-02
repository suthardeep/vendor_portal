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

export interface CreateProductPayload {
  name: string;
  externalSku: string;
  hasVariants: boolean;
  hasBrand: boolean;
  brandName?: string;
  brandLogo?: string;
  categories: Array<{ id: string; name: string }>; // Category hierarchy with id and name
  brandId?: string;
}

export interface CreateProductResponse {
  id: string;
  name: string;
  status: string;
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
