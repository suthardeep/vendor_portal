import { z } from "zod";
import { basicDetailsSchema } from "../schemas/basicDetails.schema";
import { MinimalMediaProps } from "@/components/media-picker/types/media.types";
import { BaseResponse } from "@/api/types/response.types";

// Inferred from your Zod schema
export type BasicDetailsFormValues = z.infer<typeof basicDetailsSchema>;

export interface CustomField {
  groupName: string;
  fields: Record<string, string>;
}


// The shape of the data sent to the API
export interface SaveBasicDetailsPayload {
  description: string;
  bulletPoints: string[];
  mediaUrls: string[]; // API expects URLs
  modelNumber?: string;
  modelName?: string;
  isFragile: boolean;

  manufacturerName?: string;
  packerDetails?: string;
  importerDetails?: string;

  tags: string[];

  hsnCode: string;
  gstRate: number; // Changed from gstTaxSlab to gstRate (number)
  cessCode?: string;

  // Conditional variants - only sent when hasVariants is false
  variants?: Array<{
    targetAge?: string;
    targetGender?: string;
  }>;

  // Custom fields from category requirements
  customFields?: CustomField[]
}

// The shape of the data received from the API (GET)
export interface BasicDetailsResponse {
  id: string; // Product ID
  description: string;
  bulletPoints: string[];
  media: MinimalMediaProps[]; // Full objects needed for MediaPicker preview
  modelNumber: string;
  modelName: string;
  isFragile: boolean;
  
  targetGender: string;
  targetAge: string;
  
  manufacturerName: string;
  packerDetails: string;
  importerDetails: string;
  
  tags: string[];
  
  totalStockQty: number;
  hsnCode: string;
  gstTaxSlab: string;
  cessCode: string;
}

export interface BasicDetailsApiResponse extends BaseResponse<BasicDetailsResponse> {}