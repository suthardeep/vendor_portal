import { z } from "zod";

export const basicDetailsSchema = z.object({
  description: z.string().min(10, "Description is too short"),
  bulletPoints: z.array(z.string()).min(1, "At least one bullet point is required").max(5, "Max 5 bullet points"),
  // Validating that we have at least one media item
  media: z.array(z.any()).min(1, "At least one image is required"),
  
  modelNumber: z.string().optional(),
  modelName: z.string().optional(),
  isFragile: z.boolean().default(false),
  
  manufacturerName: z.string().optional(),
  packerDetails: z.string().optional(),
  importerDetails: z.string().optional(),
  
  tags: z.array(z.string()),
  
  // New Fields
  targetGender: z.enum(["Male", "Female", "Other"]).optional(),
  targetAgeGroup: z.string().optional(), 
  
  // Inventory (Handled as string in form for input handling, converted later)
  totalStockQty: z.string().refine((val) => !isNaN(Number(val)) && val !== "", {
    message: "Must be a valid number"
  }),

  hsnCode: z.string().min(1, "HSN Code is required"),
  gstTaxSlab: z.string().min(1, "Tax Slab is required"),
  cessCode: z.string().optional(),
});