import { z } from "zod";

export const basicDetailsSchema = z.object({
  description: z.string().min(10, "Description is too short"),
  bulletPoints: z.array(z.string()).max(5, "Max 5 bullet points"),
  // Media is usually an array of objects/strings, handled by MediaPicker
  media: z.array(z.any()).min(1, "At least one image is required"),
  
  modelNumber: z.string().optional(),
  modelName: z.string().optional(),
  isFragile: z.boolean().default(false),
  
  manufacturerName: z.string().optional(),
  packerDetails: z.string().optional(),
  importerDetails: z.string().optional(),
  
  tags: z.array(z.string()),
  
  // New Fields requested
  targetGender: z.enum(["Male", "Female", "Unisex", "Kids"]).optional(),
  targetAgeGroup: z.string().optional(), // e.g., "18-24"
  
  // Inventory
  totalStockQty: z.string().refine((val) => !isNaN(Number(val)), "Must be a number"),

  hsnCode: z.string().min(1, "HSN Code is required"),
  gstTaxSlab: z.string().min(1, "Tax Slab is required"),
  cessCode: z.string().optional(),
});