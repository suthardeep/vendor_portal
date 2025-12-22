import { z } from "zod";

// Simple validation schemas
export const variantDetailsSchema = z.object({
  id: z.string().min(1, "Variant ID is required"),
  aavakSku: z.string().min(1, "Aavak SKU is required"),
  sellerSku: z.string().optional(),
  eanUpc: z.string().optional(),
  description: z.string().optional(),
  targetAge: z.string().optional(),
  targetGender: z.string().optional(),
  quantity: z.union([z.string(), z.number()]).optional(),
  mediaIds: z.array(z.any()).optional(),
  mediaUrls: z.array(z.any()).optional(),
  attributes: z.record(z.string(), z.any()).optional(),
});

// API payload schema
export const variantDetailsApiPayloadSchema = z.object({
  variants: z.array(
    z.object({
      variantId: z.string().min(1, "Variant ID is required"),
      sellerSku: z.string().optional(),
      targetAge: z.string().optional(),
      targetGender: z.string().optional(),
      eanUpc: z.string().optional(),
      description: z.string().optional(),
      mediaUrls: z.array(z.any()).optional(),
      quantity: z.number().min(0, "Quantity must be non-negative"),
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
      quantity: typeof variant.quantity === "string" ? parseFloat(variant.quantity) || 0 : variant.quantity || 0,
    })),
  };
};