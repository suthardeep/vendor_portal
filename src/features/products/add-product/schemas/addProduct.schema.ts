import { z } from "zod";

export const createProductSchema = z.object({
  productName: z.string().min(3, "Product name is required"),
  
  // We track the hierarchy, but only the specific selected ID matters for submission
  mainCategoryId: z.string().min(1, "Category is required"),
  subCategoryId: z.string().optional(),
  childCategoryId: z.string().optional(),
  
  externalSku: z.string().min(1, "SKU is required"),
  
  hasVariants: z.boolean().default(false),
  
  hasBrandName: z.boolean().default(false),
  brandId: z.string().optional(),
}).superRefine((data, ctx) => {
  if (data.hasBrandName && !data.brandId) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Brand is required",
      path: ["brandId"],
    });
  }
});


export const basicDetailsSchema = z.object({
  description: z.string().min(10, "Description is too short"),
  bulletPoints: z.array(z.string()).max(5, "Max 5 bullet points"),
  media: z.array(z.any()), // MediaPicker type
  modelNumber: z.string().optional(),
  modelName: z.string().optional(),
  isFragile: z.boolean().default(false),
  manufacturerName: z.string().optional(),
  packerDetails: z.string().optional(),
  importerDetails: z.string().optional(),
  tags: z.array(z.string()),
  hsnCode: z.string().min(1, "HSN Code is required"),
  gstTaxSlab: z.string().min(1, "Tax Slab is required"),
  cessCode: z.string().optional(),
});