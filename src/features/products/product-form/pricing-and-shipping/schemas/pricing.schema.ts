import { z } from "zod";

export const dimensionsSchema = z.object({
  length: z.number().min(0.1, "Length must be greater than 0"),
  width: z.number().min(0.1, "Width must be greater than 0"),
  height: z.number().min(0.1, "Height must be greater than 0"),
  weight: z.number().min(0.01, "Weight must be greater than 0"),
});

export const variantPricingSchema = z.object({
  variantId: z.string().min(1, "Variant ID is required"),
  mrp: z.number().min(1, "MRP must be greater than 0"),
  sellingPrice: z.number().min(1, "Selling price must be greater than 0"),
  aavakCoinsPrice: z.number().min(0, "Aavak coins price cannot be negative"),
  localCost: z.number().min(0, "Local cost cannot be negative"),
  regionalCost: z.number().min(0, "Regional cost cannot be negative"),
  nationalCost: z.number().min(0, "National cost cannot be negative"),
  dimensions: dimensionsSchema,
  quantity: z.number().min(0, "Quantity cannot be negative"),
});

export const updateVariantsPricingSchema = z.object({
  variants: z.array(variantPricingSchema).min(1, "At least one variant is required"),
});

export type VariantPricingFormData = z.infer<typeof variantPricingSchema>;
export type UpdateVariantsPricingFormData = z.infer<typeof updateVariantsPricingSchema>;