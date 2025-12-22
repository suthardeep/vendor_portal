import { z } from "zod";

// Form validation schema with required fields
export const variantDetailsSchema = z.object({
  id: z.string().min(1, "Variant ID is required"),
  aavakSku: z.string().min(1, "Aavak SKU is required"),
  sellerSku: z.string().min(1, "Seller SKU is required"),
  eanUpc: z.string().optional(),
  description: z.string().min(1, "Description is required"),
  targetAge: z.string().optional(),
  targetGender: z.string().optional(),
  quantity: z.union([z.string(), z.number()]).optional(),
  mediaUrls: z.array(z.string()).min(1, "At least one image/video is required"),
  attributes: z.record(z.string(), z.any()).optional(),
});

// API payload schema
export const variantDetailsApiPayloadSchema = z.object({
  variants: z.array(
    z.object({
      variantId: z.string().min(1, "Variant ID is required"),
      sellerSku: z.string().min(1, "Seller SKU is required"),
      targetAge: z.string().optional(),
      targetGender: z.string().optional(),
      eanUpc: z.string().optional(),
      description: z.string().min(1, "Description is required"),
      mediaUrls: z.array(z.any()).min(1, "At least one image/video is required"),
    })
  ).min(1, "At least one variant is required"),
});

// Type exports
export type VariantDetailsFormData = z.infer<typeof variantDetailsSchema>;
export type VariantDetailsApiPayload = z.infer<typeof variantDetailsApiPayloadSchema>;

// Simple validation functions
export const validateVariantDetails = (data: unknown) => {
  return variantDetailsSchema.safeParse(data);
};

export const validateApiPayload = (data: unknown) => {
  return variantDetailsApiPayloadSchema.safeParse(data);
};

// Transform form data to API payload
export const transformToApiPayload = (formData: VariantDetailsFormData[]): VariantDetailsApiPayload => {
  return {
    variants: formData.map((variant) => ({
      variantId: variant.id,
      sellerSku: variant.sellerSku || "",
      targetAge: variant.targetAge || "",
      targetGender: variant.targetGender || "",
      eanUpc: variant.eanUpc || "",
      description: variant.description || "",
      mediaUrls: variant.mediaUrls || [],
    })),
  };
};
