import { z } from "zod";
import { basicDetailsSchema } from "../schemas/basicDetails.schema";
import { MinimalMediaProps } from "@/components/media-picker/types/media.types";

// Inferred from your Zod schema
export type BasicDetailsFormValues = z.infer<typeof basicDetailsSchema>;

// The shape of the data sent to the API
export interface SaveBasicDetailsPayload {
  description: string;
  bulletPoints: string[];
  mediaIds: string[]; // API typically expects IDs, not full objects
  modelNumber?: string;
  modelName?: string;
  isFragile: boolean;
  
  targetGender?: string;
  targetAgeGroup?: string;
  
  manufacturerName?: string;
  packerDetails?: string;
  importerDetails?: string;
  
  tags: string[];
  
  totalStockQty: number; // Converted from string
  hsnCode: string;
  gstTaxSlab: string;
  cessCode?: string;
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
  targetAgeGroup: string;
  
  manufacturerName: string;
  packerDetails: string;
  importerDetails: string;
  
  tags: string[];
  
  totalStockQty: number;
  hsnCode: string;
  gstTaxSlab: string;
  cessCode: string;
}

export interface BasicDetailsApiResponse {
  statusCode: number;
  message: string;
  data: BasicDetailsResponse;
}