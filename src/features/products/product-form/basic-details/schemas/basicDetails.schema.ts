import { genderSchema } from "@/schema/genderSchema";
import { z } from "zod";

export const basicDetailsSchema = z.object({
  description: z.string().min(10, "Description is too short"),
  bulletPoints: z
    .array(z.string().trim().min(5, "Each bullet point must be at least 5 characters"))
    .min(1, "At least one bullet point is required")
    .max(5, "Max 5 bullet points"),
  // Validating that we have at least one media item
  mediaUrls: z.array(z.any()).min(1, "At least one image is required").max(10, "Max 10 images"),

  modelNumber: z.string().optional(),
  modelName: z.string().optional(),
  isFragile: z.boolean().default(false),

  manufacturerName: z.string().optional(),
  packerDetails: z.string().optional(),
  importerDetails: z.string().optional(),

  tags: z.array(z.string()),

  // New Fields
  targetGender: genderSchema(),
  targetAge: z.string().optional(),

  hsnCode: z
    .string()
    .trim()
    .min(4, "HSN Code must be at least 4 digits")
    .max(8, "HSN Code must be at most 8 digits")
    .regex(/^\d+$/, "HSN Code must contain only digits"),
  gstTaxSlab: z.string().optional(),
  cessCode: z.string().optional(),

  // Custom fields from category requirements
  customFields: z.array(
    z.object({
      groupName: z.string(),
      fields: z.record(z.string(), z.string().min(1, "This field is required")),
    })
  ).optional(),
});
